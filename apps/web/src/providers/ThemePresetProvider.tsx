"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { themesData, type ThemePreset } from "@/data";

interface ThemePresetContextType {
  currentTheme: ThemePreset;
  themes: ThemePreset[];
  setThemeId: (id: string) => void;
  randomTheme: () => void;
}

const ThemePresetContext = createContext<ThemePresetContextType | undefined>(undefined);

const STORAGE_KEY = "app-theme-preset";

function applyThemeStyles(theme: ThemePreset) {
  if (typeof document === "undefined") return;

  let styleTag = document.getElementById("theme-preset-styles") as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "theme-preset-styles";
    document.head.appendChild(styleTag);
  }

  const lightEntries = Object.entries(theme.css.light)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join("\n");

  const darkEntries = Object.entries(theme.css.dark)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join("\n");

  styleTag.textContent = `:root {\n${lightEntries}\n}\n.dark {\n${darkEntries}\n}`;
}

export function ThemePresetProvider({ children }: { children: ReactNode }) {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && themesData.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return "default";
  });

  useEffect(() => {
    const theme = themesData.find((t) => t.id === activeThemeId) || themesData[0];
    if (theme) applyThemeStyles(theme);
  }, [activeThemeId]);

  const currentTheme = themesData.find((t) => t.id === activeThemeId) || themesData[0];

  const setThemeId = useCallback((id: string) => {
    const theme = themesData.find((t) => t.id === id);
    if (!theme) return;

    setActiveThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyThemeStyles(theme);
  }, []);

  const randomTheme = useCallback(() => {
    const otherThemes = themesData.filter((t) => t.id !== activeThemeId);
    if (otherThemes.length === 0) return;
    const random = otherThemes[Math.floor(Math.random() * otherThemes.length)];
    setThemeId(random.id);
  }, [activeThemeId, setThemeId]);

  return (
    <ThemePresetContext.Provider
      value={{
        currentTheme,
        themes: themesData,
        setThemeId,
        randomTheme
      }}
    >
      {children}
    </ThemePresetContext.Provider>
  );
}

export function useThemePreset(): ThemePresetContextType {
  const context = useContext(ThemePresetContext);
  if (!context) {
    throw new Error("useThemePreset must be used within a ThemePresetProvider");
  }
  return context;
}
