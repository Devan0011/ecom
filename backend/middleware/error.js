// Error Handling Middleware
// Centralized error handling for the application

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Export error handler
module.exports.ErrorHandler = ErrorHandler;

// Error middleware
module.exports.errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    err = new ErrorHandler(message, 400);
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token", 400);
  }

  // JWT expire error
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token expired", 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
