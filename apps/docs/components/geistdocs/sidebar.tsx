"use client";

import type {
  Folder as FolderType,
  Item as ItemType,
  Separator as SeparatorType,
} from "fumadocs-core/page-tree";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FolderProps = {
  item: FolderType;
  level: number;
  children: ReactNode;
};

export const Folder = ({ item, level, children }: FolderProps) => (
  <div className="mt-4 flex flex-col gap-2" data-level={level}>
    <span className="text-pretty font-medium text-sm">{item.name}</span>
    <ul>{children}</ul>
  </div>
);

type ItemProps = {
  item: ItemType;
};

export const Item = ({ item }: ItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.url;

  return (
    <li className="flex items-center justify-between gap-2">
      <Link
        className={cn(
          "w-full truncate text-pretty py-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground",
          isActive && "text-primary"
        )}
        href={item.url}
      >
        {item.name}
      </Link>
      {item.external && <ExternalLinkIcon className="size-4 text-primary" />}
    </li>
  );
};

type SeparatorProps = {
  item: SeparatorType;
};

export const Separator = ({ item }: SeparatorProps) => (
  <div className="mt-4 mb-2 flex items-center gap-2 first-child:mt-0">
    <span className="font-medium text-sm">{item.name}</span>
  </div>
);
