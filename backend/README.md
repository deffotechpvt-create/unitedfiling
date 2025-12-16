# United Filings - Backend API

## 📋 Overview

This is the backend API server for United Filings, a comprehensive business services platform. Built with Node.js, Express, and MongoDB, it provides RESTful APIs for authentication, user management, orders, payments, and admin dashboard.

## 🚀 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Razorpay
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── razorpay.js           # Razorpay configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── cartController.js     # Cart management
│   ├── dashboardController.js # Admin dashboard
│   ├── orderController.js    # Order processing
│   ├── paymentController.js  # Payment handling
│   ├── userController.js     # User management
│   └── wishlistController.js # Wishlist features
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Request validation
├── models/
│   ├── Cart.js              # Cart schema
│   ├── Order.js             # Order schema
│   ├── Payment.js           # Payment schema
│   ├── User.js              # User schema
│   └── Wishlist.js          # Wishlist schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── cartRoutes.js        # Cart endpoints
│   ├── dashboardRoutes.js   # Dashboard endpoints
│   ├── orderRoutes.js       # Order endpoints
│   ├── paymentRoutes.js     # Payment endpoints
│   ├── userRoutes.js        # User endpoints
│   └── wishlistRoutes.js    # Wishlist endpoints
├── utils/
│   └── generateToken.js     # JWT token generation
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment variables template
├── server.js                # Entry point
└── package.json             # Dependencies
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/united-filling

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Start the Server

**Development mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)

### User Routes (`/api/users`)
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change password (protected)

### Cart Routes (`/api/cart`)
- `GET /` - Get user cart (protected)
- `POST /` - Add item to cart (protected)
- `PUT /:itemId` - Update cart item (protected)
- `DELETE /:itemId` - Remove cart item (protected)
- `DELETE /clear` - Clear cart (protected)

### Order Routes (`/api/orders`)
- `GET /` - Get user orders (protected)
- `GET /:id` - Get single order (protected)
- `POST /` - Create order (protected)
- `PUT /:id/status` - Update order status (admin)

### Wishlist Routes (`/api/wishlist`)
- `GET /` - Get user wishlist (protected)
- `POST /` - Add item to wishlist (protected)
- `DELETE /:itemId` - Remove wishlist item (protected)

### Payment Routes (`/api/payment`)
- `POST /create-order` - Create Razorpay order (protected)
- `POST /verify` - Verify payment (protected)

### Dashboard Routes (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics (admin)
- `GET /users` - Get all users (admin)
- `GET /orders` - Get all orders (admin)
- `DELETE /users/:id` - Delete user (admin)
- `PUT /orders/:id/status` - Update order status (admin)

## 🔒 Security Features

- **Helmet**: Sets secure HTTP headers
- **CORS**: Configured for frontend origin
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Auth routes: 5 login attempts per 15 minutes
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Request validation middleware

## 🗄️ Database Schema

### User
- name, email, password (hashed)
- role (customer/admin)
- phone, business_name, gstin
- address, city, state, pincode
- timestamps

### Order
- orderNumber (unique)
- userId, customerInfo
- items[], pricing
- paymentMethod, paymentStatus
- orderStatus, estimateDate
- statusHistory[]

### Cart
- userId (unique)
- items[]
- totalAmount

### Wishlist
- userId (unique)
- items[]

### Payment
- orderId, userId
- razorpayOrderId, razorpayPaymentId
- amount, status
- method, currency

## 🛠️ Development

### Scripts

```bash
npm start        # Start server
npm run dev      # Start with nodemon (auto-reload)
npm test         # Run tests
```

## 📝 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error Response Format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 5000 |
| NODE_ENV | Environment | No | development |
| FRONTEND_URL | Frontend URL for CORS | Yes | http://localhost:8080 |
| MONGO_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | Secret for JWT signing | Yes | - |
| JWT_EXPIRE | Token expiration time | No | 7d |
| RAZORPAY_KEY_ID | Razorpay API key | Yes | - |
| RAZORPAY_KEY_SECRET | Razorpay secret key | Yes | - |

## 🚨 Important Notes

1. **NEVER commit `.env` file** - It contains sensitive credentials
2. **Always restart server** after changing `.env` variables
3. **Use strong JWT_SECRET** in production (min 32 characters)
4. **Set NODE_ENV=production** for production deployment
5. **Enable MongoDB authentication** in production
6. **Use environment-specific Razorpay keys**

## 📞 Support

For issues or questions, contact the development team.

---

Built with ❤️ for United Filings
