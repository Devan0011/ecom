// Banner/Slider Model
// Manages homepage banner slides that can be controlled from admin panel

const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide banner title"],
    },
    description: String,
    image: {
      type: String,
      required: [true, "Please provide banner image"],
    },
    link: String,
    linkText: String,
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discount: String,
    discountCode: String,
    startDate: Date,
    endDate: Date,
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
    textColor: {
      type: String,
      default: "#000000",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
