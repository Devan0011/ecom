// Banner Controller
// Manages homepage banners and promotional sliders

const Banner = require("../models/Banner");

// Get all active banners
exports.getActiveBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: new Date() } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: new Date() } },
          ],
        },
      ],
    }).sort({ order: 1 }).lean();

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all banners (Admin only)
exports.getAllBanners = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const banners = await Banner.find()
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Banner.countDocuments();

    res.status(200).json({
      success: true,
      banners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create banner (Admin only)
exports.createBanner = async (req, res, next) => {
  try {
    const {
      title,
      description,
      image,
      link,
      linkText,
      discount,
      discountCode,
      backgroundColor,
      textColor,
    } = req.body;

    const banner = await Banner.create({
      title,
      description,
      image,
      link,
      linkText,
      discount,
      discountCode,
      backgroundColor,
      textColor,
      order: await Banner.countDocuments(),
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update banner (Admin only)
exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete banner (Admin only)
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update banner order (Admin only)
exports.updateBannerOrder = async (req, res, next) => {
  try {
    const { banners } = req.body;

    // Update order for each banner
    for (let i = 0; i < banners.length; i++) {
      await Banner.findByIdAndUpdate(banners[i]._id, { order: banners[i].order });
    }

    const updatedBanners = await Banner.find().sort({ order: 1 }).lean();

    res.status(200).json({
      success: true,
      message: "Banner order updated",
      banners: updatedBanners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
