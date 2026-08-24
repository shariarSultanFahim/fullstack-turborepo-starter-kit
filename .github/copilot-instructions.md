---
applyTo: "**"
---

# Copilot Instructions — NextJS + ExpressJS Turborepo Monorepo

This is a full-stack Turborepo monorepo with:
- **`apps/web`** — Next.js 16 (App Router) frontend
- **`apps/api`** — Express.js + Prisma backend
- **`packages/*`** — Shared TypeScript configs, ESLint configs, UI components (`@repo/ui`), validators (`@repo/validators`), and types (`@repo/types`)

---

## 0. Global Rules (applies everywhere)

- Remove unused imports and `console.log` statements before committing.
- Commit messages must follow the Conventional Commits format (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, etc.).
- ESLint and Prettier must be fully enforced — never disable rules without a documented reason.
- Prettier config: `singleQuote: false`, `trailingComma: "none"`, `printWidth: 100`, import ordering enforced.
- The `any` TypeScript type is forbidden. Use `unknown` with type guards or define a proper type.
- All secrets and credentials must live in `.env` files and never be hardcoded or committed.
- Never commit `.env` files with real values; only `.env.example` is committed.

---

## 1. Monorepo Structure & Turborepo

- All shared code must live under `packages/`, not duplicated inside `apps/`.
- Use the `@repo/*` package namespace for internal packages (e.g., `@repo/ui`, `@repo/validators`, `@repo/types`).
- Cross-app type sharing belongs in `packages/types`.
- Zod schemas shared between frontend and backend belong in `packages/validators`.
- `turbo.json` governs the build pipeline — tasks must be declared there to enable caching.
- Run commands at the repo root: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.

---

## 2. TypeScript

- Strict TypeScript is enforced across all packages and apps.
- `any` is never allowed — use `unknown`, generics, or explicit interfaces.
- Type files use `kebab-case` naming (e.g., `user.ts`, `auth.ts`).
- Type/interface names use `PascalCase` without a `Type` suffix (e.g., `User`, `AuthPayload`).
- Use `interface` for object shapes; use `type` for unions, intersections, and mapped types.
- Prefix interface names with `I` only in the `apps/api` backend (e.g., `IUser`, `ILoginData`) — this is the existing backend convention.
- No `I` prefix for frontend types (e.g., `User`, `LoginData`).

---

## 3. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Files & folders | `kebab-case` | `auth-service.ts`, `user-list` |
| React Components | `PascalCase` | `UserList.tsx`, `AuthForm.tsx` |
| UI component files | `kebab-case` | `button.tsx`, `input.tsx` |
| Hooks (file) | `kebab-case`, `use-` prefix | `use-auth.ts` |
| Hooks (function) | `camelCase`, `use` prefix | `useAuth()` |
| Services (API) | `PascalCase` singleton | `AuthService`, `UserService` |
| Controllers (API) | `PascalCase` singleton | `AuthController`, `UserController` |
| Constants | `SCREAMING_SNAKE_CASE` | `DEFAULT_LOCALE`, `MAX_FILE_SIZE` |
| Enums | `PascalCase` name, `SCREAMING_SNAKE_CASE` values | `UserRole.ADMIN` |
| Zod schemas | `camelCase` with `ZodSchema` suffix | `loginZodSchema`, `createUserZodSchema` |

---

## 4. Security (applies everywhere)

- Never expose internal error details or stack traces in production API responses.
- All user input must be validated with Zod before processing — no raw `req.body` usage without validation.
- Use parameterized queries via Prisma — never construct raw SQL strings from user input.
- Passwords must always be hashed with `bcrypt` (min 10 rounds); never stored in plaintext.
- JWT secrets must be strong random values loaded from environment variables.
- Auth-protected routes must use the `auth` middleware; role-protected routes must also use the `authorizeRoles` middleware.
- Avoid logging sensitive data (passwords, tokens, PII) in any environment.
- CORS must be explicitly configured — wildcard `*` is forbidden in production.
- HTTP-only, `secure`, `sameSite` flags must be set on all cookies.

---

## 5. Error Handling

- All async route handlers must be wrapped in `catchAsync` (backend) or use `try/catch` (frontend).
- Throw `ApiError` for all domain errors in the backend — never `throw new Error()` in a service.
- The global error handler (`globalErrorHandler.ts`) must catch and format all errors.
- Frontend data-fetching errors must be shown to users via toast notifications — never silently swallowed.
- All error messages in API responses must use the consistent shape: `{ success, message, errorMessages, stack? }`.

---

## 6. Code Quality

- Functions must have a single responsibility.
- No function should exceed ~60 lines without a strong justification.
- Magic numbers and strings must be extracted into named constants.
- Dead code and commented-out code blocks must not be committed.
- All non-trivial logic must have an inline comment explaining *why*, not *what*.

---

## 7. Precedence

- Repository-specific rules take precedence over global Copilot/Cursor defaults.
- App-level rules (`apps/web`, `apps/api`) take precedence over this root file where they conflict.

---

# Frontend Rules — `apps/web` (Next.js 16 App Router)

## Environment Variables

- Environment variables are managed with `@t3-oss/env-nextjs`.
- `src/env.ts` is the single source of truth — import env values only from there.
- Client-safe variables must use the `NEXT_PUBLIC_` prefix.
- Variables are validated with Zod at build time.

## Project Structure

```
src/
  app/           # App Router pages, layouts, route handlers
  components/
    layouts/     # Header, Footer, Sidebar — PascalCase files
    ui/          # shadcn/ui components — kebab-case files, do not modify
    widgets/     # Feature-specific composites — kebab-case folders, PascalCase files
    icons/       # Icon components — PascalCase, Icon suffix (e.g., ReactIcon)
  config/        # seo.ts, site.ts — static configuration
  data/          # Static/mock data — kebab-case files, variableNames end with Data
  helpers/       # Domain-specific computation helpers
  hooks/         # Custom React hooks — kebab-case files, use- prefix
  lib/           # Low-level utilities: api.ts, date.ts, cookie-client.ts
  providers/     # React Context providers — PascalCase files
  styles/        # tailwind.css global styles
  types/         # TypeScript type definitions — kebab-case files
```

## Components

- Every component folder must have an `index.ts` that re-exports it.
- `components/ui` (shadcn/ui) must not be modified — extend via wrapper components.
- Prop names must be intent-driven: `onSubmit`, `isLoading`, `variant`, `children`.
- No inline styles — Tailwind CSS utility classes only.
- Avoid deeply nested ternaries in JSX — extract to named variables or helper functions.

## Data Fetching

- All HTTP requests must use the `get`, `post`, `put`, `del` helpers from `src/lib/api.ts` (Axios-based).
- Use TanStack Query (`useQuery`, `useMutation`) for all server-state operations.
- Show loading and error states for every async operation.
- Errors must surface as toast notifications to the user.

## State Management

- Use React Context for global UI state.
- Provider files live in `src/providers/` with `PascalCase` naming.
- Provider hooks are named `useX` (e.g., `useThemePreset`).
- Avoid `useState` for server state — use TanStack Query.

## Styling

- Tailwind CSS exclusively — no inline styles, no CSS Modules, no styled-components.
- Theme CSS variables (`--background`, `--primary`, etc.) are managed via the `ThemePresetProvider`.
- Font variables (`--font-sans`, `--font-serif`, `--font-mono`) are set per theme preset.
- shadcn/ui component variants must be used as-is; extend via `className` prop only.

## Routing & Cookies

- Use Next.js App Router conventions — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- Server: use `cookies()` from `next/headers`.
- Client: use helpers from `src/lib/cookie-client.ts`.
- Middleware for auth guards lives in `src/middleware.ts`.

## Accessibility

- All interactive elements must have accessible labels.
- Use appropriate ARIA attributes where semantic HTML is insufficient.
- Meaningful images must be wrapped in `<figure>` with `<figcaption>`.

## Icons

- All icons must come from `lucide-react` only. Do not mix icon libraries.

## Utilities & Constants

- Reusable pure functions → `src/lib/` or `src/helpers/`
- Date formatting → `src/lib/date.ts`; number/currency → `Intl` API
- Slugs → `@sindresorhus/slugify`
- General-purpose hooks → `usehooks-ts` (`useLocalStorage`, `useMediaQuery`, `useDebounceValue`)
- Constants → `src/constants/` in `SCREAMING_SNAKE_CASE`

---

# Backend Rules — `apps/api` (Express.js + Prisma)

## Project Structure

```
src/
  app/
    middlewares/   # auth.ts, globalErrorHandler.ts, validateRequest.ts, etc.
    modules/       # Feature modules (auth, user, passport)
      <module>/
        <module>.controller.ts
        <module>.service.ts
        <module>.route.ts
        <module>.validation.ts
  config/          # index.ts (env config), passport.ts, strategies/
  DB/              # Prisma client initialization
  docs/          # OpenAPI registry, generators & Swagger router
  enums/           # Shared TypeScript enums
  errors/          # ApiError.ts, handleZodError.ts, handleValidationError.ts
  helpers/         # emailHelper.ts, jwtHelper.ts, etc.
  routes/          # Versioned route aggregators (index.ts, v1/, etc.)
  shared/          # catchAsync.ts, sendResponse.ts, logger.ts, prisma.ts, emailTemplate.ts
  types/           # TypeScript types/interfaces (IUser, ILoginData, etc.)
  util/            # Pure utility functions (generateOTP.ts, cryptoToken.ts)
  app.ts           # Express app setup (middlewares, CORS, session, routes)
  server.ts        # HTTP server entry point
```

## Module Pattern (Controller / Service / Route / Validation / OpenAPI)

Each module follows a strict 5-file pattern:

- **`<module>.validation.ts`** — Zod schemas for request validation. Names: `create<Action>ZodSchema`.
- **`<module>.route.ts`** — Express router. Mount validation middleware before controller.
- **`<module>.controller.ts`** — Thin handlers. Use `catchAsync`. Call service, call `sendResponse`.
- **`<module>.service.ts`** — All business logic and Prisma queries. Throws `ApiError` on domain errors.
- **`<module>.openapi.ts`** — OpenAPI 3.0 registrations using `@asteasolutions/zod-to-openapi` extending Zod schemas.

## Mandatory OpenAPI Documentation Rule

Whenever creating or modifying any API route in `apps/api`:
- Always create or update `<module>.openapi.ts` in the feature module folder.
- Extend Zod validation schemas using `.openapi({ description, example })`.
- Register the route with `registry.registerPath({...})` from `src/docs/openapi-registry.ts`.
- Wrap response schemas with `createSuccessResponseSchema(...)` or `createErrorResponseSchema(...)`.
- Import the `<module>.openapi.ts` file in `src/docs/generate-openapi.ts`.
- Never write inline JSDoc Swagger comments.
- Docs are served at `/api/docs` and `/api/docs.json`.

## API Versioning & Routing

- All routes are grouped in `src/routes/v1/` and mounted under `/api/v1`.
- `src/routes/index.ts` aggregates versions (`/v1`, `/v2`, etc.).

## Request Validation

- Every mutating route must have a Zod validation schema in `<module>.validation.ts`.
- Apply `validateRequest(schema)` middleware in the route file before the controller handler.
- Never access `req.body` in a controller or service without prior schema validation.

## Response Format

All API responses must follow this exact shape (via `sendResponse`):

```json
{
  "success": true | false,
  "statusCode": 200,
  "message": "...",
  "data": { ... } | null,
  "meta": { ... } | undefined
}
```

Error responses (via `globalErrorHandler`):

```json
{
  "success": false,
  "message": "...",
  "errorMessages": [{ "path": "", "message": "..." }],
  "stack": "..." // only in development
}
```

## Database & Prisma

- Use the shared Prisma client from `src/shared/prisma.ts` — never instantiate `PrismaClient` directly.
- Use `prisma.user.findUnique` (not `findFirst`) when looking up by a unique field.
- Select only the fields you need — avoid over-fetching with implicit `SELECT *`.
- Wrap multi-step DB operations in `prisma.$transaction([...])`.
- Database schema changes must go through a Prisma migration (`prisma migrate dev`).
- Never edit `prisma/migrations/` files manually.

## Authentication & Authorization

- JWT-based auth: access tokens (short-lived) + refresh tokens (long-lived).
- Tokens signed with secrets from `config.jwt` — never with hardcoded strings.
- The `auth` middleware must verify and decode the JWT before attaching `req.user`.
- Role-based access uses an `authorizeRoles(...roles)` middleware on top of `auth`.
- OAuth flows use Passport.js strategies defined in `src/config/strategies/`.
- Sessions (for OAuth) use `express-session` with `httpOnly`, `secure`, `sameSite` cookie flags.

## Error Handling

- Service layer always throws `ApiError(statusCode, message)` for expected domain errors.
- All controller handlers are wrapped in `catchAsync` to forward async errors to `globalErrorHandler`.
- `globalErrorHandler` handles: `ZodError`, `PrismaClientValidationError`, `TokenExpiredError`, `ApiError`, generic `Error`.
- Never throw raw `Error` objects from a service — always use `ApiError`.

## Logging

- Use `winston` for structured logging (`src/shared/logger.ts`).
- `Morgan` logs HTTP requests (success and error streams are separate).
- Never log passwords, tokens, or PII in any environment.
- In development, log at `info` level; in production, log at `warn`/`error` only.

## File Uploads

- Uploaded files are served from the `uploads/` directory via `express.static("uploads")`.
- Validate file type and size before saving — reject unknown MIME types.
- Never trust the file extension from the client — use MIME sniffing.

## Environment & Config

- All config values are loaded in `src/config/index.ts` from `process.env`.
- Config is accessed throughout the app via `import config from "../config"` — never `process.env` directly in business logic.
- `.env.example` must be kept up to date whenever a new variable is added.
