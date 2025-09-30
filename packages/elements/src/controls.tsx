'use client';

import { cn } from '@/lib/utils';
import { Controls as ControlsPrimitive } from '@xyflow/react';
import type { ComponentProps } from 'react';

export type ControlsProps = ComponentProps<typeof ControlsPrimitive>;

export const Controls = ({ className, ...props }: ControlsProps) => (
  <ControlsPrimitive
    className={cn(
      'rounded-md border gap-px bg-card p-1 overflow-hidden shadow-none!',
      '[&>button]:rounded-md [&>button]:border-none',
      className,
    )}
    {...props}
  />
);
