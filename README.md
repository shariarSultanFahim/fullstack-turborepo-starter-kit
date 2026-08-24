# 🚀 Next.js & Express.js Turborepo Monorepo Boilerplate

A production-ready full-stack monorepo starter powered by **[Turborepo](https://turbo.build/repo)**, featuring **Next.js 16 (React 19, Tailwind CSS 4, Shadcn/UI)** on the frontend and **Express.js (TypeScript, Prisma ORM, Socket.IO)** on the backend, complete with shared TypeScript configs, types, validation schemas, UI packages, **multi-theme support**, and **AI agent instructions** for agent-driven development.

---

## 🏗️ Architecture & Structure

```
.
├── apps/
│   ├── web/                         # Next.js 16 App Router Frontend (@repo/web)
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md                # 📖 Frontend Setup Guide
│   │
│   └── api/                         # Express.js + Prisma Backend (@repo/api)
│       ├── src/
│       ├── prisma/
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md                # 📖 Backend Setup Guide
│
├── packages/
│   ├── tsconfig/                    # @repo/tsconfig (base, nextjs, react-library configs)
│   ├── eslint-config/               # @repo/eslint-config (base and next ESLint configs)
│   ├── types/                       # @repo/types (shared TypeScript interfaces & contracts)
│   ├── validators/                  # @repo/validators (shared Zod validation schemas)
│   └── ui/                          # @repo/ui (shared React/Shadcn component library)
│
├── .agent/
│   └── instructions.md              # 🤖 Agent rules (Antigravity / Claude Code)
├── .cursor/
│   └── rules                        # 🖱️ Cursor IDE agent rules
├── .github/
│   └── copilot-instructions.md      # 🐙 GitHub Copilot agent instructions
│
├── .husky/                          # Root git hooks (lint-staged & commitlint)
├── .gitignore                       # Monorepo-wide gitignore
├── .prettierignore                  # Monorepo-wide prettierignore
├── commitlint.config.js             # Conventional commit rules
├── prettier.config.js               # Unified Prettier formatting config
├── package.json                     # Root npm workspaces manifest & scripts
├── turbo.json                       # Turborepo task pipeline & caching
└── README.md                        # Project root documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js**: `v20.x` or later (v22 recommended)
- **npm**: `v9.x` or later
- **Database**: PostgreSQL (or MongoDB instance as configured in Prisma)

### 2. Installation

Clone the repository and install all workspace dependencies from the root:

```bash
npm install
```

### 3. Environment Variables

Both apps manage their own environment variables independently:

- **Frontend**: Copy/create `apps/web/.env.local` (see [apps/web/README.md](apps/web/README.md))
- **Backend**: Copy `apps/api/.env.example` to `apps/api/.env` and update your database credentials (see [apps/api/README.md](apps/api/README.md))

### 4. Database Setup

Generate the Prisma client:

```bash
npm run --prefix apps/api prisma:generate
```

### 5. Start Development

Run both frontend and backend concurrently with live-reloading:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📜 Available Scripts

Run these scripts from the monorepo root:

### 🚀 Development

| Command           | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| `npm run dev`     | Starts **both** Web (Next.js) & API (Express with `tsx`) concurrently |
| `npm run dev:web` | Starts **only** the Next.js frontend dev server (`:3000`)             |
| `npm run dev:api` | Starts **only** the Express backend dev server (`:5000`)              |

### 🔨 Build & Production

| Command             | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `npm run build`     | Builds all packages and apps with caching (`dist/`, `.next/`)      |
| `npm run build:web` | Builds **only** the Next.js frontend production bundle             |
| `npm run build:api` | Compiles **only** the Express.js backend via TypeScript to `dist/` |

### 🔍 Code Quality & Checks

| Command                 | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `npm run lint`          | Runs ESLint across all workspaces                          |
| `npm run lint:web`      | Lints only `apps/web`                                      |
| `npm run lint:api`      | Lints only `apps/api`                                      |
| `npm run typecheck`     | Validates TypeScript across all apps and packages          |
| `npm run typecheck:web` | Typechecks only `apps/web`                                 |
| `npm run typecheck:api` | Typechecks only `apps/api`                                 |
| `npm run format`        | Formats all files across the monorepo using Prettier       |
| `npm run format:check`  | Checks formatting across all files without modifying       |
| `npm run clean`         | Cleans build caches, `.next`, `dist`, and Turborepo caches |

---

## 📦 Shared Workspace Packages

| Package               | Purpose                                        | Import Example                                          |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| `@repo/tsconfig`      | Shared base, Next.js, and React tsconfig files | `"extends": "@repo/tsconfig/nextjs.json"`               |
| `@repo/eslint-config` | Shared ESLint configurations                   | `import baseConfig from "@repo/eslint-config/base"`     |
| `@repo/types`         | Shared TypeScript interfaces & DTOs            | `import type { ApiResponse, IUser } from "@repo/types"` |
| `@repo/validators`    | Shared Zod validation schemas                  | `import { loginSchema } from "@repo/validators"`        |
| `@repo/ui`            | Shared React component library                 | `import { UI_VERSION } from "@repo/ui"`                 |

---

## 🤖 Agent-Driven Development

This monorepo is **AI-agent ready** with a single canonical rules file that all major coding assistants read:

| File                                | Agent / Tool              |
| ----------------------------------- | ------------------------- |
| `.agent/instructions.md`            | Antigravity / Claude Code |
| `.cursor/rules`                     | Cursor IDE                |
| `.github/copilot-instructions.md`   | GitHub Copilot            |

### What the instructions cover

- **Universal rules** — naming, TypeScript strictness, commit conventions, secret handling
- **Monorepo conventions** — where shared code lives, how `turbo.json` caching works
- **Frontend rules** — component structure, data-fetching patterns, theme system, routing
- **Backend rules** — module pattern (controller / service / route / validation), Prisma usage, response format, auth
- **Security rules** — input validation, CORS, cookie flags, JWT handling
- **Error handling** — `ApiError`, `catchAsync`, global error handler

> All three agent instruction files mirror the same conventions so any AI tool produces consistent code regardless of which assistant is in use.

---

## 🎨 Multi-Theme System

The frontend ships with a full **multi-theme + dark/light mode** system:

- **Theme presets** are defined in `apps/web/src/data/themes-data.ts`. Each preset ships CSS variable overrides for both `:root` (light) and `.dark` (dark) modes.
- The active preset is applied at runtime by `ThemePresetProvider` via an injected `<style>` tag — zero flash, no extra network requests.
- The dark/light toggle is handled independently by `next-themes` (`ThemeProvider`).
- The selected preset **persists across sessions** via `localStorage`.

### Built-in presets

| Theme      | Description                              |
| ---------- | ---------------------------------------- |
| `default`  | Neutral gray — Shadcn/UI default palette |
| `rose`     | Warm rose & pink tones                   |
| `blue`     | Classic deep blue accent                 |
| `green`    | Fresh emerald & sage                     |
| `orange`   | Vibrant amber & orange                   |
| `violet`   | Rich purple & violet                     |

Each theme supports both **light** and **dark** variants automatically.

### Adding a new theme

1. Open `apps/web/src/data/themes-data.ts`.
2. Add a new entry following the existing `ThemePreset` shape — provide `css.light` and `css.dark` CSS variable maps.
3. The new theme is immediately available in the theme-switcher UI — no other changes required.

---

## ➕ Adding New Packages or Apps

### Adding a new App

1. Create a new directory in `apps/my-app`.
2. Add a `package.json` with `"name": "@repo/my-app"`.
3. Add a `tsconfig.json` extending `@repo/tsconfig/base.json` or `@repo/tsconfig/nextjs.json`.
4. Run `npm install` at root to link the workspace.

### Adding a new Shared Package

1. Create a new directory in `packages/my-package`.
2. Add a `package.json` with `"name": "@repo/my-package"`.
3. In any app that needs it, add `"@repo/my-package": "*"` to `dependencies`.
4. Run `npm install` from root.

---

## 🔒 Git Hooks & Conventional Commits

This repository is pre-configured with **Husky**, **lint-staged**, and **Commitlint**:

- **Pre-commit**: Automatically formats staged files with Prettier.
- **Commit-msg**: Ensures commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add user profile`, `fix: auth token expiry`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
