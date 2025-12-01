"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { MenuIcon } from "lucide-react";

export const MobileMenu = () => {
  const { setOpen } = useSidebar();

  return (
    <Button onClick={() => setOpen(true)} size="icon-sm" variant="ghost">
      <MenuIcon className="size-4" />
    </Button>
  );
};
