"use client";

import type { ReactNode } from "react";

import { AuthProvider, QueryProvider, ThemePresetProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemePresetProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </ThemePresetProvider>
    </ThemeProvider>
  );
}
