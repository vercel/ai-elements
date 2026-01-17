"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useSidebarContext } from "@/hooks/geistdocs/use-sidebar";

export const MobileMenu = () => {
  const { isOpen, setIsOpen } = useSidebarContext();

  return (
    <Button
      className="md:hidden"
      onClick={() => setIsOpen(!isOpen)}
      size="icon-sm"
      variant="ghost"
    >
      <MenuIcon className="size-4" />
    </Button>
  );
};
