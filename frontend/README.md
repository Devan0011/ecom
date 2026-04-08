// Frontend README
# E-Commerce Frontend - Setup Guide

## 🚀 Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

3. **Build for Production**
```bash
npm run build
```

## 📁 Project Structure

### `/src/components`
Reusable React components:
- `Header.jsx` - Navigation bar with search and user menu
- `Footer.jsx` - Footer with links and contact info
- `Layout.jsx` - Main layout wrapper
- `ProductCard.jsx` - Product display card

### `/src/pages`
Full page components:
- `Home.jsx` - Homepage with banner slider
- `Products.jsx` - Product listing with filters
- `ProductDetail.jsx` - Single product details page
- `Cart.jsx` - Shopping cart page
- `Checkout.jsx` - Checkout and payment page
- `OrderSuccess.jsx` - Order confirmation page
- `Login.jsx` / `Register.jsx` - Authentication pages
- `UserProfile.jsx` - User profile management
- `Orders.jsx` / `WishList.jsx` - User account pages

### `/src/pages/admin`
Admin dashboard pages:
- `AdminDashboard.jsx` - Overview and statistics
- `AdminProducts.jsx` - Product CRUD operations
- `AdminOrders.jsx` - Order management and status updates
- `AdminUsers.jsx` - User management
- `AdminBanners.jsx` - Banner slider management

### `/src/store`
Zustand state management:
- `authStore.js` - User authentication and profile
- `cartStore.js` - Shopping cart state
- `productStore.js` - Product data
- `wishlistStore.js` - Wishlist management

### `/src/services`
API integration:
- `api.js` - Axios configuration with interceptors

### `/src/styles`
CSS files:
- `globals.css` - Global styles with Tailwind CSS

## 🎨 Features

### User Features
✅ User registration and login
✅ Product browsing with filters
✅ Product search functionality
✅ Shopping cart management
✅ Wishlist system
✅ Checkout process
✅ Order tracking
✅ User profile management
✅ Address management
✅ Product reviews and ratings
✅ Dark/Light mode toggle

### Admin Features
✅ Dashboard with statistics
✅ Product management (CRUD)
✅ Order management
✅ User management
✅ Banner/Slider management
✅ Order status updates
✅ Sales analytics

## 🔐 Authentication

JWT-based authentication using tokens stored in localStorage.

### Login Flow
1. User enters email and password
2. Backend validates credentials
3. JWT token returned
4. Token stored in localStorage
5. Token automatically added to API requests

## 🛒 Shopping Flow

1. **Browse Products** - View all products or search
2. **Apply Filters** - Filter by category, brand, price
3. **Add to Cart** - Select quantity and add items
4. **Wishlist** - Save items for later
5. **Checkout** - Enter shipping address and select payment method
6. **Order Confirmation** - View order details and tracking

## 🌙 Dark Mode

Toggle dark mode using the theme button in header. Preference is persisted in component state.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interface
- Optimized for all screen sizes

## 🔗 API Endpoints

See backend README for complete API documentation.

Key endpoints used:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🛠️ Troubleshooting

**CORS Error**: Check backend is running and CORS is configured
**API Not Responding**: Verify backend URL in `.env`
**Cart Empty After Refresh**: Ensure token is valid and stored
**Products Not Loading**: Check API endpoint and network connection

## 📞 Support

For issues or questions, please refer to the backend documentation or contact support.
