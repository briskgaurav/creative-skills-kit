"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { startReveal } from "./viewTransition";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: (origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "csk-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

function readInitialTheme(): Theme {
  // Dark is the app default (not device-dependent). SSR has no
  // document, so it renders dark; ThemeScript sets the same default
  // synchronously before hydration, and this reads it back on the
  // client so the two never disagree and the icon never flashes.
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next = theme === "dark" ? "light" : "dark";

      startReveal("theme-swap", origin, () => {
        setTheme(next);
        applyTheme(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      });
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
