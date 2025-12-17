# Architecture Documentation

## Overview

Task Manager follows a layered architecture pattern with clear separation of concerns.

## Backend Architecture

### Layers

┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Routes, Controllers, DTOs)      │
└─────────────────┬───────────────────┘
│
┌─────────────────▼───────────────────┐
│         Business Logic Layer        │
│           (Services)                │
└─────────────────┬───────────────────┘
│
┌─────────────────▼───────────────────┐
│         Data Access Layer           │
│         (Repositories)              │
└─────────────────┬───────────────────┘
│
┌─────────────────▼───────────────────┐
│            Database                 │
│         (PostgreSQL)                │
└─────────────────────────────────────┘

### Design Patterns

#### 1. Repository Pattern
Abstracts data access logic from business logic.
```typescript
// Repository handles CRUD operations
class TaskRepository {
  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }
}
```

#### 2. Service Pattern
Contains business logic and coordinates between repositories.
```typescript
// Service handles business rules
class TaskService {
  constructor(private taskRepo: TaskRepository) {}
  
  async createTask(data: CreateTaskDto, userId: string) {
    // Business logic here
    return this.taskRepo.create({ ...data, creatorId: userId });
  }
}
```

#### 3. DTO Pattern
Validates and transforms data between layers.
```typescript
// DTO with Zod validation
const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string().datetime(),
  priority: z.nativeEnum(Priority)
});
```

### Authentication Flow

User submits credentials
↓
Controller validates input
↓
Service verifies credentials
↓
Generate JWT token
↓
Set HttpOnly cookie
↓
Return user data


### Real-time Communication
Client                    Server
│                         │
│──── Connect ────────────→│
│                         │
│←─── Register User ──────│
│                         │
│                         │ Task Updated
│←─── Emit Event ─────────│
│                         │
│──── Update UI ──────────→│

## Frontend Architecture

### Component Hierarchy
App
├── AuthProvider
│   └── SocketProvider
│       ├── Layout
│       │   ├── Navbar
│       │   └── Page Content
│       │       ├── Dashboard
│       │       └── TaskList
│       │           └── TaskCard
│       └── Forms
│           ├── LoginForm
│           └── TaskForm

### State Management

- **Global State**: React Context (Auth, Socket)
- **Server State**: SWR (Tasks, Users)
- **Local State**: useState (UI state)

### Data Flow
Component
↓ (trigger)
Custom Hook
↓ (call)
Service Layer
↓ (HTTP/WebSocket)
Backend API
↓ (response)
SWR Cache
↓ (update)
Component Re-render

## Database Design

### Relationships
User ─┬─→ Task (as creator)
└─→ Task (as assignee)
└─→ Notification
└─→ AuditLog
Task ─→ User (creator)
└─→ User (assignee)
└─→ AuditLog

### Indexing Strategy
```sql
-- Indexes for performance
CREATE INDEX idx_task_creator ON Task(creatorId);
CREATE INDEX idx_task_assignee ON Task(assignedToId);
CREATE INDEX idx_task_status ON Task(status);
CREATE INDEX idx_task_duedate ON Task(dueDate);
CREATE INDEX idx_notification_user ON Notification(userId, read);
```

## Security Architecture

### Authentication
- JWT tokens with 7-day expiry
- HttpOnly cookies prevent XSS
- Bcrypt for password hashing (10 rounds)

### Authorization
- Middleware validates JWT on protected routes
- Service layer checks user permissions
- Users can only modify their own tasks

### Data Validation
- Input validation at controller level (Zod)
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping)

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Session data in JWT (no server storage)
- Database connection pooling

### Caching Strategy
- SWR client-side caching
- Optimistic UI updates
- Stale-while-revalidate pattern

### Performance Optimization
- Database query optimization
- Prisma select for minimal data
- React.memo for expensive components
- Code splitting with React.lazy

## Deployment Architecture
┌─────────────┐
│   Vercel    │  Frontend (CDN)
└──────┬──────┘
│
┌──────▼──────┐
│   Render    │  Backend API + WebSocket
└──────┬──────┘
│
┌──────▼──────┐
│  PostgreSQL │  Database
└─────────────┘

