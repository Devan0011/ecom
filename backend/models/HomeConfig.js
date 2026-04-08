const mongoose = require("mongoose");

const statsCardSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const budgetCardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const homeConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "home",
      unique: true,
      index: true,
    },
    sections: {
      showStats: { type: Boolean, default: true },
      showBudget: { type: Boolean, default: true },
      showLatest: { type: Boolean, default: true },
      showTopRated: { type: Boolean, default: true },
      showBrands: { type: Boolean, default: true },
      showPromo: { type: Boolean, default: true },
    },
    headings: {
      featured: { type: String, default: "Top Deals For You" },
      latest: { type: String, default: "Latest Arrivals" },
      topRated: { type: String, default: "Top Rated Picks" },
      budget: { type: String, default: "Shop By Budget" },
      brands: { type: String, default: "Top Brands On ElectroHub" },
    },
    statsCards: {
      type: [statsCardSchema],
      default: [
        { label: "Happy Shoppers", value: "50K+" },
        { label: "Orders Delivered", value: "120K+" },
        { label: "Partner Brands", value: "50+" },
        { label: "Daily Discounts", value: "200+" },
      ],
    },
    budgetCards: {
      type: [budgetCardSchema],
      default: [
        {
          title: "Under Rs. 10,000",
          subtitle: "Accessories and value picks",
          link: "/products?maxPrice=10000",
        },
        {
          title: "Rs. 10,001 - 30,000",
          subtitle: "Best value phones and tablets",
          link: "/products?minPrice=10001&maxPrice=30000",
        },
        {
          title: "Premium Range",
          subtitle: "Flagship and performance devices",
          link: "/products?minPrice=30001",
        },
      ],
    },
    brands: {
      title: { type: String, default: "Top Brands On ElectroHub" },
      useAutoBrands: { type: Boolean, default: true },
      manualBrands: { type: [String], default: [] },
    },
    promo: {
      eyebrow: { type: String, default: "ElectroHub Plus" },
      title: { type: String, default: "Unlock Exclusive Early Access Deals" },
      description: {
        type: String,
        default:
          "Get priority offers, flash sale alerts and limited-time coupons delivered straight to your profile.",
      },
      primaryText: { type: String, default: "Join Free" },
      primaryLink: { type: String, default: "/register" },
      secondaryText: { type: String, default: "Continue Shopping" },
      secondaryLink: { type: String, default: "/products" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeConfig", homeConfigSchema);
