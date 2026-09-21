"use client";

import { useRef } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { ThemeToggleIcon } from "./ThemeToggleIcon";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    toggleTheme(origin);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-[3vw] left-[3vw] z-100 grid size-[2.5vw] cursor-pointer place-items-center text-foreground/70 transition-colors duration-200 ease-in-out hover:text-foreground max-md:top-4 max-md:left-4 max-md:size-10"
    >
      <ThemeToggleIcon isDark={theme === "dark"} />
    </button>
  );
}
