"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@repo/shadcn-ui/components/ui/navigation-menu";
import { useIsMobile } from "@repo/shadcn-ui/hooks/use-mobile";
import Link from "next/link";

type DesktopMenuProps = {
  items: { label: string; href: string }[];
};

export const DesktopMenu = ({ items }: DesktopMenuProps) => {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="gap-px">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              asChild
              className="rounded-md px-3 font-medium text-sm"
            >
              <Link href={item.href}>{item.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
