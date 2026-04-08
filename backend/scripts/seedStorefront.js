const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../models/Product");
const Banner = require("../models/Banner");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const products = [
  {
    name: "Nova X5 5G",
    description: "Flagship 5G smartphone with AMOLED display, fast charging, and OIS camera.",
    category: "Phones",
    brand: "ElectroMax",
    price: 29999,
    originalPrice: 34999,
    discount: 14,
    stock: 28,
    isFeatured: true,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/nova-x5/800/800", alt: "Nova X5 5G" }],
    specification: {
      display: "6.7-inch AMOLED 120Hz",
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "256GB",
      battery: "5000mAh",
      camera: "50MP + 12MP + 8MP",
    },
    tags: ["phone", "5g", "amoled"],
  },
  {
    name: "PixelWave A2",
    description: "Balanced daily-use phone with clean UI and long battery life.",
    category: "Phones",
    brand: "PixelWave",
    price: 17999,
    originalPrice: 20999,
    discount: 14,
    stock: 40,
    isFeatured: true,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/pixelwave-a2/800/800", alt: "PixelWave A2" }],
    specification: {
      display: "6.5-inch FHD+ 90Hz",
      processor: "MediaTek Dimensity 7050",
      ram: "6GB",
      storage: "128GB",
      battery: "5000mAh",
      camera: "64MP + 2MP",
    },
    tags: ["phone", "budget", "battery"],
  },
  {
    name: "TitanBook Pro 14",
    description: "Premium ultrabook for developers and creators with metal chassis.",
    category: "Laptops",
    brand: "Titan",
    price: 84999,
    originalPrice: 94999,
    discount: 11,
    stock: 15,
    isFeatured: true,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/titanbook-pro14/800/800", alt: "TitanBook Pro 14" }],
    specification: {
      display: "14-inch 2.8K IPS",
      processor: "Intel Core i7 13th Gen",
      ram: "16GB DDR5",
      storage: "1TB NVMe SSD",
      battery: "72Wh",
    },
    tags: ["laptop", "premium", "creator"],
  },
  {
    name: "AeroLite Slim 15",
    description: "Performance laptop with dedicated graphics for work and light gaming.",
    category: "Laptops",
    brand: "AeroLite",
    price: 65999,
    originalPrice: 73999,
    discount: 11,
    stock: 22,
    isFeatured: false,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/aerolite-slim15/800/800", alt: "AeroLite Slim 15" }],
    specification: {
      display: "15.6-inch FHD 144Hz",
      processor: "AMD Ryzen 7 7840HS",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      battery: "60Wh",
      features: ["RTX 4050 6GB"],
    },
    tags: ["laptop", "gaming", "work"],
  },
  {
    name: "TabOne Plus 11",
    description: "Large-screen tablet ideal for media, notes, and online classes.",
    category: "Tablets",
    brand: "TabOne",
    price: 26999,
    originalPrice: 30999,
    discount: 13,
    stock: 30,
    isFeatured: false,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/tabone-plus11/800/800", alt: "TabOne Plus 11" }],
    specification: {
      display: "11-inch 2K IPS",
      processor: "Snapdragon 7 Gen 1",
      ram: "8GB",
      storage: "256GB",
      battery: "8400mAh",
      features: ["Quad speakers"],
    },
    tags: ["tablet", "media", "education"],
  },
  {
    name: "SoundBeat Pro Buds",
    description: "True wireless earbuds with ANC and low-latency gaming mode.",
    category: "Audio",
    brand: "SoundBeat",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    stock: 75,
    isFeatured: true,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/soundbeat-probuds/800/800", alt: "SoundBeat Pro Buds" }],
    specification: {
      connectivity: "Bluetooth v5.3",
      battery: "42 hours with case",
      features: ["ANC up to 35dB", "IPX5", "Gaming mode"],
    },
    tags: ["audio", "tws", "anc"],
  },
  {
    name: "CineView ANC Headphones",
    description: "Over-ear wireless headphones with immersive bass and long battery.",
    category: "Audio",
    brand: "CineView",
    price: 7999,
    originalPrice: 10999,
    discount: 27,
    stock: 32,
    isFeatured: false,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/cineview-anc/800/800", alt: "CineView ANC Headphones" }],
    specification: {
      connectivity: "Bluetooth v5.2",
      battery: "55 hours",
      features: ["Hybrid ANC", "USB-C Fast Charge"],
    },
    tags: ["audio", "headphones", "wireless"],
  },
  {
    name: "SnapGrip 65W GaN Charger",
    description: "Compact fast charger with dual Type-C output for phones and laptops.",
    category: "Accessories",
    brand: "SnapGrip",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    stock: 120,
    isFeatured: false,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/snapgrip-65w/800/800", alt: "SnapGrip 65W GaN Charger" }],
    specification: {
      connectivity: "PD 3.0, PPS",
      features: ["65W", "GaN", "Dual USB-C"],
    },
    tags: ["accessory", "charger", "gan"],
  },
  {
    name: "VisionCam 4K Action Camera",
    description: "Rugged action cam with EIS stabilization and waterproof case.",
    category: "Cameras",
    brand: "VisionCam",
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    stock: 18,
    isFeatured: true,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/visioncam-4k/800/800", alt: "VisionCam 4K Action Camera" }],
    specification: {
      camera: "4K 60fps",
      connectivity: "Wi-Fi, Bluetooth",
      battery: "1350mAh",
      features: ["EIS", "Waterproof case"],
    },
    tags: ["camera", "action", "4k"],
  },
  {
    name: "FlexiType Wireless Combo",
    description: "Silent keyboard and ergonomic mouse combo with multi-device support.",
    category: "Accessories",
    brand: "FlexiType",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    stock: 56,
    isFeatured: false,
    isActive: true,
    images: [{ url: "https://picsum.photos/seed/flexitype-combo/800/800", alt: "FlexiType Wireless Combo" }],
    specification: {
      connectivity: "2.4GHz + Bluetooth",
      battery: "Up to 12 months",
      features: ["Full-size keyboard", "Ergonomic mouse", "Multi-device support"],
    },
    tags: ["accessory", "keyboard", "mouse"],
  },
];

const banners = [
  {
    title: "Flagship Phones Festival",
    description: "Save up to 40% on premium 5G smartphones this week.",
    image: "https://picsum.photos/seed/banner-phones/1400/500",
    link: "/products?category=Phones",
    linkText: "Shop Phones",
    order: 1,
    isActive: true,
    discount: "Up to 40% OFF",
    discountCode: "PHONE40",
    backgroundColor: "#0f172a",
    textColor: "#ffffff",
  },
  {
    title: "Laptop Power Deals",
    description: "Work, game, and create with top laptop picks at best prices.",
    image: "https://picsum.photos/seed/banner-laptops/1400/500",
    link: "/products?category=Laptops",
    linkText: "Explore Laptops",
    order: 2,
    isActive: true,
    discount: "Starting Rs. 59,999",
    discountCode: "LAPTOPLIVE",
    backgroundColor: "#111827",
    textColor: "#ffffff",
  },
  {
    title: "Audio Mega Sale",
    description: "Earbuds and headphones with immersive sound and deep discounts.",
    image: "https://picsum.photos/seed/banner-audio/1400/500",
    link: "/products?category=Audio",
    linkText: "Buy Audio",
    order: 3,
    isActive: true,
    discount: "Flat 30% OFF",
    discountCode: "SOUND30",
    backgroundColor: "#1e293b",
    textColor: "#ffffff",
  },
  {
    title: "Accessories Essentials",
    description: "Chargers, combos, and add-ons for every setup.",
    image: "https://picsum.photos/seed/banner-accessories/1400/500",
    link: "/products?category=Accessories",
    linkText: "View Accessories",
    order: 4,
    isActive: true,
    discount: "Combo Offers",
    discountCode: "ACCESS10",
    backgroundColor: "#0b3b6e",
    textColor: "#ffffff",
  },
  {
    title: "Weekend Camera Specials",
    description: "Capture every moment with 4K-ready camera gear.",
    image: "https://picsum.photos/seed/banner-cameras/1400/500",
    link: "/products?category=Cameras",
    linkText: "Shop Cameras",
    order: 5,
    isActive: true,
    discount: "Extra 10% OFF",
    discountCode: "CAM10",
    backgroundColor: "#1f2937",
    textColor: "#ffffff",
  },
];

async function seedStorefront() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const productOps = products.map((item) => ({
    updateOne: {
      filter: { name: item.name },
      update: { $set: item },
      upsert: true,
    },
  }));

  const bannerOps = banners.map((item) => ({
    updateOne: {
      filter: { title: item.title },
      update: { $set: item },
      upsert: true,
    },
  }));

  const productResult = await Product.bulkWrite(productOps);
  const bannerResult = await Banner.bulkWrite(bannerOps);

  const totalProducts = await Product.countDocuments();
  const totalBanners = await Banner.countDocuments();

  console.log("Storefront seed completed.");
  console.log("Products upserted:", productResult.upsertedCount, "modified:", productResult.modifiedCount);
  console.log("Banners upserted:", bannerResult.upsertedCount, "modified:", bannerResult.modifiedCount);
  console.log("Total products in DB:", totalProducts);
  console.log("Total banners in DB:", totalBanners);
}

seedStorefront()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
