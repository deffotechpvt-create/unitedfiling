# 🚀 United Filings - Complete Setup Guide

This guide will walk you through setting up the entire United Filings application stack (Frontend + Backend).

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js (v18 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB Atlas account (or local MongoDB) - [Sign up](https://www.mongodb.com/cloud/atlas)
- ✅ Supabase account - [Sign up](https://supabase.com/)
- ✅ Razorpay account - [Sign up](https://razorpay.com/)
- ✅ npm or pnpm package manager
- ✅ Git (optional but recommended)

## 🏗️ Project Structure

```
united_filling/
├── backend/              # Node.js + Express API
│   ├── .env             # Backend environment variables (create this)
│   ├── .env.example     # Template for backend .env
│   ├── server.js        # Entry point
│   └── README.md        # Backend documentation
├── src/                 # React frontend application
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── ...
├── .env                 # Frontend environment variables (create this)
├── .env.example         # Template for frontend .env
├── README.md            # Frontend documentation
└── SETUP.md             # This file
```

---

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository (if not done)

```bash
git clone <repository-url>
cd united_filling
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Install Backend Dependencies

```bash
npm install
```

#### 2.3 Create Backend Environment File

```bash
# Copy the example file
cp .env.example .env
```

#### 2.4 Configure Backend Environment Variables

Edit `backend/.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS) - IMPORTANT!
FRONTEND_URL=http://localhost:8080

# MongoDB Configuration
# Replace with your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/united-filling?retryWrites=true&w=majority

# JWT Configuration
# Generate a strong secret (min 32 characters)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_this
JWT_EXPIRE=7d

# Razorpay Configuration
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

**Getting Your Credentials:**

**MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<database>` with your values

**Razorpay:**
1. Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret

#### 2.5 Start Backend Server

```bash
npm start
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: <your-cluster-url>
```

✅ **Backend is now running on http://localhost:5000**

---

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

Open a **NEW terminal** and navigate to the root directory:

```bash
cd d:\devil_code\deffo tech\united_filling
```

#### 3.2 Install Frontend Dependencies

```bash
npm install
# or if using pnpm
pnpm install
```

#### 3.3 Create Frontend Environment File

```bash
# Copy the example file
cp .env.example .env
```

#### 3.4 Configure Frontend Environment Variables

Edit `.env` with your actual values:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=United Filings
VITE_APP_URL=http://localhost:8080
```

**Getting Supabase Credentials:**

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (free tier available)
3. Go to Project Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public key → `VITE_SUPABASE_ANON_KEY`

#### 3.5 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.4.20  ready in XXX ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
```

✅ **Frontend is now running on http://localhost:8080**

---

## 🎯 Verify Setup

### 1. Check Backend API

Open your browser or Postman:

```
GET http://localhost:5000/
```

Should return:
```json
{
  "message": "API is running"
}
```

### 2. Check Frontend

Open your browser:

```
http://localhost:8080
```

You should see the United Filings homepage.

### 3. Test Authentication

1. Click "Sign Up" or "Login"
2. Create a test account
3. Verify you can log in

### 4. Test API Connection

1. Try adding a service to cart
2. Check if toast notifications appear
3. Verify no CORS errors in console

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
```
✓ Check your MONGO_URI is correct
✓ Ensure IP is whitelisted in MongoDB Atlas
✓ Verify username/password are correct
```

**"Port 5000 already in use"**
```bash
# Change PORT in backend/.env to 5001 or another port
PORT=5001

# Update VITE_API_URL in frontend .env
VITE_API_URL=http://localhost:5001/api
```

**"Module not found"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**"CORS Error" in console**
```
✓ Ensure backend is running
✓ Check FRONTEND_URL in backend/.env matches your frontend URL
✓ Restart both servers after changing .env files
```

**"Supabase connection failed"**
```
✓ Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
✓ Check if Supabase project is active
✓ Ensure URL format includes https://
```

**"Failed to fetch from API"**
```
✓ Ensure backend is running on correct port
✓ Check VITE_API_URL in .env
✓ Verify no firewall blocking localhost
```

**Toast notifications not showing**
```
✓ Clear browser cache
✓ Check browser console for errors
✓ Ensure toast component is imported in App.tsx
```

---

## 📝 Important Notes

### ⚠️ NEVER Commit .env Files

Both `.env` files contain sensitive credentials. They are already in `.gitignore`.

```bash
# Verify .env is ignored
git status
# .env should NOT appear in the list
```

### 🔄 After Changing .env

Always restart the server after modifying `.env`:

**Backend:**
```bash
# Press Ctrl+C to stop
npm start
```

**Frontend:**
```bash
# Press Ctrl+C to stop
npm run dev
```

### 🔐 Production Deployment

Before deploying to production:

1. Change `NODE_ENV=production` in backend
2. Use production MongoDB cluster
3. Use production Razorpay keys
4. Use strong `JWT_SECRET` (32+ random characters)
5. Update `FRONTEND_URL` to your production domain
6. Update `VITE_API_URL` to your production API URL
7. Enable MongoDB authentication
8. Set up HTTPS/SSL certificates

---

## 📚 Next Steps

1. **Read Documentation:**
   - [Backend README](./backend/README.md)
   - [Frontend README](./README.md)

2. **Explore Features:**
   - Browse services
   - Add to cart
   - Create orders
   - Test payment flow (use Razorpay test cards)

3. **Admin Access:**
   - Update user role to 'admin' in MongoDB
   - Access admin panel at `/admin`

4. **Customize:**
   - Update branding colors in `tailwind.config.ts`
   - Modify service offerings
   - Customize email templates

---

## 🆘 Need Help?

- Check the documentation in README files
- Review error messages carefully
- Search for similar issues online
- Contact the development team

---

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] MongoDB Atlas account created
- [ ] Supabase account created
- [ ] Razorpay account created
- [ ] Backend dependencies installed
- [ ] Backend `.env` configured
- [ ] Backend server running
- [ ] Frontend dependencies installed
- [ ] Frontend `.env` configured
- [ ] Frontend server running
- [ ] Can access homepage at localhost:8080
- [ ] Can log in/sign up successfully
- [ ] No CORS errors in console

---

**Congratulations! 🎉 Your United Filings application is now up and running!**

Built with ❤️ for United Filings
