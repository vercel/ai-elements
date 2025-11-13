"use client";

import { Toaster } from "@repo/shadcn-ui/components/ui/sonner";
import { TooltipProvider } from "@repo/shadcn-ui/components/ui/tooltip";
import { useIsMobile } from "@repo/shadcn-ui/hooks/use-mobile";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ComponentProps } from "react";
import { useChatContext } from "@/hooks/geistdocs/use-chat";
import { SearchDialog } from "./search";

type GeistdocsProviderProps = ComponentProps<typeof RootProvider> & {
  basePath?: string;
  className?: string;
};

export const GeistdocsProvider = ({
  basePath = "",
  search,
  className,
  ...props
}: GeistdocsProviderProps) => {
  const apiPath = `${basePath}/api/search`;
  const { isOpen } = useChatContext();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "transition-all",
        isOpen && !isMobile && "pr-[384px]!",
        className
      )}
    >
      <TooltipProvider>
        <RootProvider
          search={{
            SearchDialog,
            options: {
              api: apiPath,
            },
            ...search,
          }}
          {...props}
        />
      </TooltipProvider>
      <Analytics />
      <Toaster />
      <SpeedInsights />
    </div>
  );
};
