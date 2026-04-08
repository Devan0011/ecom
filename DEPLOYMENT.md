# Publish ElectroHub (Vercel + Render)

## 1) Push code to GitHub
Upload this project to a GitHub repository.

## 2) Deploy backend on Render
1. Open Render -> New -> Web Service.
2. Connect your GitHub repo.
3. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = strong secret
   - `JWT_EXPIRE` = `7d`
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `FRONTEND_URL` = (leave for now, update after frontend deploy)
5. Deploy and copy backend URL:
   - Example: `https://electrohub-api.onrender.com`

## 3) Deploy frontend on Vercel
1. Open Vercel -> Add New -> Project.
2. Import same GitHub repo.
3. Set Root Directory to `frontend`.
4. Add environment variable:
   - `VITE_API_URL` = `https://YOUR_RENDER_BACKEND_URL/api`
5. Deploy.

## 4) Final CORS update
1. Copy frontend URL from Vercel:
   - Example: `https://electrohub-store.vercel.app`
2. In Render backend env vars, set:
   - `FRONTEND_URL=https://electrohub-store.vercel.app`
3. Redeploy backend.

## 5) Admin access after publish
Open:
- `https://your-vercel-domain/admin/dashboard`

If your user is not admin, promote in MongoDB:
```javascript
use ecommerce
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```





cd "D:\Programming\Web pages\ecommerce"
git init
git add .
git commit -m "Initial commit - ElectroHub"
git branch -M main
git remote add origin https://github.com/Devan0011/ecom.git
git push -u origin main


git remote set-url origin https://github.com/Devan0011/ecom.git
git push -u origin main


Devan0011/devanportifolio