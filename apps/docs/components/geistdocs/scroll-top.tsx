"use client";

import { ArrowUpCircleIcon } from "lucide-react";
import { useCallback } from "react";

export const ScrollTop = () => {
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, []);

  return (
    <button
      className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      onClick={handleScrollToTop}
      type="button"
    >
      <ArrowUpCircleIcon className="size-3.5" />
      <span>Scroll to top</span>
    </button>
  );
};
