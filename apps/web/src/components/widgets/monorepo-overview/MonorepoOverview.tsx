"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  Github,
  Globe,
  Layers,
  Lock,
  PackageCheck,
  Server,
  Sparkles,
  Terminal
} from "lucide-react";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks";
import { stackData } from "@/data";
import { StackList } from "@/widgets";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";

const REPO_URL = "https://github.com/shariarSultanFahim/fullstack-turborepo-starter-kit.git";

interface SetupStep {
  id: string;
  step: string;
  title: string;
  command: string;
  description: string;
  badge: string;
}

const SETUP_STEPS: SetupStep[] = [
  {
    id: "clone",
    step: "01",
    title: "Clone the Repository",
    command: `git clone ${REPO_URL}\ncd fullstack-turborepo-starter-kit`,
    description: "Clone the fullstack monorepo starter and navigate into the root directory.",
    badge: "Git"
  },
  {
    id: "install",
    step: "02",
    title: "Install Dependencies",
    command: "npm install",
    description: "Installs and links all monorepo apps and shared `@repo/*` workspace packages.",
    badge: "npm"
  },
  {
    id: "env",
    step: "03",
    title: "Configure Environment Variables",
    command: "cp apps/api/.env.example apps/api/.env\ncp apps/web/.env.example apps/web/.env.local",
    description: "Set up frontend and backend environment files with local development defaults.",
    badge: "Env"
  },
  {
    id: "prisma",
    step: "04",
    title: "Database & Prisma Setup",
    command: "npm run --prefix apps/api prisma:generate",
    description: "Generates the type-safe Prisma client for PostgreSQL / MongoDB database access.",
    badge: "Prisma"
  },
  {
    id: "dev",
    step: "05",
    title: "Start Development Servers",
    command: "npm run dev",
    description: "Launches Next.js (:3000) and Express.js (:5000) concurrently with live-reloading.",
    badge: "Turbo"
  }
];

export function MonorepoOverview() {
  const { isAuthenticated } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string, label: string = "Command") => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="container space-y-6 text-center">
        <div className="bg-muted/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm font-medium">
          <Sparkles className="text-primary h-4 w-4" />
          <span>Turborepo + Next.js 16 + Express.js Boilerplate</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          High Performance Full-Stack Monorepo Starter
        </h1>

        <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
          Pre-configured, battle-tested Turborepo with Next.js 16 App Router on the frontend,
          Express.js + Prisma ORM on the backend, automated OpenAPI 3.0 docs, and shared TypeScript workspaces.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link href="/dashboard">
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/login">
                  <span>Explore Demo Login</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/signup">
                  <span>Create Account</span>
                </Link>
              </Button>
            </>
          )} */}

          <Button variant="outline" size="lg" asChild>
            <Link
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              API Docs (Swagger)
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/shariarSultanFahim/fullstack-turborepo-starter-kit" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub Repository
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="#architecture">
              <Boxes className="mr-2 h-4 w-4" />
              Architecture
            </Link>
          </Button>
        </div>
      </section>

      {/* Demo Credentials Alert Card */}
      {/* <section className="container max-w-3xl">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Pre-Seeded Super Admin Credentials
              </CardTitle>
              <CardDescription>
                The backend is configured with default demo credentials for immediate testing:
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-between gap-4 pt-0 sm:flex-row">
            <div className="bg-background/80 flex w-full flex-wrap items-center gap-3 rounded-md border px-3 py-2 font-mono text-sm sm:w-auto">
              <span>
                Email: <strong className="text-foreground">admin@example.com</strong>
              </span>
              <span className="text-muted-foreground">|</span>
              <span>
                Password: <strong className="text-foreground">123456</strong>
              </span>
            </div>
            <Button size="sm" asChild className="w-full shrink-0 sm:w-auto">
              <Link href="/login">
                Try Login Now
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section> */}

      {/* Repository Clone & Setup Guide Section */}
      <section id="setup-guide" className="container space-y-8">
        <div className="space-y-3 text-center">
          <div className="bg-muted inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
            <GitBranch className="text-primary h-3.5 w-3.5" />
            <span>Quick Start Guide</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Clone & Setup Repository
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base">
            Get the full-stack Turborepo up and running locally on your machine in five simple steps.
          </p>
        </div>

        {/* Featured Quick Clone Terminal Card */}
        <Card className="mx-auto max-w-3xl overflow-hidden border-2 shadow-sm">
          <div className="bg-muted/80 flex items-center justify-between border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-muted-foreground ml-2 font-mono text-xs">bash — quick clone</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => copyToClipboard(`git clone ${REPO_URL}`, "hero-clone", "Git Clone command")}
            >
              {copiedId === "hero-clone" ? (
                <>
                  <Check className="text-emerald-500 h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </Button>
          </div>
          <CardContent className="bg-zinc-950 p-4 text-zinc-100 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-4 overflow-x-auto font-mono text-sm">
              <span className="text-emerald-400 select-none">$</span>
              <code className="flex-1 select-all break-all text-zinc-100">
                git clone {REPO_URL}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Breakdown */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SETUP_STEPS.map((step) => {
            const isCopied = copiedId === step.id;
            return (
              <Card key={step.id} className="flex flex-col justify-between transition-all hover:shadow-md">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-mono text-xs font-bold tracking-widest">
                      STEP {step.step}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {step.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold">{step.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-muted/60 relative rounded-md border p-2.5 font-mono text-xs">
                    <button
                      onClick={() => copyToClipboard(step.command, step.id, step.title)}
                      className="text-muted-foreground hover:text-foreground hover:bg-background/80 absolute right-2 top-2 rounded p-1 transition-colors"
                      title="Copy command"
                    >
                      {isCopied ? (
                        <Check className="text-emerald-500 h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <pre className="text-foreground overflow-x-auto pr-7 whitespace-pre-wrap">
                      <code>{step.command}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Direct GitHub Links Card */}
          <Card className="border-primary/30 bg-primary/5 flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-primary font-mono text-xs font-bold tracking-widest">
                  SOURCE
                </span>
                <Badge variant="outline" className="text-xs">GitHub</Badge>
              </div>
              <CardTitle className="text-lg font-semibold">Repository & Docs</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Explore the open-source repository, star the project, or contribute on GitHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Button asChild variant="default" size="sm" className="w-full gap-2 text-xs">
                <Link href="https://github.com/shariarSultanFahim/fullstack-turborepo-starter-kit" target="_blank" rel="noopener noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  <span>Open GitHub Repo</span>
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full gap-2 text-xs">
                <Link href="http://localhost:5000/api/docs" target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Open API Swagger Docs</span>
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Monorepo Architecture Section */}
      <section id="architecture" className="container space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Monorepo Architecture</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Clean separation of concerns with independent deployable apps and reusable shared
            packages.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Frontend App */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Globe className="h-5 w-5" />
                </div>
                <Badge variant="outline">apps/web</Badge>
              </div>
              <CardTitle className="text-xl">Frontend Application</CardTitle>
              <CardDescription>
                Next.js 16 (App Router), React 19, Tailwind CSS 4, Shadcn/UI primitives, TanStack
                React Query v5, and React Hook Form.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-muted-foreground space-y-1.5 border-t pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>Dev Port</span>
                  <span className="text-foreground font-mono font-medium">
                    http://localhost:3000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Package Name</span>
                  <span className="text-foreground font-mono font-medium">@repo/web</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backend App */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Server className="h-5 w-5" />
                </div>
                <Badge variant="outline">apps/api</Badge>
              </div>
              <CardTitle className="text-xl">Backend API Service</CardTitle>
              <CardDescription>
                Express.js powered by tsx watch, Prisma ORM (PostgreSQL/MongoDB), Socket.IO server,
                Winston logging, JWT authentication, and automated OpenAPI 3.0 docs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-muted-foreground space-y-1.5 border-t pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>API Port</span>
                  <span className="text-foreground font-mono font-medium">
                    http://localhost:5000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Swagger Docs</span>
                  <Link
                    href="http://localhost:5000/api/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-mono font-medium hover:underline"
                  >
                    /api/docs ↗
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span>Package Name</span>
                  <span className="text-foreground font-mono font-medium">@repo/api</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shared Packages */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Layers className="h-5 w-5" />
                </div>
                <Badge variant="outline">packages/*</Badge>
              </div>
              <CardTitle className="text-xl">Shared Workspace Packages</CardTitle>
              <CardDescription>
                Reusable internal packages across apps: @repo/types (API contracts),
                @repo/validators (Zod schemas), and @repo/tsconfig.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-muted-foreground space-y-1.5 border-t pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>Packages</span>
                  <span className="text-foreground font-mono font-medium">
                    tsconfig, types, validators, ui
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Scope</span>
                  <span className="text-foreground font-mono font-medium">@repo/*</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Commands & Turborepo Workflows */}
      <section className="container space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Turborepo Workflows</h2>
          <p className="text-muted-foreground mx-auto max-w-xl">
            Granular npm workspace scripts for running both apps or targeting individual services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-muted/40">
            <CardHeader className="space-y-1 p-4">
              <div className="text-primary flex items-center gap-2 font-mono text-sm font-semibold">
                <Terminal className="h-4 w-4" />
                <span>npm run dev</span>
              </div>
              <CardDescription className="text-xs">
                Starts both Next.js & Express servers concurrently.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-muted/40">
            <CardHeader className="space-y-1 p-4">
              <div className="text-primary flex items-center gap-2 font-mono text-sm font-semibold">
                <Globe className="h-4 w-4" />
                <span>npm run dev:web</span>
              </div>
              <CardDescription className="text-xs">
                Starts only the Next.js frontend dev server.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-muted/40">
            <CardHeader className="space-y-1 p-4">
              <div className="text-primary flex items-center gap-2 font-mono text-sm font-semibold">
                <Server className="h-4 w-4" />
                <span>npm run dev:api</span>
              </div>
              <CardDescription className="text-xs">
                Starts only the Express backend via tsx watch.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-muted/40">
            <CardHeader className="space-y-1 p-4">
              <div className="text-primary flex items-center gap-2 font-mono text-sm font-semibold">
                <PackageCheck className="h-4 w-4" />
                <span>npm run build</span>
              </div>
              <CardDescription className="text-xs">
                Builds all packages and apps with Turbo caching.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tech Stack List */}
      <section id="tech-stack" className="container space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Modern Tech Stack</h2>
          <p className="text-muted-foreground">
            Standardized tools and libraries powering this template.
          </p>
        </div>
        <StackList data={stackData} />
      </section>
    </div>
  );
}
