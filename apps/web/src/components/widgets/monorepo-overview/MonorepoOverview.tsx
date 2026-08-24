"use client";

import Link from "next/link";

import {
  ArrowRight,
  Boxes,
  Github,
  Globe,
  Layers,
  Lock,
  PackageCheck,
  Server,
  Sparkles,
  Terminal
} from "lucide-react";

import { siteConfig } from "@/config/site";

import { useAuth } from "@/hooks";
import { stackData } from "@/data";

import { StackList } from "@/widgets";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";

export function MonorepoOverview() {
  const { isAuthenticated } = useAuth();

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
          Express.js + Prisma ORM on the backend, and shared TypeScript workspaces.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {isAuthenticated ? (
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
          )}

          <Button variant="secondary" size="lg" asChild>
            <Link href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub Profile
            </Link>
          </Button>

          <Button variant="ghost" size="lg" asChild>
            <Link href="#architecture">
              <Boxes className="mr-2 h-4 w-4" />
              Architecture
            </Link>
          </Button>
        </div>
      </section>

      {/* Demo Credentials Alert Card */}
      <section className="container max-w-3xl">
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
                Winston logging, and JWT authentication.
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
