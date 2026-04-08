// Product Routes
// Product listing, filtering, and management endpoints

const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const { validateProduct, validationErrors } = require("../middleware/validation");
const productController = require("../controllers/productController");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/filters", productController.getFilters);
router.get("/categories", productController.getCategories);
router.get("/:id", productController.getProductDetails);

// Admin routes
router.post("/", protect, admin, validateProduct, validationErrors, productController.createProduct);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;
