// Wishlist Routes
// User wishlist management endpoints

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const wishlistController = require("../controllers/wishlistController");

// Protected routes
router.get("/", protect, wishlistController.getWishlist);
router.post("/add", protect, wishlistController.addToWishlist);
router.delete("/:productId", protect, wishlistController.removeFromWishlist);
router.get("/check/:productId", protect, wishlistController.isInWishlist);

module.exports = router;
