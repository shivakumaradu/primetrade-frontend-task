# TaskFlow 🚀

A frontend-focused task management dashboard built with React, backed by a secure Node.js API.
Features JWT authentication, full CRUD task management, search/filter capabilities, and a responsive dark-themed dashboard.

---

## ✨ Frontend Features

### 🔐 Authentication
- User Registration with strong password enforcement
- Secure Login with JWT token generation
- Protected routes — dashboard only accessible when authenticated
- Auto token validation on app load (persisted sessions)
- Rate-limited auth endpoints (20 req/15 min)

### 📊 Dashboard
- Greeting with personalized welcome
- **Stats overview** — total tasks, by status, by priority
- **Full CRUD** — Create, Read, Update, Delete tasks
- **Search** — real-time debounced full-text search
- **Filter** — by status (todo / in-progress / completed) and priority (low / medium / high)
- **Sort** — by date created, updated, title, priority, due date
- Due date tracking with overdue indicators
- Tag support per task

### 👤 User Profile
- View and update name + email
- Change password securely
- View account metadata

### 🛡️ Security
- JWT authentication with expiry
- bcrypt password hashing (12 rounds)
- Helmet HTTP headers
- CORS configured per environment
- Rate limiting per route group
- Input validation on both client & server
- Centralized error handling

---

## 🗂 Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection with pool config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # register, login, getMe
│   │   │   ├── user.controller.js   # getProfile, updateProfile
│   │   │   └── task.controller.js   # full CRUD + stats + search/filter
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT protect + role authorize
│   │   │   ├── error.middleware.js  # centralized error handler
│   │   │   └── validation.middleware.js  # express-validator chains
│   │   ├── models/
│   │   │   ├── user.model.js        # User schema + bcrypt hooks
│   │   │   └── task.model.js        # Task schema + indexes
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── task.routes.js
│   │   └── server.js                # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── RegisterPage.jsx
    │   │   ├── dashboard/
    │   │   │   ├── DashboardLayout.jsx   # responsive sidebar layout
    │   │   │   ├── Sidebar.jsx           # navigation + user footer
    │   │   │   ├── TasksPage.jsx         # main tasks view
    │   │   │   ├── TaskCard.jsx          # individual task card
    │   │   │   ├── TaskFormModal.jsx     # create/edit modal
    │   │   │   ├── FilterBar.jsx         # search + filter + sort
    │   │   │   ├── StatsCards.jsx        # task statistics
    │   │   │   └── ProfilePage.jsx       # user profile management
    │   │   └── ui/
    │   │       └── index.jsx             # reusable design system components
    │   ├── context/
    │   │   └── AuthContext.jsx           # global auth state (useReducer)
    │   ├── routes/
    │   │   └── Guards.jsx               # ProtectedRoute + PublicRoute
    │   ├── services/
    │   │   └── api.js                   # Axios instance + interceptors + API methods
    │   ├── utils/
    │   │   └── helpers.js               # formatDate, debounce, etc.
    │   ├── App.jsx                      # Router config
    │   ├── main.jsx                     # React entry point
    │   └── index.css                    # Tailwind + custom design tokens
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ and npm v9+
- **MongoDB** running locally (`mongod`) or a MongoDB Atlas URI

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd taskflow
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=replace_this_with_a_long_random_secret_min_32_chars
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
```

> ⚠️ **Security**: Generate a strong JWT_SECRET with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

Health check: `GET http://localhost:5000/health`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

The default `.env` uses Vite's proxy (empty `VITE_API_URL`), which proxies `/api` to `http://localhost:5000`. No changes needed for local development.

Start the frontend:

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 📡 API Documentation

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

### Auth

#### `POST /api/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Secure123"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "_id": "...", "name": "Jane Smith", "email": "jane@example.com" }
  }
}
```

---

#### `POST /api/auth/login`
Authenticate and receive a JWT.

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "Secure123"
}
```

**Response 200:** Same shape as register.

---

#### `GET /api/auth/me` 🔒
Validate current token and return user.

---

### User

#### `GET /api/user/profile` 🔒
Get authenticated user's profile.

#### `PUT /api/user/profile` 🔒
Update name, email, or password.

**Body (all fields optional):**
```json
{
  "name": "Jane Updated",
  "email": "new@example.com",
  "password": "NewPass123"
}
```

---

### Tasks

#### `POST /api/tasks` 🔒
Create a new task.

**Body:**
```json
{
  "title": "Implement auth module",
  "description": "JWT-based authentication",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-03-01",
  "tags": ["backend", "auth"]
}
```

---

#### `GET /api/tasks` 🔒
Get tasks with optional search, filter, and sort.

**Query Parameters:**

| Param | Values | Default |
|-------|--------|---------|
| `search` | string | — |
| `status` | `todo`, `in-progress`, `completed` | all |
| `priority` | `low`, `medium`, `high` | all |
| `sortBy` | `createdAt`, `updatedAt`, `title`, `priority`, `dueDate` | `createdAt` |
| `sortOrder` | `asc`, `desc` | `desc` |
| `page` | number | 1 |
| `limit` | number (max 100) | 20 |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tasks": [...],
    "pagination": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
  }
}
```

---

#### `GET /api/tasks/stats` 🔒
Get aggregated task statistics for the dashboard.

---

#### `GET /api/tasks/:id` 🔒
Get a single task by ID.

#### `PUT /api/tasks/:id` 🔒
Update a task (partial updates supported).

#### `DELETE /api/tasks/:id` 🔒
Delete a task.

---

### Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

---

## 🏗 Scalability Architecture

### Current Design Decisions

1. **Modular structure** — Each concern (routes, controllers, models, middleware) is isolated. Adding a new resource means creating files in existing folders, not touching existing code.

2. **Mongoose indexes** — Compound indexes on `(user, status)`, `(user, priority)`, `(user, createdAt)` ensure O(log n) query performance regardless of dataset size.

3. **Connection pooling** — MongoDB connection pool (`maxPoolSize: 10`) handles concurrent requests efficiently.

4. **Stateless JWT auth** — No server-side sessions. Horizontal scaling (multiple Node.js instances) works out of the box — any instance can validate any token.

5. **Pagination** — All list endpoints support page/limit. The frontend fetches up to 50 tasks and can extend to cursor-based pagination with zero API contract changes.

6. **Rate limiting** — Express rate limiter protects against brute force and abuse.

---

### Path to Microservices

The folder structure maps 1:1 to potential microservices:

```
taskflow/
├── auth-service/     ← /api/auth routes + User model
├── user-service/     ← /api/user routes
└── task-service/     ← /api/tasks routes + Task model
```

**Migration steps:**
1. Extract each service into its own Express app
2. Add an API Gateway (Kong, AWS API Gateway, or nginx) to route requests
3. Replace direct DB calls between services with gRPC or REST/event messaging
4. Add a message broker (RabbitMQ, Kafka) for async task events
5. Deploy each service independently via Docker/Kubernetes

**Frontend stays unchanged** — it only talks to `/api/...`. The gateway handles routing transparently.

---

## 🧪 Testing

```bash
# Backend - run tests
cd backend && npm test

# Frontend - run linter
cd frontend && npm run lint
```

---

## 🚢 Production Deployment

### Backend (e.g., Railway, Render, EC2)

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow
JWT_SECRET=<64-char-random-string>
ALLOWED_ORIGINS=https://yourdomain.com
```

### Frontend (e.g., Vercel, Netlify)

```bash
VITE_API_URL=https://your-api-domain.com/api
```

Update `vite.config.js` proxy is not needed in production — `VITE_API_URL` points directly to the deployed API.

---

## 📄 License

MIT — Built as a Frontend Developer Intern assessment project.
