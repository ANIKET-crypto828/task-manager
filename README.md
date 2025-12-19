# 🚀 Collaborative Task Manager

> A full-stack, real-time task management application built with modern web technologies.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Docker Setup](#-docker-setup)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

A production-ready task management application featuring real-time collaboration, secure authentication, and comprehensive task management capabilities. Built with a focus on code quality, scalability, and developer experience.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with HttpOnly cookies
- ⚡ **Real-time Updates** - Instant task synchronization via Socket.io
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🏗️ **Clean Architecture** - Service/Repository pattern with TypeScript
- 🧪 **Well Tested** - 35+ unit tests with Jest
- 🐳 **Docker Ready** - Complete containerization setup
- 📱 **Mobile Responsive** - Optimized for all screen sizes

## ✨ Features

### Core Functionality

- ✅ **User Authentication**
  - Secure registration and login
  - JWT token-based authentication
  - Password hashing with bcrypt
  - HttpOnly cookie session management

- ✅ **Task Management**
  - Create, read, update, and delete tasks
  - Task assignment to team members
  - Priority levels (Low, Medium, High, Urgent)
  - Status tracking (To Do, In Progress, Review, Completed)
  - Due date management
  - Rich text descriptions

- ✅ **Real-time Collaboration**
  - Instant task updates across all users
  - Live assignment notifications
  - Socket.io integration for real-time sync

- ✅ **Dashboard & Analytics**
  - Personal task overview
  - Created tasks tracking
  - Assigned tasks view
  - Overdue task alerts
  - Completion statistics

- ✅ **Advanced Features**
  - Task filtering by status and priority
  - Sorting by due date
  - Audit logging for task changes
  - Optimistic UI updates
  - Loading skeletons
  - Error handling and validation

## 🛠 Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Library | 18.2.0 |
| TypeScript | Type Safety | 5.2.2 |
| Vite | Build Tool | 5.0.8 |
| Tailwind CSS | Styling | 3.4.0 |
| SWR | Data Fetching | 2.2.4 |
| React Hook Form | Form Management | 7.49.2 |
| Zod | Schema Validation | 3.22.4 |
| Socket.io Client | Real-time | 4.6.1 |
| Lucide React | Icons | 0.303.0 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express | Web Framework | 4.18.2 |
| TypeScript | Type Safety | 5.3.3 |
| Prisma | ORM | 5.8.0 |
| PostgreSQL | Database | 15 |
| Socket.io | Real-time | 4.6.1 |
| JWT | Authentication | 9.0.2 |
| Bcrypt | Password Hashing | 5.1.1 |
| Zod | Validation | 3.22.4 |

### DevOps & Testing
- **Testing**: Jest, ts-jest
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier

## 🏗 Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client Layer                   │
│              (HTTP/WebSocket Requests)          │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Routes & Middleware                 │
│   (Auth, Validation, Rate Limiting, CORS)       │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│               Controllers                        │
│        (Request/Response Handling)              │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│                Services                          │
│         (Business Logic Layer)                  │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Repositories                        │
│          (Data Access Layer)                    │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│          PostgreSQL Database                     │
│           (Prisma ORM)                          │
└─────────────────────────────────────────────────┘
```

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **DTO Pattern** - Data validation and transformation
- **Middleware Pattern** - Cross-cutting concerns
- **Observer Pattern** - Real-time event handling

### Database Schema

```sql
User
├── id (UUID)
├── email (Unique)
├── name
├── password (Hashed)
├── createdAt
└── updatedAt

Task
├── id (UUID)
├── title (Max 100 chars)
├── description (Text)
├── dueDate (DateTime)
├── priority (Enum: LOW, MEDIUM, HIGH, URGENT)
├── status (Enum: TODO, IN_PROGRESS, REVIEW, COMPLETED)
├── creatorId (FK → User)
├── assignedToId (FK → User, Optional)
├── createdAt
└── updatedAt

Notification
├── id (UUID)
├── userId (FK → User)
├── message
├── read (Boolean)
└── createdAt

AuditLog
├── id (UUID)
├── taskId (FK → Task)
├── userId (FK → User)
├── action (String)
├── changes (JSON)
└── createdAt
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v15 or higher)
- **npm** or **yarn**
- **Git**

### Environment Variables

Create `.env` files in both backend and frontend directories:

#### Backend `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

## 📦 Installation

### Option 1: Manual Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with test data
npm run seed

# Start development server
npm run dev
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Option 2: Docker Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd task-manager

# Copy environment file
cp .env.example .env

# Run setup script
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

### Accessing the Application

- **Frontend**: http://localhost:5173 (dev) or http://localhost:3000 (docker)
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/v1/health
- **API Documentation**: http://localhost:5000/api/v1/docs (if configured)

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "jwt-token"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /tasks?status=TODO&priority=HIGH
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the task manager",
    "dueDate": "2025-12-31T23:59:59Z",
    "priority": "HIGH",
    "status": "TODO",
    "creator": { "id": "uuid", "name": "John Doe" },
    "assignedTo": { "id": "uuid", "name": "Jane Smith" }
  }
]
```

#### Create Task
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "dueDate": "2025-12-31T23:59:59Z",
  "priority": "HIGH",
  "status": "TODO",
  "assignedToId": "user-uuid"
}

Response: 201 Created
```

#### Update Task
```http
PUT /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "COMPLETED",
  "priority": "MEDIUM"
}

Response: 200 OK
```

#### Delete Task
```http
DELETE /tasks/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

### Special Task Endpoints

```http
GET /tasks/assigned     # Get tasks assigned to current user
GET /tasks/created      # Get tasks created by current user
GET /tasks/overdue      # Get overdue tasks
```

### User Endpoints

```http
GET /users              # Get all users (for assignment)
GET /users/{id}         # Get user by ID
```

### Notification Endpoints

```http
GET /notifications              # Get all notifications
GET /notifications/unread       # Get unread notifications
PUT /notifications/{id}/read    # Mark as read
PUT /notifications/read-all     # Mark all as read
DELETE /notifications/{id}      # Delete notification
```

### Error Responses

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### Running Tests

```bash
# Navigate to backend
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI/CD Optimization
npm run test:ci
```

### Test Coverage

Current test coverage:

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   85.23 |    78.45 |   88.12 |   86.34 |
 services                 |   92.15 |    85.67 |   94.23 |   93.45 |
  task.service.ts         |   93.45 |    87.23 |   95.67 |   94.12 |
 repositories             |   88.34 |    82.15 |   90.45 |   89.23 |
  task.repository.ts      |   89.67 |    83.45 |   91.23 |   90.12 |
--------------------------|---------|----------|---------|---------|
```

### Test Suites

- **Service Tests** (15 tests) - Business logic validation
- **Authentication Tests** (10 tests) - Auth flow testing
- **Repository Tests** (8 tests) - Data access testing
- **Validation Tests** (10 tests) - Input validation

## 🐳 Docker Setup

### Quick Start with Docker

```bash
# Production setup
./scripts/docker-setup.sh

# Development setup with hot reload
./scripts/docker-dev.sh

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Clean up everything
./scripts/docker-clean.sh
```

### Manual Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View running containers
docker-compose ps

# Access container shell
docker-compose exec backend sh

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Docker Services

- **postgres** - PostgreSQL 15 database
- **backend** - Node.js API server
- **frontend** - React application with Nginx
- **nginx** (prod) - Reverse proxy with SSL

## 🚀 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - VITE_API_URL
# - VITE_SOCKET_URL
```

### Render (Backend + Database)

1. **Database Setup**
   - Create PostgreSQL instance on Render
   - Copy the database URL

2. **Backend Deployment**
   - Connect GitHub repository
   - Set build command: `cd backend && npm install && npx prisma generate && npm run build`
   - Set start command: `cd backend && npx prisma migrate deploy && npm start`
   - Add environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `CORS_ORIGIN`
     - `NODE_ENV=production`

### Railway (Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Environment Variables for Production

```env
# Backend
DATABASE_URL="postgresql://..."
JWT_SECRET="production-secret-key"
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.com"

# Frontend
VITE_API_URL="https://your-backend-domain.com/api/v1"
VITE_SOCKET_URL="https://your-backend-domain.com"
```

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── services/            # Business logic
│   │   │   └── task.service.ts
│   │   ├── repositories/        # Data access
│   │   │   ├── task.repository.ts
│   │   │   └── user.repository.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── validators/          # Zod schemas
│   │   │   └── task.validator.ts
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── index.ts
│   │   ├── socket/              # Socket.io config
│   │   │   └── index.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── logger.ts
│   │   │   └── database.ts
│   │   └── server.ts            # Entry point
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── __tests__/               # Test files
│   │   ├── services/
│   │   ├── repositories/
│   │   └── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Auth components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── tasks/           # Task components
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   └── TaskSkeleton.tsx
│   │   │   ├── layout/          # Layout components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── common/          # Shared components
│   │   ├── pages/               # Page components
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useTasks.ts
│   │   │   └── useSocket.ts
│   │   ├── services/            # API services
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── date.ts
│   │   │   ├── priority.ts
│   │   │   └── status.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── scripts/
│   ├── docker-setup.sh          # Production setup
│   ├── docker-dev.sh            # Development setup
│   ├── docker-clean.sh          # Cleanup script
│   └── init-db.sql              # Database initialization
│
├── docker-compose.yml           # Production compose
├── docker-compose.dev.yml       # Development compose
├── .env.example                 # Environment template
├── .gitignore
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Write unit tests for new features
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow the existing code structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Socket.io for real-time capabilities
- All contributors and maintainers

## 📞 Support

For support, email support@taskmanager.com or open an issue in the repository.

## 🗺 Roadmap

- [ ] Email notifications
- [ ] Task comments and attachments
- [ ] Team collaboration features
- [ ] Calendar view
- [ ] Mobile applications (React Native)
- [ ] Integration with third-party tools (Slack, Jira)
- [ ] Advanced analytics and reporting
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Dark mode

---

**Built with ❤️ using React, Node.js, and PostgreSQL**