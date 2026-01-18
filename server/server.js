import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import communityRouter from "./routes/communityRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
import { verifyTransport } from "./utils/mailer.js";

const app = express();

await connectDB();
await verifyTransport();

// Stripe Webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks,
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);
app.use("/api/community", communityRouter);

// 404 Handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler - must be last
app.use((err, req, res, next) => {
  console.error("🔴 Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
