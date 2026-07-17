"use client";

import type { ReactNode } from "react";

import { useUILibrary } from "@/hooks/geistdocs/use-ui-library";

interface PreviewLibrarySwitchProps {
  radix: ReactNode;
  base: ReactNode;
}

export const PreviewLibrarySwitch = ({
  radix,
  base,
}: PreviewLibrarySwitchProps) => {
  const { library } = useUILibrary();
  return <>{library === "base" ? base : radix}</>;
};
