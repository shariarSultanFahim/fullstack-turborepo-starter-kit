"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  Globe,
  Layers,
  LayoutDashboard,
  Loader2,
  LogOut,
  RefreshCw,
  Server,
  ShieldCheck,
  User
} from "lucide-react";

import { useAuth, useUserProfileQuery } from "@/hooks";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator
} from "@/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserDashboard() {
  const router = useRouter();
  const { user: localUser, token, isLoading: isAuthLoading, logout } = useAuth();
  const { data: profileUser, isLoading: isProfileLoading, refetch } = useUserProfileQuery();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.push("/login?from=/dashboard");
    }
  }, [isAuthLoading, token, router]);

  if (isAuthLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  const user = profileUser || localUser;

  return (
    <div className="container max-w-5xl space-y-8 py-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-primary h-6 w-6" />
            <h1 className="text-3xl font-extrabold tracking-tight">This is dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome to the protected dashboard area of the Turborepo monorepo starter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isProfileLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isProfileLoading ? "animate-spin" : ""}`} />
            Refresh Profile
          </Button>
          <Button variant="destructive" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="shadow-sm md:col-span-1">
          <CardHeader className="pb-4 text-center">
            <Avatar className=" mx-auto h-20 w-20 items-center justify-center">
              <AvatarImage src={user?.avatar ?? "https://github.com/shadcn.png"} />
              <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-bold">{user?.name || "Administrator"}</CardTitle>
            <CardDescription className="text-xs break-all">
              {user?.email || "admin@example.com"}
            </CardDescription>
            <div className="pt-2">
              <Badge variant="secondary" className="capitalize">
                {user?.role || "SUPER_ADMIN"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Separator />
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Active Session
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-muted-foreground">User ID</span>
              <span className="text-muted-foreground max-w-[150px] truncate font-mono text-[11px]">
                {user?.id || "seeded-super-admin"}
              </span>
            </div>
            <div className="pt-3">
              <Button variant="outline" className="w-full" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monorepo Architecture Overview */}
        <div className="space-y-6 md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary h-5 w-5" />
                <CardTitle className="text-lg">Authentication & Session Info</CardTitle>
              </div>
              <CardDescription>
                You are currently authenticated via JWT bearer token stored securely in cookies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="bg-muted/30 space-y-1 rounded-lg border p-3">
                  <div className="text-foreground font-semibold">API Token Management</div>
                  <p className="text-muted-foreground">
                    Injected automatically into Axios requests via <code>src/lib/api.ts</code>.
                  </p>
                </div>
                <div className="bg-muted/30 space-y-1 rounded-lg border p-3">
                  <div className="text-foreground font-semibold">Route Protection</div>
                  <p className="text-muted-foreground">
                    Guarded via Next.js Edge <code>middleware.ts</code> + Client Auth Provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Monorepo Links */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Monorepo Developer Shortcuts</CardTitle>
              <CardDescription>
                Quick access to active apps and services in your Turborepo workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/"
                className="hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors"
              >
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Home Overview</span>
                <span className="text-muted-foreground text-[11px]">Landing page</span>
              </Link>
              <a
                href="http://localhost:5000"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors"
              >
                <Server className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium">Express API</span>
                <span className="text-muted-foreground text-[11px]">:5000</span>
              </a>
              <Link
                href="/#tech-stack"
                className="hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors"
              >
                <Layers className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Shared Packages</span>
                <span className="text-muted-foreground text-[11px]">@repo/*</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
