import nodemailer from "nodemailer";
import { getConfig } from "../config/config.js";

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  const config = await getConfig();

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
  });

  // Verify connection on startup
  transporter.verify()
    .then(() => console.log("✅ SMTP2GO connection verified successfully"))
    .catch((err) => console.error("❌ SMTP2GO connection failed:", err.message));

  return transporter;
}

// Initialize immediately
getTransporter();

/**
 * Send an email using SMTP2GO
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body content
 * @param {string} [options.text] - Plain text fallback
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const config = await getConfig();
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: `"${config.smtp.senderName}" <${config.smtp.senderEmail}>`,
      to,
      subject,
      html,
      text: text || "",
    });
    console.log("📧 Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("📧 Email send failed:", error.message);
    throw error;
  }
};

export { getTransporter };
