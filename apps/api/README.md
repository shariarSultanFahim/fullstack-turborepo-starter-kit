# ⚙️ Express.js & Prisma Backend Starter (`@repo/api`)

A scalable, production-grade Express.js backend boilerplate built with TypeScript, Prisma ORM, PostgreSQL/MongoDB, Socket.IO, Winston logger, and Passport authentication inside the Turborepo monorepo — with **AI agent instruction support** for agent-driven development.

---

## 🚀 Features

- **Runtime & Server**: Node.js 20+ with [Express.js](https://expressjs.com/)
- **Fast Dev Server**: Powered by [tsx](https://github.com/privatenumber/tsx) for instant TypeScript execution & live reloading
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL adapter & MongoDB compatibility
- **Authentication**: JWT-based auth, bcrypt password hashing, and Passport.js (Google OAuth 2.0)
- **Validation**: Strict schema validation using [Zod](https://zod.dev/) & shared `@repo/validators`
- **Logging**: [Winston](https://github.com/winstonjs/winston) with daily log rotation and Morgan HTTP request logging
- **File Uploads**: [Multer](https://github.com/expressjs/multer) with automated image processing via Jimp / OCR via Tesseract
- **Real-Time Communication**: [Socket.IO](https://socket.io/) server integration
- **Email Service**: [Nodemailer](https://nodemailer.com/) with pre-configured SMTP options
- **Shared Monorepo Packages**: Integrated with `@repo/types`, `@repo/validators`, `@repo/tsconfig`, and `@repo/eslint-config`

---

## 📁 Directory Structure

```
apps/api/
├── prisma/
│   ├── schema.prisma        # Prisma database schema definition
│   └── migrations/          # Database migration files
├── src/
│   ├── app/                 # Modular feature modules (routes, controllers, services)
│   ├── app.ts               # Express application configuration & middlewares
│   ├── config/              # Centralized environment variable loaders
│   ├── DB/                  # Database connections & seeders
│   ├── enums/               # Backend enums & status codes
│   ├── errors/              # Custom AppError & global error handlers
│   ├── helpers/             # Utility functions & response formatters
│   ├── routes/              # Centralized API route index
│   ├── server.ts            # Server entrypoint (HTTP + Socket.IO)
│   ├── shared/              # Shared backend helpers (logger, pick, pagination)
│   ├── types/               # Backend-specific types
│   └── util/                # Miscellaneous utilities
├── package.json             # Workspace package manifest (@repo/api)
├── prisma.config.ts         # Prisma configuration
└── tsconfig.json            # TypeScript config extending @repo/tsconfig
```

---

## 🤖 Agent Instructions

This app is part of an AI-agent-ready monorepo. The canonical coding rules are maintained at the **repo root**:

| File | Agent |
| --- | --- |
| `../../.agent/instructions.md` | Antigravity / Claude Code |
| `../../.cursor/rules` | Cursor IDE |
| `../../.github/copilot-instructions.md` | GitHub Copilot |

Backend-specific rules enforced by the instructions:

### Module Pattern (4-file structure per feature)

Every feature module follows this strict pattern:

```
src/app/modules/<module>/
├── <module>.validation.ts   # Zod schemas — names: create<Action>ZodSchema
├── <module>.route.ts        # Express router — mount validateRequest() before controller
├── <module>.controller.ts   # Thin handlers — use catchAsync, call service, call sendResponse
└── <module>.service.ts      # All business logic & Prisma queries — throw ApiError on errors
```

### Response Format

All responses use a consistent shape:

```json
// Success
{ "success": true, "statusCode": 200, "message": "...", "data": {} }

// Error
{ "success": false, "message": "...", "errorMessages": [{ "path": "", "message": "..." }] }
```

### Key backend conventions

- Use the shared Prisma client from `src/shared/prisma.ts` — never instantiate `PrismaClient` directly.
- All mutating routes must have a Zod schema validated via `validateRequest(schema)` middleware.
- Never access `req.body` in a controller or service without prior schema validation.
- Service layer always throws `ApiError(statusCode, message)` — never `throw new Error()`.
- All controller handlers are wrapped in `catchAsync`.
- Config values accessed via `import config from "../config"` — never `process.env` in business logic.
- No `any` type — use `unknown` with type guards or explicit interfaces.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` inside `apps/api/`:

```bash
cp .env.example .env
```

Key variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DATABASE_NAME>?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# JWT REFRESH
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRE_IN=90d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Super Admin Seed
SUPER_ADMIN_EMAIL=your_admin_email_here
SUPER_ADMIN_PASSWORD=your_strong_password_here

# Email (SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

---

## 🛠️ Getting Started

### 1. Run from Monorepo Root (Recommended)

From the root directory:

```bash
# Start backend dev server with tsx watch
npm run dev:api

# Build backend (generates Prisma client + compiles to dist/)
npm run build:api

# Lint backend only
npm run lint:api

# Typecheck backend only
npm run typecheck:api
```

### 2. Run Independently

From inside the `apps/api` directory:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run DB Migrations
npm run prisma:migrate

# Start development server
npm run dev

# Build TypeScript to dist/
npm run build

# Start production server
npm run start

# Open Prisma Studio GUI
npm run prisma:studio
```

---

## 📦 Using Monorepo Packages

You can import shared types and validators across the monorepo:

```typescript
// Shared TypeScript types
import type { ApiResponse, IUser } from "@repo/types";
// Shared Zod schemas
import { loginSchema, type LoginInput } from "@repo/validators";
```
