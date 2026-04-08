// Order Routes
// Order creation, management, and tracking endpoints

const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

// Protected routes
router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getUserOrders);

// Admin routes
router.get("/admin/stats", protect, admin, orderController.getDashboardStats);
router.get("/", protect, admin, orderController.getAllOrders);
router.put("/:id/status", protect, admin, orderController.updateOrderStatus);

// Dynamic route should stay last to avoid matching static paths like /admin/stats
router.get("/:id", protect, orderController.getOrderDetails);

module.exports = router;
