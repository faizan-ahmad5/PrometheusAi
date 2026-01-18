import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import PendingRegistration from "../models/PendingRegistration.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/mailer.js";

// Contact form controller removed
// API to reset password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Token and new password are required" });
  }
  try {
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API to initiate forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    return res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// API to register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists (verified or pending)
    const userExists = await User.findOne({ email });
    const pendingExists = await PendingRegistration.findOne({ email });

    if (userExists) {
      return res.json({
        success: false,
        message:
          "Registration failed. This email is already registered. Please log in or use a different email.",
      });
    }

    if (pendingExists) {
      // Delete old pending registration and create new one
      await PendingRegistration.deleteOne({ email });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Store pending registration (will auto-delete after 24 hours)
    await PendingRegistration.create({
      name,
      email,
      passwordHash,
      verificationToken: verificationTokenHash,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email asynchronously (fire and forget)
    sendVerificationEmail(email, verificationToken).catch((err) => {
      console.error(
        "[REGISTRATION] Failed to send verification email:",
        err.message,
      );
    });

    // Do not return token or grant access
    return res.json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// API to login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        return res.json({
          success: false,
          needsVerification: true,
          message: "Please verify your email before logging in.",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user._id);
        return res.json({ success: true, token });
      }
    }
    return res.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify email endpoint
export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Verification token is required." });
  }
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find pending registration
    const pendingReg = await PendingRegistration.findOne({
      verificationToken: tokenHash,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!pendingReg) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    // Check if user was already created in the meantime
    const existingUser = await User.findOne({ email: pendingReg.email });
    if (existingUser) {
      await PendingRegistration.deleteOne({ _id: pendingReg._id });
      return res.json({
        success: true,
        message: "Email verified successfully. You can now log in.",
      });
    }

    // Create the actual user account
    const user = new User({
      name: pendingReg.name,
      email: pendingReg.email,
      password: pendingReg.passwordHash,
      isVerified: true,
    });

    // Mark password as pre-hashed so the pre-save hook skips it
    user._isPasswordPreHashed = true;
    await user.save();

    // Delete pending registration
    await PendingRegistration.deleteOne({ _id: pendingReg._id });

    return res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

// Rate-limited resend verification endpoint
let resendVerificationRateLimit = {};
export const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }
  try {
    // Check if user is already verified
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: true,
        message: "Account is already verified. Please log in.",
      });
    }

    // Check if pending registration exists
    const pendingReg = await PendingRegistration.findOne({ email });
    if (!pendingReg) {
      // Prevent enumeration
      return res.json({
        success: true,
        message:
          "If your registration exists, a verification email has been sent.",
      });
    }

    // Rate limit: 1 per 2 minutes per email
    const now = Date.now();
    if (
      resendVerificationRateLimit[email] &&
      now - resendVerificationRateLimit[email] < 2 * 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another verification email.",
      });
    }
    resendVerificationRateLimit[email] = now;

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Update pending registration
    pendingReg.verificationToken = verificationTokenHash;
    pendingReg.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await pendingReg.save();

    // Send verification email asynchronously
    sendVerificationEmail(pendingReg.email, verificationToken).catch((err) => {
      console.error("[RESEND] Failed to send verification email:", err.message);
    });

    return res.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend verification email. Please try again.",
    });
  }
};

// Test email endpoint for debugging
export const testEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required for testing",
    });
  }
  try {
    console.log(`[TEST] Attempting to send test email to ${email}...`);
    const result = await sendVerificationEmail(
      email,
      "test-token-12345678901234567890",
    );
    console.log("[TEST] Email send result:", result);
    return res.json({
      success: true,
      message: "Test email sent successfully",
      result,
    });
  } catch (error) {
    console.error("[TEST] Failed to send test email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
};

// API to get user details (data)
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to get published images
export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.isImage": true, "messages.isPublished": true } },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);
    res.json({ success: true, images: publishedImageMessages.reverse() });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
