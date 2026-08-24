export interface FeatureItem {
  title: string;
  desc: string;
  category: "Frontend" | "Backend" | "Monorepo" | "Shared";
}

export const featuresData: FeatureItem[] = [
  {
    title: "Next.js 16 App Router",
    desc: "React 19, Server & Client Components, Turbopack, and optimized page rendering.",
    category: "Frontend"
  },
  {
    title: "Express.js & tsx Backend",
    desc: "Ultra-fast live-reloading with tsx, Socket.IO, Winston logger, and Passport OAuth ready.",
    category: "Backend"
  },
  {
    title: "Prisma ORM & PostgreSQL",
    desc: "Type-safe database queries, automated migrations, seeders, and multi-database support.",
    category: "Backend"
  },
  {
    title: "Turborepo Task Pipelines",
    desc: "Instant build caching, parallel execution, and monorepo-wide typechecking and linting.",
    category: "Monorepo"
  },
  {
    title: "Shared Packages (@repo/*)",
    desc: "Cross-workspace TypeScript configs, shared API types, and shared Zod validation schemas.",
    category: "Shared"
  },
  {
    title: "Tailwind CSS 4 & Shadcn UI",
    desc: "Accessible Radix UI primitives, dark/light themes via next-themes, and rich sonner toasts.",
    category: "Frontend"
  },
  {
    title: "OpenAPI 3.0 & Swagger UI",
    desc: "Auto-generated REST API docs from Zod schemas at /api/docs and raw JSON spec at /api/docs.json.",
    category: "Backend"
  },
  {
    title: "Agent-Driven Development",
    desc: "Pre-configured AI agent instructions for Antigravity, Claude Code, Cursor, and GitHub Copilot.",
    category: "Shared"
  }
];
