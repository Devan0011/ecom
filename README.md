# ElectroHub - Full Stack E-Commerce Application

A production-grade, feature-rich e-commerce platform built with React, Node.js, Express, and MongoDB.

## 🌟 Project Overview

ElectroHub is a complete e-commerce solution designed for selling electronics and gadgets with:
- **Modern UI/UX** inspired by Flipkart and Amazon
- **Real-time notifications** using Socket.io
- **Professional admin panel** for store management
- **Responsive design** for all devices
- **Secure authentication** with JWT
- **Complete payment integration** support

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - WebSockets
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/           # Database and configuration
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   ├── uploads/           # Uploaded images
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   └── .env               # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── store/         # Zustand stores
    │   ├── services/      # API services
    │   ├── styles/        # Global styles
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    ├── index.html         # HTML template
    ├── package.json       # Dependencies
    └── vite.config.js     # Vite configuration
```

## ✨ Key Features

### 👥 User Features
- ✅ User registration & login
- ✅ Product browsing & search
- ✅ Advanced filtering (price, category, brand)
- ✅ Product details with reviews
- ✅ Shopping cart management
- ✅ Wishlist system
- ✅ Checkout process
- ✅ Multiple payment methods
- ✅ Order tracking
- ✅ User profile management
- ✅ Address management
- ✅ Dark/Light mode toggle

### 🚀 Premium Features
- ✅ Real-time notifications
- ✅ Product recommendations
- ✅ Advanced search
- ✅ Product ratings & reviews
- ✅ Discount system
- ✅ Free shipping on orders > ₹500
- ✅ Order timeline tracking

### 👨‍💼 Admin Features
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management & status updates
- ✅ User management
- ✅ Banner/slider management
- ✅ Sales statistics
- ✅ Order filtration

## 🎨 Design Highlights

- **Premium Banner Slider** - Auto-rotating hero banner controlled by admin
- **Amazon/Flipkart Style** - Professional e-commerce layout
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark Mode** - Built-in theme switcher
- **Smooth Animations** - Professional user experience
- **Real Product Images** - Support for multiple images per product

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Configure .env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
JWT_SECRET=your_secret_key

npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`

## 📚 API Documentation

### Authentication Routes
```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
POST   /api/auth/address           - Add address
```

### Product Routes
```
GET    /api/products               - Get all products
GET    /api/products/featured      - Get featured products
GET    /api/products/:id           - Get product details
GET    /api/products/filters       - Get available filters
POST   /api/products               - Create product (Admin)
PUT    /api/products/:id           - Update product (Admin)
DELETE /api/products/:id           - Delete product (Admin)
```

### Cart Routes
```
GET    /api/cart                   - Get cart
POST   /api/cart/add               - Add to cart
PUT    /api/cart/update            - Update cart item
DELETE /api/cart/:productId        - Remove from cart
DELETE /api/cart                   - Clear cart
```

### Order Routes
```
POST   /api/orders                 - Create order
GET    /api/orders/my-orders       - Get user orders
GET    /api/orders/:id             - Get order details
GET    /api/orders                 - Get all orders (Admin)
PUT    /api/orders/:id/status      - Update order status (Admin)
```

### Review Routes
```
GET    /api/products/:id/reviews   - Get product reviews
POST   /api/products/:id/reviews   - Create review
PUT    /api/products/:id/reviews/:reviewId - Update review
DELETE /api/products/:id/reviews/:reviewer - Delete review
```

### Banner Routes
```
GET    /api/banners                - Get active banners
GET    /api/banners/admin/all      - Get all banners (Admin)
POST   /api/banners                - Create banner (Admin)
PUT    /api/banners/:id            - Update banner (Admin)
DELETE /api/banners/:id            - Delete banner (Admin)
POST   /api/banners/update-order   - Update banner order (Admin)
```

### Wishlist Routes
```
GET    /api/wishlist               - Get wishlist
POST   /api/wishlist/add           - Add to wishlist
DELETE /api/wishlist/:productId    - Remove from wishlist
GET    /api/wishlist/check/:id     - Check if in wishlist
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes (middleware)
- CORS configuration
- Input validation
- Role-based access control (Admin/User)

## 📊 Database Schema

### User Model
```javascript
{
  firstName, lastName, email, password, phone, gender,
  role (user/admin), avatar, addresses, wishlist,
  isActive, lastLogin, timestamps
}
```

### Product Model
```javascript
{
  name, description, category, brand, price, originalPrice,
  discount, specification, images, stock, sold,
  averageRating, totalReviews, isFeatured, tags,
  createdBy, timestamps
}
```

### Order Model
```javascript
{
  orderNumber, user, items, shippingAddress, billingAddress,
  paymentMethod, paymentStatus, orderStatus, subtotal,
  shipping, tax, discount, total, transactionId, timeline
}
```

## 🎯 Admin Demo Account

```
Email: admin@example.com
Password: admin123
```

## 🌐 Deployment

### Backend (Heroku)
```bash
git push heroku main
```

### Frontend (Vercel)
```bash
vercel deploy
```

## 🛠️ Environment Variables

### Backend `.env`
```
MONGODB_URI=mongodb://...
PORT=5000
NODE_ENV=development
JWT_SECRET=secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=...
```

### Frontend Environment
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

### Backend
```
express: ^4.18.2
mongoose: ^7.0.0
bcryptjs: ^2.4.3
jsonwebtoken: ^9.0.0
socket.io: ^4.6.1
multer: ^1.4.5
stripe: ^12.0.0
```

### Frontend
```
react: ^18.2.0
react-router-dom: ^6.12.0
zustand: ^4.3.8
axios: ^1.4.0
tailwindcss: ^3.3.3
```

## 🤝 Contributing

Contributions welcome! Please follow the project's coding standards.

## 📝 License

This project is licensed under the MIT License.

## 📞 Support & Contact

For questions or issues:
- Email: support@electrohub.com
- Discord: [Join our community]
- GitHub Issues: [Report bugs]

## 🎉 Credits

Built with ❤️ for modern e-commerce solutions.

---

**Last Updated**: April 2026
**Version**: 1.0.0
