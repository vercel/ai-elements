"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialDark = stored === "true" || (!stored && prefersDark);
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update dark mode when state changes
  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDark, mounted]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <Button variant="outline" size="icon" />;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </Button>
  );
}
