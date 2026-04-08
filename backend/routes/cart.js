// Cart Routes
// Shopping cart management endpoints

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const cartController = require("../controllers/cartController");

// Protected routes
router.get("/", protect, cartController.getCart);
router.post("/add", protect, cartController.addToCart);
router.put("/update", protect, cartController.updateCartItem);
router.delete("/:productId", protect, cartController.removeFromCart);
router.delete("/", protect, cartController.clearCart);

module.exports = router;
