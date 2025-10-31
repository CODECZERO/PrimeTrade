# Task Manager Backend - TypeScript + Prisma

A scalable REST API built with TypeScript, Express, and Prisma ORM following professional coding patterns.

## 🛠 Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controller/            # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│   ├── router/                # Route definitions
│   │   ├── auth.router.ts
│   │   ├── task.router.ts
│   │   └── user.router.ts
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.ts
│   │   └── validator.middleware.ts
│   ├── db/                    # Database configuration
│   │   ├── prisma.db.ts
│   │   └── seed.ts
│   ├── util/                  # Utility functions
│   │   ├── apiError.ts
│   │   ├── apiResponse.ts
│   │   ├── asyncHandler.ts
│   │   └── jwtOp.util.ts
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Entry point
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run build
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server will run on http://localhost:5000

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager_db"
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=10d
CORS_ORIGIN=http://localhost:3000
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `GET /api/v1/tasks/:id` - Get task by ID
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get statistics

### Users (Admin Only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `DELETE /api/v1/users/:id` - Delete user

## 🧪 Test Credentials

After seeding:
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## 📦 Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Development mode
- `npm start` - Production mode
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

## 🔒 Security Features

- JWT authentication with access & refresh tokens
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- CORS protection
- Cookie-based token storage

## 📊 Database Schema

### User Model
- id, username, email, password, role, refreshToken
- Relations: tasks (one-to-many)

### Task Model
- id, title, description, status, priority, dueDate, userId
- Relations: user (many-to-one)

## 🎯 Code Style

This project follows the CODECZERO/Testcore coding pattern:
- TypeScript with ES6 modules
- Prisma ORM for database operations
- Custom ApiError and ApiResponse classes
- AsyncHandler for error handling
- Modular router/controller structure

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t taskmanager-server .

# Run the container
docker run -p 5000:5000 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_ACCESS_SECRET="your_secret" \
  -e JWT_REFRESH_SECRET="your_secret" \
  taskmanager-server
```

### Using Docker Compose

From project root:

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Development with Docker

```bash
# Start only PostgreSQL for local development
docker-compose -f docker-compose.dev.yml up -d

# Then run backend locally
cd server
npm run dev
```

## 🐛 Troubleshooting

**TypeScript errors?**
```bash
npm install
npm run prisma:generate
```

**Database connection issues?**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Run migrations: `npm run prisma:migrate`

**Port already in use?**
- Change PORT in .env file

**Docker build fails?**
- Ensure Docker is running
- Check Dockerfile syntax
- Clear Docker cache: `docker system prune -a`
