import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // Auto-delete after 24 hours
});

const PendingRegistration =
  mongoose.models.PendingRegistration ||
  mongoose.model("PendingRegistration", pendingRegistrationSchema);

export default PendingRegistration;
