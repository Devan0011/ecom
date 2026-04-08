// Product Model
// Stores product information including specifications, pricing, and inventory

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["Phones", "Laptops", "Tablets", "Accessories", "Audio", "Cameras"],
    },
    brand: {
      type: String,
      required: [true, "Please provide brand name"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    specification: {
      processor: String,
      ram: String,
      storage: String,
      display: String,
      battery: String,
      camera: String,
      os: String,
      weight: String,
      connectivity: String,
      features: [String],
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: 0,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1, brand: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
