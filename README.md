# NexusFlow Microservices Demo

A microservices architecture demonstrating **API Gateway pattern**, **JWT authentication**, **gRPC communication**, and **event-driven architecture** using NestJS.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT                                    │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                    NGINX                                    │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  Rate Limiting  │  │ DDoS Protection │  │  Security Headers           │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTP
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NestJS API GATEWAY                     │
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────────┐ │
│  │ JWT Auth       │  │ Route Logic    │  │  Data Aggregation              │ │
│  │ Login/Register │  │ /auth, /api/*  │  │  Combine data from services    │ │
│  └────────────────┘  └────────────────┘  └────────────────────────────────┘ │
└──────────────┬─────────────────────────────────────────┬────────────────────┘
               │ gRPC (sync)                             │ HTTP (internal)
               ▼                                         ▼
┌──────────────────────────────┐        ┌──────────────────────────────────────┐
│  IDENTITY SERVICE            │        │     PROJECT SERVICE                  │
│                              │        │                                      │
│  • User management           │◄──────►│  • Task CRUD                         │
│  • Login / Register          │  gRPC  │  • Validates user via gRPC           │
│  • Token validation          │        │  • Publishes events to Redis         │
└──────────────────────────────┘        └──────────────────┬───────────────────┘
                                                           │ Redis Pub/Sub
                                                           ▼
                                        ┌──────────────────────────────────────┐
                                        │     NOTIFICATION SERVICE             │
                                        │                                      │
                                        │  • Subscribe to Redis events         │
                ┌────────────────────►  │  • Store notifications               │
                │ Redis Pub/Sub         │  • WebSocket (real-time)             │
                │                       └──────────────────────────────────────┘
      ┌─────────┴─────────┐
      │      REDIS        │
      └───────────────────┘
```

## Quick Start

### 1. Start all services

```bash
docker-compose up --build
```

### 2. Wait for all services to be healthy

```
✓ nginx (port 8080)
✓ nestjs-gateway (port 4000)
✓ identity-service (port 5001)
✓ project-service (port 3000)
✓ notification-service (port 3001)
✓ redis (port 6379)
```

### 3. Test the API

**Register a new user:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "password123", "name": "New User"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@nexusflow.io", "password": "password123"}'
```

**Response:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "john@nexusflow.io",
    "name": "John Doe"
  }
}
```

**Create a task (with JWT):**
```bash
TOKEN="<accessToken from login>"

curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Complete microservices demo", "description": "Build API Gateway"}'
```

**List tasks (with JWT):**
```bash
curl http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

## API Endpoints

### Public Endpoints (No JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | API documentation |
| GET | /health | Nginx health check |
| GET | /health/gateway | NestJS Gateway health |
| POST | /auth/register | Register new user |
| POST | /auth/login | Login and get JWT |

### Protected Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/me | Get current user info |
| GET | /api/tasks | List all tasks |
| POST | /api/tasks | Create a task |
| GET | /api/tasks/:id | Get task by ID |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /notifications | List all notifications |

## Test Users (Pre-seeded)

| Email | Password | Name |
|-------|----------|------|
| john@nexusflow.io | password123 | John Doe |
| jane@nexusflow.io | password123 | Jane Smith |
| bob@nexusflow.io | password123 | Bob Wilson |
| alice@nexusflow.io | password123 | Alice Johnson |
| charlie@nexusflow.io | password123 | Charlie Brown |

## Event Channels (Redis Pub/Sub)

| Channel | Publisher | Subscriber | Trigger |
|---------|-----------|------------|---------|
| task.created | project-service | notification-service | Task created |
| task.updated | project-service | notification-service | Task updated |
| task.deleted | project-service | notification-service | Task deleted |

## File Structure

```
microservices-demo/
├── nginx/
│   └── nginx.conf                 # Security & routing config
├── nestjs-gateway/
│   ├── src/
│   │   ├── main.ts                # HTTP server bootstrap
│   │   ├── app.module.ts          # gRPC client setup
│   │   ├── health.controller.ts   # Health endpoints
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts # /auth endpoints
│   │   │   ├── auth.service.ts    # gRPC calls to identity
│   │   │   ├── auth.dto.ts        # Request validation
│   │   │   └── jwt.strategy.ts    # JWT validation
│   │   ├── tasks/
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.controller.ts # /api/tasks endpoints
│   │   │   ├── tasks.service.ts   # HTTP calls to project
│   │   │   └── tasks.dto.ts       # Request validation
│   │   └── common/
│   │       └── current-user.decorator.ts
│   ├── package.json
│   └── Dockerfile
├── proto/
│   ├── identity.proto             # gRPC service definition
│   └── identity.interface.ts      # TypeScript interfaces
├── identity-service/
│   ├── src/
│   │   ├── main.ts                # gRPC server bootstrap
│   │   ├── identity.service.ts    # User logic + auth
│   │   └── identity.controller.ts # gRPC handlers
│   ├── package.json
│   └── Dockerfile
├── project-service/
│   ├── src/
│   │   ├── main.ts                # REST server bootstrap
│   │   ├── project.service.ts     # Task logic
│   │   ├── project.controller.ts  # REST endpoints
│   │   └── event-bus.service.ts   # Redis publisher
│   ├── package.json
│   └── Dockerfile
├── notification-service/
│   ├── src/
│   │   ├── main.ts                # Service bootstrap
│   │   ├── consumer.service.ts    # Redis subscriber
│   │   ├── notification.service.ts
│   │   └── health.controller.ts
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```