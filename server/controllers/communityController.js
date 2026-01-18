import Community from "../models/Community.js";

// Get all published community images (public endpoint - no authentication required)
export const getPublishedImagesController = async (req, res) => {
  try {
    const images = await Community.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      images: images,
    });
  } catch (error) {
    console.error(
      `[COMMUNITY] Failed to fetch published images:`,
      error.message,
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch community images",
    });
  }
};

// Get user profile with their published images
export const getUserProfileController = async (req, res) => {
  try {
    const { userName } = req.params;

    const userImages = await Community.find({
      userName: userName,
      isPublished: true,
    })
      .sort({ publishedAt: -1 })
      .limit(50);

    if (userImages.length === 0) {
      return res.json({
        success: true,
        userName: userName,
        images: [],
        totalImages: 0,
      });
    }

    res.json({
      success: true,
      userName: userName,
      images: userImages,
      totalImages: userImages.length,
    });
  } catch (error) {
    console.error(`[COMMUNITY] Failed to fetch user profile:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

// Get all creators (for creator directory)
export const getCreatorsController = async (req, res) => {
  try {
    const creators = await Community.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: "$userName",
          imageCount: { $sum: 1 },
          latestImage: { $max: "$publishedAt" },
        },
      },
      { $sort: { imageCount: -1 } },
      { $limit: 50 },
    ]);

    res.json({
      success: true,
      creators: creators,
    });
  } catch (error) {
    console.error(`[COMMUNITY] Failed to fetch creators:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch creators",
    });
  }
};
