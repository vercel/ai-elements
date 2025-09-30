import { NodeToolbar } from '@xyflow/react';
import { Position } from '@xyflow/react';
import type { ComponentProps } from 'react';

type ToolbarProps = ComponentProps<typeof NodeToolbar>;

export const Toolbar = ({ className, ...props }: ToolbarProps) => (
  <NodeToolbar
    position={Position.Bottom}
    className="flex items-center gap-1 rounded-sm border bg-background p-1.5"
    {...props}
  />
);
