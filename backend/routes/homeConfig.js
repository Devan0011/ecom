const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const homeConfigController = require("../controllers/homeConfigController");

// Public route for storefront
router.get("/", homeConfigController.getHomeConfig);

// Admin routes
router.get("/admin", protect, admin, homeConfigController.getHomeConfig);
router.put("/admin", protect, admin, homeConfigController.updateHomeConfig);

module.exports = router;
