// Review Routes
// Product review and rating endpoints

const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, admin } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

// Public route
router.get("/", reviewController.getProductReviews);

// Protected routes
router.post("/", protect, reviewController.createReview);
router.put("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
