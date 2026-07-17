"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";

import {
  type UILibrary,
  useUILibrary,
} from "@/hooks/geistdocs/use-ui-library";

const options: { value: UILibrary; label: string }[] = [
  { value: "radix", label: "Radix UI" },
  { value: "base", label: "Base UI" },
];

export const UILibrarySwitcher = ({ className }: { className?: string }) => {
  const { library, setLibrary } = useUILibrary();

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center rounded-md border bg-muted p-0.5 text-muted-foreground",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={cn(
            "inline-flex h-7 items-center rounded-[5px] px-2.5 text-xs font-medium transition-colors",
            library === option.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
          onClick={() => setLibrary(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
