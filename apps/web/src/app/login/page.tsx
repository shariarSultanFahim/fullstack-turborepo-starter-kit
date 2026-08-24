import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/widgets";

export const metadata: Metadata = {
  title: "Sign In | Turborepo Starter",
  description: "Sign in to your account to access the dashboard."
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
