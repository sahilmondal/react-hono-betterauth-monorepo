# 🚀 Hono.js Production API - Quick Start Guide

Welcome! Your **industry-standard, scalable Hono.js API** is ready to go!

## 📋 What Was Created

A **fully-featured backend architecture** with:

- ✅ **Domain-driven routing** (auth, users)
- ✅ **Service layer** with business logic
- ✅ **Database layer** with Drizzle ORM + PostgreSQL
- ✅ **Middleware stack** (auth, validation, error handling, logging, rate limiting)
- ✅ **Type-safe** throughout with TypeScript
- ✅ **Multi-schema database** support for easy scaling
- ✅ **JWT authentication** with session tracking
- ✅ **Structured logging** with Pino
- ✅ **Input validation** with Zod

---

## 🎯 Next Steps (5 minutes to running)

### 1. **Set Up PostgreSQL Database**

Make sure PostgreSQL is running locally or accessible remotely.

```bash
# Create database
createdb hono_api
```

Or use Docker:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
docker exec postgres createdb -U postgres hono_api
```

### 2. **Configure Environment Variables**

```bash
# Copy example file
cp .env.example .env

# Edit .env with your PostgreSQL connection
nano .env
```

Required changes:

- `DATABASE_URL` → Your PostgreSQL connection string
- `JWT_SECRET` → Min 32 characters (openssl rand -base64 32)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/hono_api
JWT_SECRET=generated-32-char-secret-key
```

### 3. **Initialize Database**

```bash
# Generate migrations from schema
bun run db:generate

# Apply migrations
bun run db:migrate
```

### 4. **Start Development Server**

```bash
bun run dev
```

Server runs on `http://localhost:3007` with hot-reload!

---

## ✅ Verify Setup Works

### Test Health Endpoint

```bash
curl http://localhost:3007/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Test User Registration

```bash
curl -X POST http://localhost:3007/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'
```

Expected Response (201):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "test@example.com",
      "name": "Test User"
    }
  },
  "message": "User registered successfully"
}
```

### Test Protected Endpoint

```bash
curl http://localhost:3007/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure Overview

```
src/
├── routes/              # API endpoints (domain-organized)
│   ├── auth.ts         # Register, login, logout
│   └── users.ts        # User profile management
├── services/            # Business logic
│   ├── auth.ts         # Password hashing, JWT generation
│   └── users.ts        # User queries and updates
├── middleware/          # Request processing
│   ├── auth.ts         # JWT verification
│   ├── error-handler.ts # Error formatting
│   ├── logger.ts       # Request logging
│   ├── rate-limit.ts   # Rate limiting
│   └── validator.ts    # Input validation
├── database/            # Data layer
│   ├── db.ts           # Drizzle singleton
│   └── schema/         # Table definitions
│       ├── users.ts
│       └── sessions.ts
├── config/              # Configuration
│   ├── env.ts          # Environment variables
│   └── logger.ts       # Logger setup
├── utils/               # Utilities
│   ├── response.ts     # Response formatting
│   ├── errors.ts       # Error classes
│   └── constants.ts    # App constants
└── index.ts            # App initialization
```

---

## 🔌 API Endpoints Reference

### Auth Routes

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Create new account      |
| POST   | `/auth/login`    | Authenticate user       |
| POST   | `/auth/logout`   | Logout (requires token) |

### User Routes

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/users/me`  | Current user (requires auth)   |
| GET    | `/users/:id` | Get any user                   |
| PUT    | `/users/:id` | Update profile (requires auth) |
| DELETE | `/users/:id` | Delete account (requires auth) |

---

## 📚 Available Commands

```bash
# Development
bun run dev              # Start with hot-reload

# Database
bun run db:generate     # Generate migrations
bun run db:migrate      # Apply migrations
bun run db:studio       # Open Drizzle Studio (visual DB browser)

# Build & Deploy
bun run build            # Build for production
bun run type-check       # TypeScript validation
```

---

## 🔐 Security Features

- **JWT Authentication** - Stateless token-based auth
- **Password Hashing** - bcryptjs with salt
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Zod schema validation
- **Error Handling** - Standardized error responses
- **CORS** - Configurable cross-origin access
- **Request Logging** - Structured logs with correlation IDs

---

## 📦 Scaling to New Features

### Adding a New Domain (e.g., Products)

**1. Create schema** (`src/database/schema/products.ts`):

```typescript
import { pgTable, text, uuid, decimal } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

**2. Export from schema index** (`src/database/schema/index.ts`):

```typescript
export * from "./products";
```

**3. Create service** (`src/services/products.ts`):

```typescript
import { db } from "@/database/db";
import { products } from "@/database/schema";

export async function getAllProducts() {
  return await db.select().from(products);
}
```

**4. Create routes** (`src/routes/products.ts`):

```typescript
import { Hono } from "hono";
import * as productsService from "@/services/products";
import { sendSuccess } from "@/utils/response";

const productsRoute = new Hono();

productsRoute.get("/", async (c) => {
  const items = await productsService.getAllProducts();
  return sendSuccess(c, items);
});

export default productsRoute;
```

**5. Register route** (`src/index.ts`):

```typescript
import products from "@/routes/products";
// ...
app.route("/products", products);
```

**6. Generate migration**:

```bash
bun run db:generate
bun run db:migrate
```

That's it! Your new domain is ready.

---

## 🛠 Troubleshooting

### Port Already in Use

```bash
# Change port in .env
PORT=3008
```

### Database Connection Error

```bash
# Check connection string in .env
# Verify PostgreSQL is running
psql postgresql://postgres:password@localhost:5432/hono_api
```

### Missing Migrations

```bash
# Generate migrations again
bun run db:generate
bun run db:migrate
```

### Type Errors in IDE

```bash
# Restart TypeScript server (VS Code)
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## 📖 Documentation Links

- **[Hono.js Docs](https://hono.dev)** - Framework documentation
- **[Drizzle ORM](https://orm.drizzle.team)** - Database ORM
- **[PostgreSQL Docs](https://www.postgresql.org/docs)** - Database documentation
- **[Zod](https://zod.dev)** - Validation library
- **[Pino Logger](https://getpino.io)** - Logging library

---

## 🚀 Production Deployment Checklist

- [ ] Update `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use production PostgreSQL instance
- [ ] Enable HTTPS
- [ ] Set up monitoring/alerting
- [ ] Configure rate limits for production
- [ ] Set up CI/CD pipeline
- [ ] Run database migrations before deploy

---

## 💡 Tips

- **Add path aliases** to reduce import clutter - already configured!
- **Use environment variables** for all configuration
- **Keep schemas organized** - one file per table
- **Test routes with Postman/Insomnia** for easier development
- **Check logs** with `LOG_LEVEL=debug` during development

---

Happy building! 🎉

Have questions? Check the [README.md](README.md) for detailed API documentation.
