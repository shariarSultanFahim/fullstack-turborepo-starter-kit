import type { Metadata } from "next";

import { UserDashboard } from "@/widgets";

export const metadata: Metadata = {
  title: "Dashboard | Turborepo Starter",
  description: "Manage your account and explore the monorepo features."
};

export default function DashboardPage() {
  return (
    <div className="flex-1">
      <UserDashboard />
    </div>
  );
}
