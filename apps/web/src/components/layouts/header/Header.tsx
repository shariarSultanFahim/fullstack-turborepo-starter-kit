"use client";

import Link from "next/link";

import { Github, LayoutDashboard, LogIn, LogOut, Package, UserPlus } from "lucide-react";

import { siteConfig } from "@/config/site";

import { useAuth } from "@/hooks";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ThemeSelector } from "@/widgets";
import { Button } from "@/ui";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <span>Turborepo Starter</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/#tech-stack"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tech Stack
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>

          <ThemeSelector />

          <AnimatedThemeToggler />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{user?.name || "Dashboard"}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
