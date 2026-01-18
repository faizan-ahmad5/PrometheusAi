import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Community from "../models/Community.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

// Text-based AI chat message controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const userIdString = userId.toString();

    // check user credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId: userIdString, _id: chatId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Auto-name chat based on first user message
    if (chat.messages.length === 0 && chat.name === "New Chat") {
      // Extract first 50 characters from the prompt for the chat name
      chat.name = prompt.substring(0, 50).trim();
      if (prompt.length > 50) {
        chat.name += "...";
      }
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    // Save to database BEFORE sending response
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    // Send response only after everything is saved
    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const userIdString = userId.toString();

    // check user credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;
    // Find chat
    const chat = await Chat.findOne({ userId: userIdString, _id: chatId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Auto-name chat based on first user message
    if (chat.messages.length === 0 && chat.name === "New Chat") {
      // Extract first 50 characters from the prompt for the chat name
      chat.name = prompt.substring(0, 50).trim();
      if (prompt.length > 50) {
        chat.name += "...";
      }
    }

    // Push user message to chat
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Encode the prompt to be URL safe
    // Check if ImageKit is properly configured
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message:
          "Image generation service is not configured. Please contact support.",
      });
    }

    const encodedPrompt = encodeURIComponent(prompt);
    // Construct ImageKit AI Generation URL with simpler format
    const generatedImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encodedPrompt}/PromethusAi/${Date.now()}.png?tr=w-800,h-800`;

    console.log(`[IMAGE GENERATION] Generating image with prompt: ${prompt}`);
    console.log(
      `[IMAGE GENERATION] Using ImageKit endpoint: ${generatedImageUrl}`,
    );

    // Trigger image generation by fetching from ImageKit
    let aiImageResponse;
    try {
      console.log(
        `[IMAGE GENERATION] Starting axios.get request with 60s timeout...`,
      );
      aiImageResponse = await axios.get(generatedImageUrl, {
        responseType: "arraybuffer",
        timeout: 60000,
      });
      console.log(
        `[IMAGE GENERATION] Received image response with status:`,
        aiImageResponse.status,
      );
    } catch (error) {
      console.error(
        `[IMAGE GENERATION ERROR] Failed to generate image:`,
        error.response?.status,
        error.response?.data,
      );
      console.error(`[IMAGE GENERATION ERROR] Full error:`, error.message);
      console.error(`[IMAGE GENERATION ERROR] Error code:`, error.code);

      // Check for timeout errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        return res.status(408).json({
          success: false,
          message:
            "Image generation request timed out. This feature may be unavailable for your account. Please contact ImageKit support.",
        });
      }

      // Check for quota/rate limit errors
      if (
        error.response?.status === 429 ||
        error.response?.status === 403 ||
        error.message.includes("quota") ||
        error.message.includes("limit")
      ) {
        return res.status(429).json({
          success: false,
          message:
            "Image generation service is temporarily unavailable due to high demand or account limits. Please try again in a few minutes or check your ImageKit account quota.",
        });
      }

      return res.status(500).json({
        success: false,
        message: `Image generation failed: ${error.message}`,
      });
    }

    // convert to Base64
    let base64Image;
    try {
      console.log(`[IMAGE GENERATION] Converting image to base64...`);
      console.log(
        `[IMAGE GENERATION] Raw response data length: ${aiImageResponse.data.length} bytes`,
      );
      console.log(
        `[IMAGE GENERATION] Response data (first 100 bytes as text):`,
        aiImageResponse.data.toString().substring(0, 100),
      );

      // Check if response is just placeholder text (ImageKit returns text when feature is not enabled)
      const responseText = aiImageResponse.data.toString().trim();
      if (
        responseText === "The asset is currently being prepared" ||
        responseText.includes("being prepared") ||
        responseText.includes("not available") ||
        responseText.includes("not enabled")
      ) {
        console.error(
          `[IMAGE GENERATION ERROR] ImageKit returned placeholder message: "${responseText}"`,
        );
        return res.status(503).json({
          success: false,
          message:
            "AI Image Generation is not enabled on your ImageKit account. Please enable the AI Image Generation extension in your ImageKit dashboard under Extensions.",
        });
      }

      // Validate that we actually got image data (PNG files start with specific bytes)
      if (!aiImageResponse.data || aiImageResponse.data.length < 100) {
        console.error(
          `[IMAGE GENERATION ERROR] Invalid image data received - too small (${aiImageResponse.data.length} bytes)`,
        );
        return res.status(400).json({
          success: false,
          message:
            "Image generation failed - no valid image data received. ImageKit may not have generated the image. Please verify the AI Image Generation extension is enabled in your ImageKit account.",
        });
      }

      base64Image = Buffer.from(aiImageResponse.data, "binary").toString(
        "base64",
      );
      console.log(
        `[IMAGE GENERATION] Base64 conversion successful, size: ${base64Image.length} bytes`,
      );
    } catch (error) {
      console.error(
        `[IMAGE GENERATION ERROR] Base64 conversion failed:`,
        error.message,
      );
      return res.status(500).json({
        success: false,
        message: `Image processing failed: ${error.message}`,
      });
    }

    // Upload to ImageKit Media Library
    let uploadResponse;
    try {
      console.log(
        `[IMAGE GENERATION] Attempting to upload image to ImageKit...`,
      );
      uploadResponse = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder: "PromethusAi",
      });
      console.log(
        `[IMAGE GENERATION] Successfully uploaded image:`,
        uploadResponse.url,
      );
    } catch (error) {
      console.error(`[IMAGE GENERATION ERROR] Upload failed:`, error.message);
      console.error(`[IMAGE GENERATION ERROR] Upload error details:`, error);

      // Check for quota errors
      if (error.message.includes("quota") || error.message.includes("limit")) {
        return res.status(429).json({
          success: false,
          message:
            "Storage quota exceeded. Image generation service is temporarily unavailable.",
        });
      }

      return res.status(500).json({
        success: false,
        message: `Image upload failed: ${error.message}`,
      });
    }

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    // Save to database BEFORE sending response
    chat.messages.push(reply);
    await chat.save();

    // If published during generation, also save to Community collection
    if (isPublished) {
      try {
        await Community.create({
          userId: userIdString,
          userName: req.user.name || "Anonymous",
          imageUrl: uploadResponse.url,
          prompt: prompt,
          isPublished: true,
          publishedAt: new Date(),
        });
        console.log(
          `[IMAGE GENERATION] Image published to community for user: ${userIdString}`,
        );
      } catch (communityError) {
        console.error(
          `[IMAGE GENERATION] Failed to publish to community:`,
          communityError.message,
        );
      }
    }

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    console.log(
      `[IMAGE GENERATION] Successfully saved image message for user: ${userIdString}`,
    );

    // Send response only after everything is saved
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    });
    res.json({ success: true, reply });
  } catch (error) {
    console.error(
      `[IMAGE GENERATION ERROR] Unexpected error in imageMessageController:`,
      error,
    );
    console.error(`[IMAGE GENERATION ERROR] Stack:`, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Publish image to community
export const publishImageController = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { chatId, imageUrl } = req.body;

    if (!chatId || !imageUrl) {
      return res.json({
        success: false,
        message: "Chat ID and image URL are required",
      });
    }

    // Find the chat by chatId and userId
    const chat = await Chat.findOne({
      _id: chatId,
      userId: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Find the message index
    const messageIndex = chat.messages.findIndex(
      (msg) => msg.content === imageUrl && msg.isImage === true,
    );

    if (messageIndex !== -1) {
      const message = chat.messages[messageIndex];
      message.isPublished = true;
      await chat.save();

      // Also save to Community collection so it persists even if chat is deleted
      try {
        await Community.findOneAndUpdate(
          { imageUrl: imageUrl },
          {
            $set: {
              userId: userId,
              userName: req.user.name || "Anonymous",
              imageUrl: imageUrl,
              prompt: message.content,
              isPublished: true,
              publishedAt: new Date(),
            },
          },
          { upsert: true, new: true },
        );
        console.log(
          `[PUBLISH IMAGE] Image saved to community for user: ${userId}`,
        );
      } catch (communityError) {
        console.error(
          `[PUBLISH IMAGE] Failed to save to community:`,
          communityError.message,
        );
        // Don't fail the request if community save fails, but log it
      }

      res.json({
        success: true,
        message: "Image published to community successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found in this chat",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete image from chat (does not delete from community if already published)
export const deleteImageController = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { chatId, imageUrl } = req.body;

    if (!chatId || !imageUrl) {
      return res.json({
        success: false,
        message: "Chat ID and image URL are required",
      });
    }

    // Find the chat
    const chat = await Chat.findOne({
      _id: chatId,
      userId: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Find and remove the specific image message
    const messageIndex = chat.messages.findIndex(
      (msg) => msg.content === imageUrl && msg.isImage === true,
    );

    if (messageIndex !== -1) {
      // Store the published status before deletion
      const wasPublished = chat.messages[messageIndex].isPublished;

      // Remove the message from chat
      chat.messages.splice(messageIndex, 1);
      await chat.save();

      // Note: The image remains in the community if it was published
      res.json({
        success: true,
        message: wasPublished
          ? "Image deleted from chat (remains in community)"
          : "Image deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found in chat",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
