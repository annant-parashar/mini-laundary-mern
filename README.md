# Mini Laundry Order Management System

A lightweight MERN-stack application for dry cleaning stores to manage orders, track status, calculate billing, and view business metrics.

**Live Demo:** Deploy frontend and backend separately on Vercel.

---

## Features Implemented

### Core Features
- **Create Order** — Add customer details, select garments dynamically, auto-calculate total billing
- **Order Status Management** — Status transitions: RECEIVED → PROCESSING → READY → DELIVERED (validated)
- **View Orders** — Table view with search by name/phone/order ID, filter by status
- **Dashboard** — Total orders, total revenue, average order value, orders per status with visual breakdown

### Bonus Features
- **JWT Authentication** — Register/Login with hashed passwords (bcryptjs) and token-based auth
- **Estimated Delivery Date** — Auto-calculated 3 days from order creation
- **Search by Garment Type** — Filter orders by garment type via query parameter
- **Deployment Ready** — Vercel configs for both frontend and backend
- **Environment Variables** — `.env` based configuration
- **MongoDB Atlas** — Ready for cloud MongoDB connection

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |
| Styling | Vanilla CSS |

---

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js    # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   └── Navbar.jsx   # Navigation bar
│   │   ├── pages/
│   │   │   ├── CreateOrder.jsx
│   │   │   ├── OrdersList.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx          # Router setup
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # All styles
│   ├── vercel.json          # Vercel SPA config
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── models/
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   └── authRoutes.js
│   ├── index.js            # Express app entry
│   ├── vercel.json         # Vercel serverless config
│   └── package.json
│
├── .env.example            # Environment variables template
├── LaundrySystem.postman_collection.json
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd intershala
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/laundry?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Navigate to `http://localhost:5173` in your browser.

---

## API Endpoints

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders` | Get all orders (with filters) |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `GET` | `/api/dashboard` | Get dashboard metrics |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### Query Parameters (GET /api/orders)

| Parameter | Description |
|-----------|-------------|
| `status` | Filter by status (RECEIVED, PROCESSING, READY, DELIVERED) |
| `customerName` | Filter by customer name (partial match) |
| `phone` | Filter by phone number (partial match) |
| `search` | Search across name, phone, and order ID |
| `garmentType` | Filter by garment type |

### Example Responses

**POST /api/orders**
```json
{
  "orderId": "ORD-A1B2C3D4",
  "customerName": "Rahul Sharma",
  "phone": "9876543210",
  "items": [
    { "type": "Shirt", "quantity": 3, "price": 30 },
    { "type": "Pants", "quantity": 2, "price": 40 }
  ],
  "totalAmount": 170,
  "status": "RECEIVED",
  "estimatedDelivery": "2026-05-01T00:00:00.000Z",
  "createdAt": "2026-04-28T00:00:00.000Z"
}
```

**GET /api/dashboard**
```json
{
  "totalOrders": 10,
  "totalRevenue": 5200,
  "statusBreakdown": {
    "RECEIVED": 2,
    "PROCESSING": 3,
    "READY": 4,
    "DELIVERED": 1
  }
}
```

---

## Deploying to Vercel

### Backend (Server)

1. Push the `server/` folder to a GitHub repo (or as a subfolder)
2. Import into Vercel → Set root directory to `server`
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — Any secure random string
   - `NODE_ENV` — `production`
4. Deploy — Vercel will use `vercel.json` to run Express as a serverless function

### Frontend (Client)

1. Push the `client/` folder to a GitHub repo
2. Import into Vercel → Set root directory to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_URL` — Your deployed backend URL + `/api` (e.g., `https://your-server.vercel.app/api`)
5. Deploy

---

## AI Usage Report

### Prompts Used
- "Build a Mini Laundry Order Management System using MERN stack with order creation, status tracking, billing, and dashboard"
- Detailed specification with schema, API endpoints, folder structure, and feature requirements

### Where AI Helped
- Generated the complete project structure and boilerplate code
- Created Mongoose schemas with proper validations and auto-generated order IDs
- Implemented status transition validation logic
- Built responsive CSS design system from scratch
- Set up Vercel deployment configuration for both frontend and backend
- Created Postman collection for API testing

### What AI Got Wrong
- Initial attempts may have required iterating on MongoDB connection handling for serverless environments
- CORS configuration needed adjustment for cross-origin Vercel deployments

### What Was Improved
- Added estimated delivery date calculation (bonus feature)
- Added JWT authentication with password hashing
- Added search by garment type filter
- Responsive design works across mobile and desktop
- Status transition validation prevents invalid state changes

---

## Tradeoffs

### Skipped Features
- **Real-time updates** — Would require WebSocket/Socket.io, adds complexity
- **Email/SMS notifications** — Requires third-party service integration
- **Invoice PDF generation** — Would need a PDF library
- **Role-based access** — Only basic auth implemented, no admin vs. employee roles
- **Pagination** — Not implemented for order listing (fine for small stores)

### Future Improvements
- Add pagination and sorting for large order lists
- Implement role-based access control (admin, employee, customer)
- Add order receipt PDF download
- SMS notifications when order status changes
- Order history and analytics charts
- Dark/light theme toggle
- Progressive Web App (PWA) support for mobile use

---

## License

MIT
