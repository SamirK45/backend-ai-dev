import dotenv from "dotenv";

dotenv.config();

// ─── Remote Config ──────────────────────────────────────────
// ALL configurable settings are hosted remotely (GitHub Gist).
// Only secrets (API keys, passwords, connection strings) stay in .env.
// Edit the Gist → changes go live in ~5 minutes, no redeploy needed.
const REMOTE_CONFIG_URL = process.env.REMOTE_CONFIG_URL || "";
const REMOTE_CONFIG_REFRESH_MS = parseInt(process.env.REMOTE_CONFIG_REFRESH_MS, 10) || 5 * 60 * 1000; // 5 min

// ─── Fallback defaults (used only if remote fetch fails) ────
const DEFAULTS = {
  server:   { trustProxy: 1 },
  db:       { options: { useNewUrlParser: true, useUnifiedTopology: true } },
  jwt:      { expiresIn: "5h" },
  tokenBlacklist: { ttlSeconds: 18000 },
  bcrypt:   { saltRounds: 10 },
  cors:     { origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE", credentials: false },
  socketIO: { cors: { origin: "*" } },
  gemini:   { model: "gemini-3.1-flash-lite-preview", responseMimeType: "application/json", systemInstruction: "You are an expert software developer. Respond with valid JSON only." },
  smtp:     { host: "mail.smtp2go.com", port: 2525, secure: false, senderName: "AI Developer" },
  otp:      { length: 6, expiryMinutes: 10 },
  aiBot:    { id: "ai", email: "AI BOT", triggerKeyword: "@ai", errorMessage: "Sorry, I encountered an error. Please try again." },
  allowedEmailDomains: ["gmail.com", "outlook.com", "yahoo.com", "protonmail.com", "icloud.com"],
  logging:  { format: "dev" },
};

// ─── In-memory cache ────────────────────────────────────────
let _remoteConfig = null;
let _lastFetchedAt = 0;

async function fetchRemoteConfig() {
  if (_remoteConfig && Date.now() - _lastFetchedAt < REMOTE_CONFIG_REFRESH_MS) {
    return _remoteConfig;
  }

  if (!REMOTE_CONFIG_URL) {
    console.warn("⚠️  REMOTE_CONFIG_URL not set — using fallback defaults");
    _remoteConfig = DEFAULTS;
    _lastFetchedAt = Date.now();
    return _remoteConfig;
  }

  try {
    const response = await fetch(REMOTE_CONFIG_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    _remoteConfig = data;
    _lastFetchedAt = Date.now();
    console.log("✅ Remote config fetched successfully");
    return _remoteConfig;
  } catch (error) {
    console.error("❌ Failed to fetch remote config:", error.message);
    if (!_remoteConfig) _remoteConfig = DEFAULTS;
    return _remoteConfig;
  }
}

// ─── Helper: deep merge remote value with defaults ──────────
function get(remote, section, key) {
  return remote?.[section]?.[key] ?? DEFAULTS[section]?.[key];
}

// ─── Secrets-only config (from .env — never in remote) ──────
const secrets = {
  port:             parseInt(process.env.PORT, 10) || 3000,
  mongodbUri:       process.env.MONGODB_URI,
  redisHost:        process.env.REDIS_HOST,
  redisPort:        parseInt(process.env.REDIS_PORT, 10) || 6379,
  redisPassword:    process.env.REDIS_PASSWORD,
  jwtSecret:        process.env.JWT_SECRET,
  geminiApiKey:     process.env.GEMINI_AI_API_KEY,
  smtpUsername:     process.env.SMTP2GO_USERNAME,
  smtpPassword:     process.env.SMTP2GO_PASSWORD,
  smtpSenderEmail:  process.env.SMTP2GO_SENDER_EMAIL,
};

// ═══════════════════════════════════════════════════════════════
// EXPORTED: getConfig()  — async, returns the full merged config
// ═══════════════════════════════════════════════════════════════

export async function getConfig() {
  const r = await fetchRemoteConfig();

  return {
    server: {
      port: secrets.port,
      env: process.env.NODE_ENV || "development",
      trustProxy: get(r, "server", "trustProxy"),
    },

    db: {
      uri: secrets.mongodbUri,
      options: r?.db?.options ?? DEFAULTS.db.options,
    },

    redis: {
      host: secrets.redisHost,
      port: secrets.redisPort,
      password: secrets.redisPassword,
    },

    jwt: {
      secret: secrets.jwtSecret,
      expiresIn: get(r, "jwt", "expiresIn"),
    },

    tokenBlacklist: {
      ttlSeconds: get(r, "tokenBlacklist", "ttlSeconds"),
    },

    bcrypt: {
      saltRounds: get(r, "bcrypt", "saltRounds"),
    },

    cors: {
      origin: get(r, "cors", "origin"),
      methods: get(r, "cors", "methods"),
      credentials: get(r, "cors", "credentials"),
    },

    socketIO: {
      cors: {
        origin: r?.socketIO?.cors?.origin ?? DEFAULTS.socketIO.cors.origin,
      },
    },

    gemini: {
      apiKey: secrets.geminiApiKey,
      model: get(r, "gemini", "model"),
      responseMimeType: get(r, "gemini", "responseMimeType"),
      systemInstruction: get(r, "gemini", "systemInstruction"),
    },

    smtp: {
      host: get(r, "smtp", "host"),
      port: get(r, "smtp", "port"),
      secure: get(r, "smtp", "secure"),
      auth: {
        user: secrets.smtpUsername,
        pass: secrets.smtpPassword,
      },
      senderEmail: secrets.smtpSenderEmail,
      senderName: get(r, "smtp", "senderName"),
    },

    otp: {
      length: get(r, "otp", "length"),
      expiryMinutes: get(r, "otp", "expiryMinutes"),
    },

    aiBot: {
      id: get(r, "aiBot", "id"),
      email: get(r, "aiBot", "email"),
      triggerKeyword: get(r, "aiBot", "triggerKeyword"),
      errorMessage: get(r, "aiBot", "errorMessage"),
    },

    allowedEmailDomains: r?.allowedEmailDomains ?? DEFAULTS.allowedEmailDomains,

    logging: {
      format: get(r, "logging", "format"),
    },
  };
}

/** Force-refresh (reset cache timer) */
export async function refreshRemoteConfig() {
  _lastFetchedAt = 0;
  return fetchRemoteConfig();
}

// ─── Static secrets export (for files that need sync access to secrets only) ─
export default secrets;
