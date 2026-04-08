// README - Backend Setup Instructions

# E-Commerce Backend - Setup Guide

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup
Create a `.env` file in the backend directory:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Server will run on `http://localhost:5000`

## 📁 Folder Structure

- **config/** - Database configuration
- **models/** - Mongoose schemas (User, Product, Order, etc.)
- **controllers/** - Business logic for each route
- **routes/** - API endpoints
- **middleware/** - Authentication, validation, error handling
- **utils/** - Utility functions
- **uploads/** - User and product image storage

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product details
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Cart
- GET `/api/cart` - Get cart
- POST `/api/cart/add` - Add to cart
- PUT `/api/cart/update` - Update cart item
- DELETE `/api/cart/:productId` - Remove from cart

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my-orders` - Get user orders
- GET `/api/orders/:id` - Get order details
- PUT `/api/orders/:id/status` - Update order status (Admin)

### Reviews
- GET `/api/products/:productId/reviews` - Get reviews
- POST `/api/products/:productId/reviews` - Create review

## 🔐 Authentication

All protected routes require JWT token in Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## 📊 Database Collections

- **Users** - User accounts and profiles
- **Products** - Product catalog
- **Orders** - User orders
- **Cart** - Shopping carts
- **Reviews** - Product reviews
- **Banners** - Homepage promotional banners
