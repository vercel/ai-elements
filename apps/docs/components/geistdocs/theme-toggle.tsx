"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const Icon = resolvedTheme === "dark" ? MoonIcon : SunIcon;

  const handleClick = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button onClick={handleClick} size="icon-sm" type="button" variant="ghost">
      <Icon className="size-4" />
    </Button>
  );
};
