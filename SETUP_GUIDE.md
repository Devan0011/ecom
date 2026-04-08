# 📚 Complete Setup Instructions

## Step-by-Step Installation Guide

### Phase 1: Initial Setup

#### 1.1 Clone/Extract the Project
```bash
cd d:\Programming\Web pages\ecommerce
```

### Phase 2: Backend Setup

#### 2.1 Install MongoDB
- **Local Installation**:
  - Download from: https://www.mongodb.com/try/download/community
  - Install MongoDB Community Server
  - Start MongoDB service

- **MongoDB Atlas (Cloud)**:
  - Go to https://www.mongodb.com/cloud/atlas
  - Create account and cluster
  - Get connection string

#### 2.2 Backend Installation
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Copy values from .env.example and update

npm run dev
```

Backend will start on: `http://localhost:5000`

### Phase 3: Frontend Setup

#### 3.1 Frontend Installation
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on: `http://localhost:3000`

### Phase 4: Initial Data Setup

#### 4.1 Create Admin User (Using API)

**Register Admin Account:**
- Go to: `http://localhost:3000/register`
- Fill in details for admin account
- Use email: `admin@example.com`

**Make User Admin (Backend Console or MongoDB):**
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

#### 4.2 Add Sample Products

Using Admin Panel:
1. Login as admin at: `http://localhost:3000/login`
2. Go to: `http://localhost:3000/admin/dashboard`
3. Click: "Manage Products"
4. Add products with:
   - Name
   - Description
   - Category
   - Brand
   - Price
   - Stock Quantity
   - Images (URLs)

#### 4.3 Add Banner Sliders

Using Admin Panel:
1. Go to: Admin > Manage Banners
2. Create banners with:
   - Title
   - Description
   - Image URL
   - Discount info
   - Action link

### Phase 5: Testing the App

#### 5.1 User Features
- [ ] Register new account
- [ ] Browse products
- [ ] Search and filter products
- [ ] View product details
- [ ] Add to cart
- [ ] Add to wishlist
- [ ] Remove from cart
- [ ] Proceed to checkout
- [ ] Place order
- [ ] View order history
- [ ] Update profile

#### 5.2 Admin Features
- [ ] View dashboard
- [ ] Manage products (CRUD)
- [ ] Manage orders
- [ ] Update order status
- [ ] Manage users
- [ ] Manage banners
- [ ] View analytics

### Phase 6: Configuration Tips

#### 6.1 MongoDB Configuration
**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

**MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

#### 6.2 Payment Integration (Optional)
- Get Stripe/Razorpay keys
- Add to `.env` file
- Update payment controller

#### 6.3 Email Configuration (Optional)
For order notifications:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
```

### Phase 7: Advanced Features

#### 7.1 Real-time Notifications
- Socket.io is configured
- Notifications work automatically
- Test with multiple browser tabs

#### 7.2 Dark Mode
- Toggle using sun/moon icon in header
- Preference persists in session

#### 7.3 Search & Filters
- Search by product name
- Filter by category, brand, price
- Full-text search enabled

### Phase 8: Common Issues & Solutions

#### Issue: Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

#### Issue: MongoDB Connection Error
- Check MongoDB service is running
- Verify connection string
- Ensure database name is correct

#### Issue: CORS Error
- Check frontend URL in backend .env
- Ensure backend is running
- Verify API endpoints

#### Issue: React Hot Reload Not Working
- Clear node_modules
- Reinstall dependencies
- Restart dev server

### Phase 9: Deployment Preparation

#### 9.1 Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

#### 9.2 Environment Variables for Production
```bash
# Backend
NODE_ENV=production
JWT_SECRET=strong-secret-key
DB_NAME=ecommerce_production

# Frontend  
REACT_APP_API_URL=https://your-api.com/api
```

#### 9.3 Deploy to Heroku (Backend)
```bash
# Initialize git
git init
git add .
git commit -m "initial commit"

# Create Heroku app
heroku create ecommerce-app

# Set environment variables
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

#### 9.4 Deploy to Vercel (Frontend)
```bash
npm i -g vercel
vercel login
vercel

# Set API URL in Vercel dashboard
```

### Phase 10: Maintenance & Monitoring

#### 10.1 Regular Backups
```bash
# MongoDB backup
mongodump --uri "mongodb://localhost:27017/ecommerce"

# Backup to cloud: Use MongoDB Atlas automated backups
```

#### 10.2 Performance Optimization
- Enable caching headers
- Compress images
- Minify CSS/JS
- Use CDN for images

#### 10.3 Security Checklist
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Regular security updates
- [ ] Monitor error logs

## 📞 Getting Help

### Resources
- Backend API: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- MongoDB: http://localhost:27017
- Admin Panel: http://localhost:3000/admin/dashboard

### Debug Mode
```bash
# Backend debug logging
DEBUG=* npm run dev

# Frontend debug
npm run dev -- --debug
```

### Common Credentials (Development Only)
```
Admin Email: admin@example.com
Admin Password: admin123
User Email: user@example.com
User Password: user123
```

## ✅ Completion Checklist

- [ ] Backend and Frontend repositories created
- [ ] MongoDB setup (local or cloud)
- [ ] .env files configured
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend app running (http://localhost:3000)
- [ ] Admin account created
- [ ] Sample products added
- [ ] Sample banners created
- [ ] Test orders placed
- [ ] Dark mode working
- [ ] Responsive design verified
- [ ] Admin panel fully functional
- [ ] Real-time notifications working
- [ ] PaymentWorks (dummy/test mode)
- [ ] Wishlist working
- [ ] Cart working
- [ ] Search and filters working

---

**Estimated Setup Time**: 30-45 minutes
**Last Updated**: April 2026
