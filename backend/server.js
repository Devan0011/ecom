// Main Server File
// Initializes Express app, connects to MongoDB, sets up routes and middleware

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/database");
const { errorMiddleware } = require("./middleware/error");

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const bannerRoutes = require("./routes/banners");
const wishlistRoutes = require("./routes/wishlist");
const homeConfigRoutes = require("./routes/homeConfig");

// Initialize app
const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/home-config", homeConfigRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "✅ Server is running" });
});

// Socket.io Real-time Notifications
const users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins with their ID
  socket.on("joinUser", (userId) => {
    users[userId] = socket.id;
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // Order status update - notify user
  socket.on("orderStatusUpdated", (data) => {
    const userSocket = users[data.userId];
    if (userSocket) {
      io.to(userSocket).emit("orderNotification", {
        message: `Your order #${data.orderNumber} is now ${data.status}`,
        status: data.status,
        orderNumber: data.orderNumber,
      });
    }
  });

  // Notify all admins of new order
  socket.on("newOrder", (order) => {
    io.emit("adminNotification", {
      message: `New order placed: #${order.orderNumber}`,
      order,
    });
  });

  socket.on("disconnect", () => {
    // Find and remove user
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log(`🔗 API: http://localhost:${PORT}/api\n`);
});

module.exports = { app, io };
