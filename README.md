# Tech Vimal International - Full Stack Application

Complete website with Admin Dashboard for Tech Vimal International Inspection & Certification Pvt. Ltd.

## 📁 Project Structure

```
TVI/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/      # Protected routes
│   │   │   ├── common/    # Reusable components
│   │   │   ├── layout/    # Navbar, Footer
│   │   │   ├── sections/  # Page sections
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── config/        # API configuration
│   │   ├── pages/
│   │   │   ├── admin/     # Admin Login & Dashboard
│   │   │   └── Home.jsx
│   │   └── services/      # API services
│   └── .env
│
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   └── .env
│
└── README.md
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env (copy from .env.example)
npm run seed    # Create admin user
npm run dev     # Start server on :5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Configure .env if needed
npm run dev     # Start on :3000
```

### 3. Access
- **Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **API Health:** http://localhost:5000/api/health

## 🔑 Admin Credentials
- **Email:** admin@techvimal.com
- **Password:** Admin@123

## 📦 Deployment

### Backend → Railway
1. Create Railway project
2. Add MongoDB service
3. Set environment variables
4. Deploy from GitHub
5. Run `railway run npm run seed`

### Frontend → Hostinger
1. Build production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Update `.env`:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```
3. Upload `dist/` folder to Hostinger `public_html/`
4. Add `.htaccess` for SPA routing:
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## 🔧 Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- shadcn/ui
- Tailwind CSS
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator
