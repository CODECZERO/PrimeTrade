# 🚀 Task Manager - Full Stack Application

A modern, scalable task management application with JWT authentication, role-based access control, and a beautiful React frontend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-15-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Scalability](#scalability)
- [Contributing](#contributing)

## ✨ Features

### Backend Features
- ✅ **TypeScript** - Type-safe code with full TypeScript support
- ✅ **Prisma ORM** - Modern database toolkit with type safety
- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **Role-Based Access Control (RBAC)** - User and Admin roles
- ✅ **RESTful API Design** - Following REST principles
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Password Hashing** - Bcrypt for secure password storage
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Error Handling** - Custom ApiError and ApiResponse classes
- ✅ **Async Handler** - Centralized async error handling
- ✅ **API Versioning** - `/api/v1` endpoint structure
- ✅ **Database Migrations** - Prisma migrations for schema management
- ✅ **CORS Configuration** - Secure cross-origin requests

### Frontend Features
- ✅ **Modern React UI** - Built with React 18 and Vite
- ✅ **TailwindCSS Styling** - Beautiful, responsive design
- ✅ **Protected Routes** - Route guards for authentication
- ✅ **Task Management** - Full CRUD operations
- ✅ **Real-time Filtering** - Filter tasks by status and priority
- ✅ **Task Statistics** - Dashboard with visual stats
- ✅ **User Management** - Admin panel for user management
- ✅ **Toast Notifications** - User-friendly feedback
- ✅ **Responsive Design** - Mobile-first approach

### Task Features
- Create, Read, Update, Delete tasks
- Task status: Pending, In Progress, Completed, Cancelled
- Priority levels: Low, Medium, High, Urgent
- Due date tracking
- Task statistics and analytics
- User-specific task filtering (users see only their tasks)
- Admin can view all tasks

## 🛠 Tech Stack

### Backend
- **Language**: TypeScript 5.6+
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma 5.22+
- **Database**: PostgreSQL 15
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Express-validator
- **Security**: CORS, bcrypt
- **Rate Limiting**: express-rate-limit

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL with connection pooling
- **Reverse Proxy**: Nginx (for frontend)

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                      │
│                    (React + Vite)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │
┌────────────────────▼────────────────────────────────────┐
│                   API Gateway/Nginx                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Express.js Backend API                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes → Middleware → Controllers → Services    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                        │
│         (Users, Tasks, Indexes, Triggers)              │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Project
```

2. **Backend Setup**
```bash
cd server
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

3. **Database Setup**

Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE taskmanager_db;
\q
```

Run Prisma migrations and seed data:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Build TypeScript
npm run build

# Seed database
npm run prisma:seed
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

#### Using Docker Compose

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Default Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

## 📚 API Documentation

### Interactive Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs

### Postman Collection

Import `backend/Postman_Collection.json` into Postman for ready-to-use API requests.

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile

#### Tasks
- `GET /api/v1/tasks` - Get all tasks (with filters)
- `GET /api/v1/tasks/:id` - Get task by ID
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get task statistics

#### Users (Admin Only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `DELETE /api/v1/users/:id` - Delete user

### Example API Request

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'

# Create Task (use token from login response)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task manager project",
    "priority": "high",
    "status": "pending"
  }'
```

## 🚢 Deployment

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=taskmanager_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

### Docker Deployment

```bash
# Build images
docker-compose build

# Run in production
docker-compose up -d

# Scale backend instances
docker-compose up -d --scale backend=3
```

### Manual Deployment

#### Backend (Node.js)
```bash
cd backend
npm ci --only=production
npm run migrate
npm start
```

#### Frontend (Static Build)
```bash
cd frontend
npm ci
npm run build
# Serve the 'dist' folder with Nginx or any static server
```

## 🔒 Security

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT tokens with expiration
   - Password hashing with bcrypt (10 rounds)
   - Role-based access control

2. **Input Validation**
   - Express-validator for all inputs
   - SQL injection prevention (parameterized queries)
   - XSS protection

3. **Rate Limiting**
   - General API: 100 requests per 15 minutes
   - Auth endpoints: 5 requests per 15 minutes

4. **Security Headers**
   - Helmet.js for security headers
   - CORS configuration
   - Content Security Policy

5. **Database Security**
   - Connection pooling
   - Prepared statements
   - Indexed queries

### Security Best Practices

- Change default JWT_SECRET in production
- Use HTTPS in production
- Regularly update dependencies
- Implement proper logging and monitoring
- Use environment variables for sensitive data
- Enable database SSL connections

## 📈 Scalability

See [SCALABILITY.md](./SCALABILITY.md) for detailed scalability strategies including:

- Horizontal scaling with load balancers
- Redis caching implementation
- Database optimization techniques
- Microservices architecture
- Message queue integration
- Monitoring and observability
- Performance benchmarks

### Quick Scalability Tips

1. **Caching**: Add Redis for frequently accessed data
2. **Database**: Implement read replicas for read-heavy operations
3. **Load Balancing**: Use Nginx or cloud load balancers
4. **CDN**: Serve static assets via CDN
5. **Monitoring**: Implement Prometheus + Grafana

## 📁 Project Structure

```
Project/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── database/        # Database migrations & seeds
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   └── server.js        # Entry point
│   ├── logs/                # Application logs
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Docker configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── Dockerfile           # Docker configuration
│   └── package.json
├── docker-compose.yml       # Docker Compose config
├── SCALABILITY.md          # Scalability documentation
└── README.md               # This file
```

## 🧪 Testing

### Manual Testing

1. Start the application
2. Open http://localhost:3000
3. Register a new user or login with demo credentials
4. Create, update, and delete tasks
5. Test filters and search functionality
6. Login as admin to access user management

### API Testing

Use the provided Postman collection or Swagger UI for comprehensive API testing.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as part of Backend Developer Intern assignment.

## 🙏 Acknowledgments

- Express.js community
- React community
- PostgreSQL documentation
- All open-source contributors

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, React, and PostgreSQL**
# PrimeTrade
# PrimeTrade
