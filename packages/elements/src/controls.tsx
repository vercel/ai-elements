"use client";

import { Controls as ControlsPrimitive } from "@xyflow/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ControlsProps = ComponentProps<typeof ControlsPrimitive>;

export const Controls = ({ className, ...props }: ControlsProps) => (
  <ControlsPrimitive
    className={cn(
      "overflow-hidden rounded-md border bg-card shadow-none!",
      className
    )}
    {...props}
  />
);
