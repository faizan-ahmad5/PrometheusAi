// sendContactFormEmail utility removed
import nodemailer from "nodemailer";

const hasSmtpConfig =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const verifyTransport = async () => {
  if (!transporter) {
    console.log("[SMTP] No SMTP config found - using dev mode (logs only)");
    return { verified: false, mode: "dev" };
  }
  try {
    await transporter.verify();
    console.log("[SMTP] ✓ Connection verified:", process.env.SMTP_HOST);
    console.log("[SMTP] Sender:", process.env.SMTP_FROM);
    return { verified: true };
  } catch (err) {
    console.error("[SMTP] ✗ Verification failed:", err.message);
    console.error("[SMTP] Check SMTP credentials and sender verification");
    console.error("[SMTP] Host:", process.env.SMTP_HOST);
    console.error("[SMTP] Port:", process.env.SMTP_PORT);
    console.error("[SMTP] User:", process.env.SMTP_USER);
    console.error("[SMTP] Password set:", !!process.env.SMTP_PASS);
    return { verified: false, error: err.message };
  }
};

export const sendPasswordResetEmail = async (to, token) => {
  const baseResetUrl =
    process.env.RESET_URL_BASE ||
    `${process.env.CLIENT_URL || "http://localhost:5173"}/reset`;
  const resetUrl = `${baseResetUrl}?token=${token}`;

  const from =
    process.env.SMTP_FROM || "PromethusAI <no-reply@promethusai.com>";
  const subject = "Reset your PromethusAI password";

  const text = [
    "Hi,",
    "We received a request to reset your PromethusAI password.",
    `Click the link below to create a new password: ${resetUrl}`,
    "This link expires in 1 hour.",
    "If you didn't request this, you can ignore this email.",
  ].join("\n\n");

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 32px 40px; text-align: center;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 12px; padding: 12px 20px; margin-bottom: 16px;">
                            <span style="font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                              <span style="background: linear-gradient(180deg, #ffffff 0%, #ffe8dc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">P</span>romethusAI
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              
                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">Reset your password</h1>
                    <p style="margin: 0 0 24px; font-size: 16px; color: #4a5568; line-height: 1.6;">
                      We received a request to reset your password. Click the button below to create a new password.
                    </p>
                  
                    <!-- CTA Button -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 8px 0 32px;">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 48px; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  
                    <!-- Alternative Link -->
                    <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; font-weight: 600;">Or copy and paste this link into your browser:</p>
                      <p style="margin: 0; font-size: 13px; color: #3b82f6; word-break: break-all; line-height: 1.5;">
                        ${resetUrl}
                      </p>
                    </div>
                  
                    <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                      This link will expire in <strong style="color: #1a1a1a;">1 hour</strong>.
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                      If you didn't request a password reset, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 32px 40px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                      © ${new Date().getFullYear()} PromethusAI. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                      Powered by advanced AI technology
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

  // Dev fallback: log the link when SMTP isn't configured
  if (!transporter) {
    console.log("[DEV] Password reset email ->", to, resetUrl);
    return { mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        "X-Mailer": "PromethusAI",
        "List-Unsubscribe": "<mailto:no-reply@promethusai.com>",
      },
    });
    console.log(
      `[SMTP] ✓ Password reset email sent to ${to} (messageId: ${info.messageId})`,
    );
    return { mocked: false, messageId: info.messageId };
  } catch (err) {
    console.error(
      "[SMTP] ✗ Password reset email send failed:",
      err?.message || err,
    );
    throw new Error("Failed to send password reset email. Please try again.");
  }
};
export const sendVerificationEmail = async (to, token) => {
  const baseVerifyUrl =
    process.env.VERIFICATION_URL_BASE ||
    `${process.env.CLIENT_URL || "http://localhost:5173"}/verify`;
  const verifyUrl = `${baseVerifyUrl}?token=${token}`;

  // Use a branded from address (must be a verified sender in your SMTP provider)
  const from =
    process.env.SMTP_FROM || "PromethusAI <no-reply@promethusai.com>";
  const subject = "Verify your PromethusAI account";

  const text = [
    "Hi,",
    "Thanks for signing up for PromethusAI.",
    `Please verify your email to activate your account: ${verifyUrl}`,
    "This link expires in 24 hours.",
    "If you did not sign up, you can ignore this email.",
  ].join("\n\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 32px 40px; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 12px; padding: 12px 20px; margin-bottom: 16px;">
                          <span style="font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <span style="background: linear-gradient(180deg, #ffffff 0%, #ffe8dc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">P</span>romethusAI
                          </span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 48px 40px;">
                  <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">Verify your email address</h1>
                  <p style="margin: 0 0 24px; font-size: 16px; color: #4a5568; line-height: 1.6;">
                    Welcome to PromethusAI! We're excited to have you on board. To get started, please verify your email address by clicking the button below.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 8px 0 32px;">
                        <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 48px; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Alternative Link -->
                  <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; font-weight: 600;">Or copy and paste this link into your browser:</p>
                    <p style="margin: 0; font-size: 13px; color: #3b82f6; word-break: break-all; line-height: 1.5;">
                      ${verifyUrl}
                    </p>
                  </div>
                  
                  <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                    This link will expire in <strong style="color: #1a1a1a;">24 hours</strong>.
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                    If you didn't create an account with PromethusAI, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 32px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                    © ${new Date().getFullYear()} PromethusAI. All rights reserved.
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                    Powered by advanced AI technology
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Dev fallback: log the link when SMTP isn't configured
  if (!transporter) {
    console.log("[DEV] Verification email ->", to, verifyUrl);
    return { mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        "X-Mailer": "PromethusAI",
        "List-Unsubscribe": "<mailto:no-reply@promethusai.com>",
      },
    });
    console.log(
      `[SMTP] ✓ Verification email sent to ${to} (messageId: ${info.messageId})`,
    );
    return { mocked: false, messageId: info.messageId };
  } catch (err) {
    console.error(
      "[SMTP] ✗ Verification email send failed:",
      err?.message || err,
    );
    throw new Error("Failed to send verification email. Please try again.");
  }
};
