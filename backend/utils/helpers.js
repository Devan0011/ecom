// Utility Functions
// Common utility functions used throughout the application

// Calculate discount percentage
const getDiscountPercentage = (originalPrice, currentPrice) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};

// Truncate string
const truncateString = (str, length) => {
  return str.length > length ? str.slice(0, length) + "..." : str;
};

// Remove duplicates from array
const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

// Get pagination info
const getPaginationInfo = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  getDiscountPercentage,
  formatCurrency,
  generateOrderNumber,
  truncateString,
  removeDuplicates,
  getPaginationInfo,
  isValidEmail,
  isStrongPassword,
};
