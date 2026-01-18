import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 20 },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  // Skip hashing if password is already hashed (starts with $2a$ or $2b$)
  if (!this.isModified("password")) {
    return next();
  }

  // Skip hashing if marked as pre-hashed
  if (this._isPasswordPreHashed) {
    return next();
  }

  // Check if password is already bcrypt hashed
  if (
    this.password &&
    (this.password.startsWith("$2a$") || this.password.startsWith("$2b$"))
  ) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
