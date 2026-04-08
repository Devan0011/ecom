# 📋 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { user_object }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { user_object }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": { user_object }
}
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+91 9876543210",
  "gender": "Male"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { updated_user_object }
}
```

### Add Address
```
POST /auth/address
Authorization: Bearer <token>
Content-Type: application/json

{
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India"
}

Response:
{
  "success": true,
  "message": "Address added successfully",
  "user": { user_with_address }
}
```

---

## 🛍️ Product Endpoints

### Get All Products
```
GET /products?page=1&limit=12&category=Phones&brand=Samsung&minPrice=5000&maxPrice=50000&search=phone&sort=-price

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 12)
- category: Filter by category
- brand: Comma-separated brands
- minPrice: Minimum price
- maxPrice: Maximum price
- search: Search term
- sort: Sort by field (prefix with - for descending)

Response:
{
  "success": true,
  "products": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

### Get Featured Products
```
GET /products/featured?limit=8

Response:
{
  "success": true,
  "products": [ ... ]
}
```

### Get Product Filters
```
GET /products/filters

Response:
{
  "success": true,
  "filters": {
    "brands": [ "Samsung", "Apple", ... ],
    "categories": [ "Phones", "Laptops", ... ],
    "priceRange": {
      "min": 1000,
      "max": 150000
    }
  }
}
```

### Get Product Details
```
GET /products/:id

Response:
{
  "success": true,
  "product": { product_object },
  "reviews": [ review_objects ]
}
```

### Create Product (Admin)
```
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "iPhone 14 Pro",
  "description": "Latest Apple flagship",
  "category": "Phones",
  "brand": "Apple",
  "price": 99999,
  "discount": 10,
  "stock": 50,
  "images": [
    { "url": "...", "alt": "Main" }
  ],
  "specification": {
    "processor": "A16 Bionic",
    "ram": "6GB",
    "storage": "128GB",
    "display": "6.1 inch OLED"
  }
}

Response:
{
  "success": true,
  "message": "Product created successfully",
  "product": { created_product }
}
```

### Update Product (Admin)
```
PUT /products/:id
Authorization: Bearer <admin_token>

{ updated_fields }

Response:
{
  "success": true,
  "message": "Product updated successfully",
  "product": { updated_product }
}
```

### Delete Product (Admin)
```
DELETE /products/:id
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 🛒 Cart Endpoints

### Get Cart
```
GET /cart
Authorization: Bearer <token>

Response:
{
  "success": true,
  "cart": {
    "user": "user_id",
    "items": [ { product, quantity, price } ],
    "totalPrice": 10000,
    "totalItems": 2
  }
}
```

### Add to Cart
```
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}

Response:
{
  "success": true,
  "message": "Product added to cart",
  "cart": { cart_object }
}
```

### Update Cart Item
```
PUT /cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}

Response:
{
  "success": true,
  "message": "Cart updated",
  "cart": { updated_cart }
}
```

### Remove from Cart
```
DELETE /cart/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { updated_cart }
}
```

### Clear Cart
```
DELETE /cart
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Cart cleared",
  "cart": { empty_cart }
}
```

---

## 📦 Order Endpoints

### Create Order
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "phone": "+91 9876543210"
  },
  "billingAddress": { same_as_shipping },
  "paymentMethod": "Credit Card"
}

Response:
{
  "success": true,
  "message": "Order created successfully",
  "order": { order_object }
}
```

### Get User Orders
```
GET /orders/my-orders?page=1&limit=10
Authorization: Bearer <token>

Response:
{
  "success": true,
  "orders": [ order_objects ],
  "pagination": { ... }
}
```

### Get Order Details
```
GET /orders/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "order": { order_object }
}
```

### Get All Orders (Admin)
```
GET /orders?page=1&limit=10&status=Pending
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "orders": [ order_objects ],
  "pagination": { ... }
}
```

### Update Order Status (Admin)
```
PUT /orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Shipped"
}

Response:
{
  "success": true,
  "message": "Order status updated",
  "order": { updated_order }
}
```

### Get Dashboard Stats (Admin)
```
GET /orders/admin/stats
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "stats": {
    "totalOrders": 100,
    "totalUsers": 50,
    "totalProducts": 200,
    "totalRevenue": 5000000,
    "ordersByStatus": [ ... ],
    "recentOrders": [ ... ]
  }
}
```

---

## ⭐ Review Endpoints

### Get Product Reviews
```
GET /products/:productId/reviews?page=1&limit=5

Response:
{
  "success": true,
  "reviews": [ review_objects ],
  "pagination": { ... }
}
```

### Create Review
```
POST /products/:productId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Excellent product",
  "comment": "Very satisfied with the purchase"
}

Response:
{
  "success": true,
  "message": "Review created successfully",
  "review": { review_object }
}
```

### Update Review
```
PUT /products/:productId/reviews/:reviewId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "title": "Good product",
  "comment": "Updated review"
}

Response:
{
  "success": true,
  "message": "Review updated successfully",
  "review": { updated_review }
}
```

### Delete Review
```
DELETE /products/:productId/reviews/:reviewId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## ❤️ Wishlist Endpoints

### Get Wishlist
```
GET /wishlist
Authorization: Bearer <token>

Response:
{
  "success": true,
  "wishlist": [ product_objects ]
}
```

### Add to Wishlist
```
POST /wishlist/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id"
}

Response:
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlist": [ product_objects ]
}
```

### Remove from Wishlist
```
DELETE /wishlist/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Product removed from wishlist",
  "wishlist": [ product_objects ]
}
```

### Check if in Wishlist
```
GET /wishlist/check/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "isInWishlist": true/false
}
```

---

## 🎨 Banner Endpoints

### Get Active Banners
```
GET /banners

Response:
{
  "success": true,
  "banners": [ banner_objects ]
}
```

### Get All Banners (Admin)
```
GET /banners/admin/all?page=1&limit=10
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "banners": [ banner_objects ],
  "pagination": { ... }
}
```

### Create Banner (Admin)
```
POST /banners
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Summer Sale",
  "description": "Get 50% off",
  "image": "image_url",
  "link": "/products?category=Phones",
  "linkText": "Shop Now",
  "discount": "50% OFF",
  "discountCode": "SUMMER50",
  "isActive": true
}

Response:
{
  "success": true,
  "message": "Banner created successfully",
  "banner": { banner_object }
}
```

### Update Banner (Admin)
```
PUT /banners/:id
Authorization: Bearer <admin_token>

{ updated_fields }

Response:
{
  "success": true,
  "message": "Banner updated successfully",
  "banner": { updated_banner }
}
```

### Delete Banner (Admin)
```
DELETE /banners/:id
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Banner deleted successfully"
}
```

---

## 🔄 Socket.io Real-time Events

### Connection
```javascript
socket.emit('joinUser', userId)
```

### Order Notifications
```javascript
// Listen for order status updates
socket.on('orderNotification', (data) => {
  // { message, status, orderNumber }
})

// Emit order status update (Admin)
socket.emit('orderStatusUpdated', {
  userId, orderNumber, status
})
```

### Admin Notifications
```javascript
// Listen for new orders
socket.on('adminNotification', (data) => {
  // { message, order }
})

// Emit new order
socket.emit('newOrder', orderObject)
```

---

## 📊 Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## 🔑 Sample API Calls

### Register & Login Flow
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+91 9876543210"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Shopping Flow
```bash
# Get Products
curl http://localhost:5000/api/products?category=Phones

# Get Product Details
curl http://localhost:5000/api/products/product_id

# Add to Cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{ "productId": "id", "quantity": 1 }'

# Checkout
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{ "shippingAddress": {...}, "paymentMethod": "Credit Card" }'
```

---

**API Version**: 1.0.0
**Last Updated**: April 2026
