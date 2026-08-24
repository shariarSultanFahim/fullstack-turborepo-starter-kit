"use client";

import type { ReactNode } from "react";

import { ThemeProvider as NextThemeProvider } from "next-themes";

// Suppress React 19 false-positive console warning for next-themes inline FOUC script
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    origConsoleError.apply(console, args);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      value={{ light: "light", dark: "dark" }}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
