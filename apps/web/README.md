# 🌐 Next.js 16 Frontend Starter (`@repo/web`)

A modern, production-grade Next.js 16+ frontend boilerplate built with React 19, Tailwind CSS 4, TypeScript, Shadcn/UI, a **multi-theme + dark/light mode system**, and full **AI agent instruction support** inside the Turborepo monorepo.

---

## 🚀 Features

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) + React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS & LightningCSS support
- **UI & Icons**: Radix UI primitives, Lucide Icons, `sonner` toasts, `next-themes` (Dark/Light mode)
- **Multi-Theme**: `ThemePresetProvider` — runtime CSS variable injection per shadcn theme preset, persisted in `localStorage`
- **Data Fetching & State**: TanStack React Query v5 & React Table v8
- **Forms & Validation**: React Hook Form with `@hookform/resolvers` & Zod validation
- **Type Safety**: TypeScript 5+ extending `@repo/tsconfig/nextjs.json`
- **Shared Monorepo Packages**: Integrated with `@repo/types`, `@repo/validators`, and `@repo/ui`
- **Environment Management**: Type-safe runtime env validation using `@t3-oss/env-nextjs`
- **Bundle Analysis**: `@next/bundle-analyzer` support out of the box

---

## 📁 Directory Structure

```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, routes)
│   ├── assets/              # Static assets, svg icons, images
│   ├── components/          # Reusable UI components & layouts
│   │   ├── layouts/         # Page wrappers, header, footer, sidebar
│   │   ├── ui/              # Base UI primitives (Radix, Shadcn) — do not modify
│   │   └── widgets/         # Composite domain widgets
│   ├── config/              # App configuration, site metadata
│   ├── constants/           # Global client constants
│   ├── data/                # Mock data, theme presets (themes-data.ts)
│   ├── env.ts               # Type-safe environment validation
│   ├── helpers/             # Utility and helper functions
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Third-party client instances (axios, query-client)
│   ├── messages/            # Notification & i18n messages
│   ├── providers/           # Theme, query, and session providers
│   │   ├── ThemeProvider.tsx        # next-themes dark/light toggle
│   │   ├── ThemePresetProvider.tsx  # Multi-theme preset (CSS vars) system
│   │   ├── QueryProvider.tsx        # TanStack Query client provider
│   │   └── AuthProvider.tsx         # Auth session context
│   ├── schemas/             # Client-side form & validation schemas
│   ├── styles/              # Global CSS & Tailwind stylesheets
│   └── types/               # Frontend-specific type definitions
├── components.json          # Shadcn UI configuration
├── eslint.config.mjs        # ESLint flat config extending @repo/eslint-config
├── next.config.ts           # Next.js build configuration
├── package.json             # Workspace package manifest (@repo/web)
├── postcss.config.mjs       # PostCSS configuration for Tailwind CSS 4
└── tsconfig.json            # TypeScript config extending @repo/tsconfig
```

---

## 🎨 Multi-Theme System

The frontend ships a full **multi-theme + dark/light mode** system built on top of `next-themes` and a custom `ThemePresetProvider`.

### How it works

| Layer | Provider | Responsibility |
| --- | --- | --- |
| Dark / Light toggle | `ThemeProvider` (`next-themes`) | Adds/removes the `.dark` class on `<html>` |
| Color theme preset | `ThemePresetProvider` | Injects a `<style>` tag with CSS variable overrides for both `:root` (light) and `.dark` |

The two layers are **independent** — you can switch the color preset while staying in dark mode, or toggle dark/light while keeping the same color theme.

### Theme presets

Presets live in `src/data/themes-data.ts`. Each entry follows the `ThemePreset` shape:

```ts
{
  id: "rose",
  name: "Rose",
  css: {
    light: { "--primary": "...", "--background": "...", ... },
    dark:  { "--primary": "...", "--background": "...", ... },
  }
}
```

Built-in presets:

| ID        | Description                              |
| --------- | ---------------------------------------- |
| `default` | Neutral gray — Shadcn/UI default palette |
| `rose`    | Warm rose & pink tones                   |
| `blue`    | Classic deep blue accent                 |
| `green`   | Fresh emerald & sage                     |
| `orange`  | Vibrant amber & orange                   |
| `violet`  | Rich purple & violet                     |

### Persistence

The selected preset is saved to `localStorage` under the key `app-theme-preset` and restored on next visit with no flash.

### Using the theme hook

```tsx
import { useThemePreset } from "@/providers";

function ThemeSwitcher() {
  const { themes, currentTheme, setThemeId, randomTheme } = useThemePreset();

  return (
    <>
      {themes.map((t) => (
        <button key={t.id} onClick={() => setThemeId(t.id)}>
          {t.name}
        </button>
      ))}
      <button onClick={randomTheme}>Random</button>
    </>
  );
}
```

### Adding a new theme

1. Open `src/data/themes-data.ts`.
2. Append a new `ThemePreset` entry with `css.light` and `css.dark` CSS variable maps.
3. The new theme is immediately available — no other files need changing.

---

## 🤖 Agent Instructions

This app is part of an AI-agent-ready monorepo. The canonical coding rules are maintained at the **repo root**:

| File | Agent |
| --- | --- |
| `../../.agent/instructions.md` | Antigravity / Claude Code |
| `../../.cursor/rules` | Cursor IDE |
| `../../.github/copilot-instructions.md` | GitHub Copilot |

Frontend-specific rules enforced by the instructions:

- `components/ui/` (Shadcn/ui) must **not** be modified — extend via wrapper components only.
- Every component folder must have an `index.ts` barrel re-export.
- All HTTP requests go through `src/lib/api.ts` helpers (`get`, `post`, `put`, `del`).
- State: TanStack Query for server state; React Context for global UI state.
- Theme CSS variables are managed by `ThemePresetProvider` — never hardcode colors.
- Icons: `lucide-react` only — do not mix icon libraries.
- No `any` type — use `unknown` with type guards or define explicit interfaces.

---

## ⚙️ Environment Variables

Create a `.env` (or `.env.local`) file inside `apps/web/`:

```bash
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Node Environment
NODE_ENV=development
```

> Environment variables are strictly validated at runtime in `src/env.ts`.

---

## 🛠️ Getting Started

### 1. Run from Monorepo Root (Recommended)

From the root directory:

```bash
# Start frontend dev server only
npm run dev:web

# Build frontend only
npm run build:web

# Lint frontend only
npm run lint:web

# Typecheck frontend only
npm run typecheck:web
```

### 2. Run Independently

From inside the `apps/web` directory:

```bash
# Start dev server on http://localhost:3000
npm run dev

# Create optimized production build
npm run build

# Start production server
npm run start

# Run bundle analyzer
npm run analyze
```

---

## 📦 Using Monorepo Packages

You can seamlessly import shared code from the monorepo workspace packages:

```typescript
// Shared TypeScript types
import type { ApiResponse, IUser } from "@repo/types";
// Shared UI components
import { UI_VERSION } from "@repo/ui";
// Shared Zod schemas
import { loginSchema, type LoginInput } from "@repo/validators";
```
