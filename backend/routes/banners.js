// Banner Routes
// Homepage banner management endpoints

const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const bannerController = require("../controllers/bannerController");

// Public route
router.get("/", bannerController.getActiveBanners);

// Admin routes
router.get("/admin/all", protect, admin, bannerController.getAllBanners);
router.post("/", protect, admin, bannerController.createBanner);
router.put("/:id", protect, admin, bannerController.updateBanner);
router.delete("/:id", protect, admin, bannerController.deleteBanner);
router.post("/update-order", protect, admin, bannerController.updateBannerOrder);

module.exports = router;
