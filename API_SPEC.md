# API Specification

## Base Information

- **Base URL**: `/api/v1`
- **Authentication**: JWT Bearer token in HttpOnly cookie
- **Content-Type**: `application/json`
- **Rate Limiting**: 100 requests per 15 minutes

## Authentication

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "string (email format)",
  "name": "string (2-100 chars)",
  "password": "string (min 6 chars)"
}
```

**Response: 201 Created**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "createdAt": "ISO 8601 datetime"
  },
  "token": "jwt-token"
}
```

**Errors:**
- `400` - Validation error
- `409` - Email already exists

### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response: 200 OK**
```json
{
  "user": { /* user object */ },
  "token": "jwt-token"
}
```

**Errors:**
- `401` - Invalid credentials

## Tasks

### GET /tasks
Get all tasks with optional filters.

**Query Parameters:**
- `status` (optional): `TODO | IN_PROGRESS | REVIEW | COMPLETED`
- `priority` (optional): `LOW | MEDIUM | HIGH | URGENT`

**Response: 200 OK**
```json
[
  {
    "id": "uuid",
    "title": "string (max 100)",
    "description": "string",
    "dueDate": "ISO 8601 datetime",
    "priority": "enum",
    "status": "enum",
    "creatorId": "uuid",
    "assignedToId": "uuid | null",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "creator": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    },
    "assignedTo": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    } | null
  }
]
```

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "string (1-100 chars)",
  "description": "string (required)",
  "dueDate": "ISO 8601 datetime",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "status": "TODO | IN_PROGRESS | REVIEW | COMPLETED (optional)",
  "assignedToId": "uuid (optional)"
}
```

**Response: 201 Created**
```json
{
  /* task object */
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `404` - Assigned user not found

### PUT /tasks/:id
Update an existing task.

**Request Body:** (all fields optional)
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "datetime",
  "priority": "enum",
  "status": "enum",
  "assignedToId": "uuid | null"
}
```

**Response: 200 OK**
```json
{
  /* updated task object */
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (not creator or assignee)
- `404` - Task not found

### DELETE /tasks/:id
Delete a task (creator only).

**Response: 200 OK**
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (only creator can delete)
- `404` - Task not found

## WebSocket Events

### Client → Server

#### `register`
Register user socket connection.

**Payload:**
```json
{
  "userId": "uuid"
}
```

### Server → Client

#### `task:updated`
Broadcast when any task is updated.

**Payload:**
```json
{
  /* full task object */
}
```

#### `task:assigned`
Sent to specific user when assigned to task.

**Payload:**
```json
{
  "id": "uuid",
  "message": "You have been assigned to task: {title}",
  "taskId": "uuid",
  "createdAt": "datetime"
}
```

#### `task:deleted`
Broadcast when task is deleted.

**Payload:**
```json
{
  "id": "uuid"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "error": "Human-readable error message"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time until reset (Unix timestamp)

## Versioning

API version is included in the URL (`/api/v1`). Breaking changes will result in a new version (`/api/v2`).