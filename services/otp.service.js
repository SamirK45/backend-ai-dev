import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// SMTP2GO transporter configuration
// Docs: https://www.smtp2go.com/setupguide/node-js-script/
// SMTP server: mail.smtp2go.com
// Recommended port: 2525 (also supports 8025, 587, 25)
// TLS is available on the same ports
const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false, // TLS will be used via STARTTLS on port 2525
  auth: {
    user: process.env.SMTP2GO_USERNAME,
    pass: process.env.SMTP2GO_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log("✅ SMTP2GO connection verified successfully"))
  .catch((err) => console.error("❌ SMTP2GO connection failed:", err.message));

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
    const info = await transporter.sendMail({
      from: `"AI Developer" <${process.env.SMTP2GO_SENDER_EMAIL}>`,
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

export { transporter };
