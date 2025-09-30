import { cn } from "@repo/shadcn-ui/lib/utils";
import { Handle, Position } from "@xyflow/react";
import { HTMLAttributes } from "react";

export type NodeProps = HTMLAttributes<HTMLDivElement> & {
  handles: {
    target: boolean;
    source: boolean;
  };
};

export const Node = ({
  handles,
  className,
  ...props
}: NodeProps) => (
  <>
    {handles.target && (
      <Handle type="target" position={Position.Left} />
    )}
    {handles.source && (
      <Handle type="source" position={Position.Right} />
    )}
    <div className={cn("relative size-full h-auto w-sm", className)} {...props} />
  </>
);

export type NodeContentProps = HTMLAttributes<HTMLDivElement>;

export const NodeContent = ({
  className,
  ...props
}: NodeContentProps) => (
  <div
    className={cn(
      'node-container flex size-full flex-col divide-y rounded-[28px] bg-card p-2 ring-1 ring-border transition-all',
      className
    )}
    {...props}
  />
);

export type NodeInnerProps = HTMLAttributes<HTMLDivElement>;

export const NodeInner = ({
  className,
  ...props
}: NodeInnerProps) => (
  <div className="overflow-hidden rounded-3xl bg-card" {...props} />
);