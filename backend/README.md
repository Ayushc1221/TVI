# Tech Vimal International - Backend API

Node.js/Express backend with MongoDB for the Tech Vimal International website.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Local Development

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy .env.example to .env and update values
   cp .env.example .env
   ```

3. **Start MongoDB locally** (if using local MongoDB):
   ```bash
   mongod
   ```

4. **Seed admin user:**
   ```bash
   npm run seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js              # Entry point
├── package.json
├── .env                   # Environment variables (local)
├── .env.example           # Environment template
└── src/
    ├── config/
    │   ├── database.js    # MongoDB connection
    │   └── index.js       # Config exports
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── contact.controller.js
    │   └── dashboard.controller.js
    ├── middleware/
    │   ├── auth.middleware.js    # JWT authentication
    │   └── validate.middleware.js
    ├── models/
    │   ├── Admin.model.js
    │   └── Contact.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── contact.routes.js
    │   └── dashboard.routes.js
    └── utils/
        └── seedAdmin.js    # Admin seeder
```

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/auth/me` | Get profile | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout | Yes |

### Contact
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/contact` | Get all contacts | Yes |
| GET | `/api/contact/:id` | Get single contact | Yes |
| PATCH | `/api/contact/:id/status` | Update status | Yes |
| DELETE | `/api/contact/:id` | Delete contact | Yes |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get dashboard stats | Yes |
| GET | `/api/dashboard/analytics` | Get analytics | Yes |

## 🚂 Railway Deployment

### 1. Create Railway Project
- Go to [Railway](https://railway.app)
- Create new project
- Add MongoDB service

### 2. Set Environment Variables
In Railway project settings, add:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<MongoDB connection string from Railway>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@techvimal.com
ADMIN_PASSWORD=YourSecurePassword123
FRONTEND_URL=https://yourdomain.com
```

### 3. Deploy
- Connect GitHub repository
- Railway will auto-deploy on push

### 4. Seed Admin
After deployment, run seed command:
```bash
railway run npm run seed
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/tvi |
| JWT_SECRET | JWT signing secret | random-string |
| JWT_EXPIRES_IN | Token expiry | 7d |
| ADMIN_EMAIL | Initial admin email | admin@techvimal.com |
| ADMIN_PASSWORD | Initial admin password | Admin@123 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## 🔒 Default Admin Credentials

After running `npm run seed`:
- **Email:** admin@techvimal.com
- **Password:** Admin@123

⚠️ **Change password after first login!**

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run seed` | Seed initial admin user |
