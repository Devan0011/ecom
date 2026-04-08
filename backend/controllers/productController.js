// Product Controller
// Handles product listing, filtering, searching, and management

const Product = require("../models/Product");
const Review = require("../models/Review");

const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }
  return value;
};

const parseBooleanField = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
};

// Get all products with filtering
exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.brand) {
      filter.brand = { $in: req.query.brand.split(",") };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Sort
    let sortBy = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(",");
      sortFields.forEach((field) => {
        if (field.startsWith("-")) {
          sortBy[field.slice(1)] = -1;
        } else {
          sortBy[field] = 1;
        }
      });
    } else {
      sortBy = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    }).limit(limit);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product with reviews
exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      product,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, brand, price, stock } = req.body;
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const discount = Number(req.body.discount || 0);
    const originalPrice =
      req.body.originalPrice !== undefined && req.body.originalPrice !== ""
        ? Number(req.body.originalPrice)
        : numericPrice;

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price: numericPrice,
      originalPrice,
      discount,
      stock: numericStock,
      isFeatured: parseBooleanField(req.body.isFeatured),
      specification: parseJsonField(req.body.specification, {}),
      images: parseJsonField(req.body.images, []),
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = { ...req.body };
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }
    if (updateData.discount !== undefined) {
      updateData.discount = Number(updateData.discount);
    }
    if (updateData.originalPrice !== undefined) {
      updateData.originalPrice = Number(updateData.originalPrice);
    }
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = parseBooleanField(updateData.isFeatured, product.isFeatured);
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = parseBooleanField(updateData.isActive, product.isActive);
    }
    if (req.body.specification !== undefined) {
      updateData.specification = parseJsonField(req.body.specification, {});
    }
    if (req.body.images !== undefined) {
      updateData.images = parseJsonField(req.body.images, []);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product filters (brands, price range, etc.)
exports.getFilters = async (req, res, next) => {
  try {
    const brands = await Product.distinct("brand", { isActive: true });
    const categories = await Product.distinct("category", { isActive: true });

    const priceStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      filters: {
        brands,
        categories,
        priceRange: {
          min: priceStats[0]?.minPrice || 0,
          max: priceStats[0]?.maxPrice || 100000,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
