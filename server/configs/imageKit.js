import ImageKit from "imagekit";

// Validate required environment variables
const requiredVars = [
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
];

const missingVars = requiredVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.warn(
    `⚠️ Warning: Missing ImageKit environment variables: ${missingVars.join(
      ", ",
    )}`,
  );
  console.warn("ImageKit features will be unavailable. Check your .env file.");
}

// Initialize ImageKit only if all required variables are present
var imagekit = null;
if (missingVars.length === 0) {
  try {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    console.log("✅ ImageKit initialized successfully");
    console.log(
      `📊 Using ImageKit endpoint: ${process.env.IMAGEKIT_URL_ENDPOINT}`,
    );
  } catch (error) {
    console.error("❌ Failed to initialize ImageKit:", error.message);
    imagekit = null;
  }
}

export default imagekit;
