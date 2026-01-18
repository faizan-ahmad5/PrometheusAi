import Chat from "../models/Chat.js";

// API controller for renaming a chat
export const renameChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, name } = req.body;
    if (!chatId || !name) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and new name are required.",
      });
    }
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }
    chat.name = name;
    await chat.save();
    res.json({ success: true, message: "Chat renamed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    res.json({ success: true, message: "New chat created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API controller for getting all chats of a user
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API controller for deleting a chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API controller for deleting all chats of a user
export const deleteAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    await Chat.deleteMany({ userId });

    res.json({ success: true, message: "All chats deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
