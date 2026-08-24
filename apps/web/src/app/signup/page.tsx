import type { Metadata } from "next";

import { SignupForm } from "@/widgets";

export const metadata: Metadata = {
  title: "Sign Up | Turborepo Starter",
  description: "Create an account to get started with the full-stack monorepo application."
};

export default function SignupPage() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
      <SignupForm />
    </div>
  );
}
