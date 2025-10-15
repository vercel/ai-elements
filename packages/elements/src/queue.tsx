"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import { ScrollArea } from "@repo/shadcn-ui/components/ui/scroll-area";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ArrowUp, ChevronRight, Paperclip, Trash2 } from "lucide-react";
import type { ComponentProps } from "react";

// Types
export type QueueMessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

export type QueueMessage = {
  id: string;
  parts: QueueMessagePart[];
};

export type QueueTodo = {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
};

// QueueItem - base list item
export type QueueItemProps = ComponentProps<"li">;

export const QueueItem = ({
  children,
  className,
  ...props
}: QueueItemProps) => (
  <li
    className={cn(
      "group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted",
      className
    )}
    {...props}
  >
    {children}
  </li>
);

// QueueItemIndicator - the status dot
export type QueueItemIndicatorProps = ComponentProps<"span"> & {
  completed?: boolean;
};

export const QueueItemIndicator = ({
  completed = false,
  className,
  ...props
}: QueueItemIndicatorProps) => (
  <span
    className={cn(
      "mt-0.5 inline-block size-2.5 rounded-full border",
      completed
        ? "border-muted-foreground/20 bg-muted-foreground/10"
        : "border-muted-foreground/50",
      className
    )}
    {...props}
  />
);

// QueueItemContent - the main text content
export type QueueItemContentProps = ComponentProps<"span"> & {
  completed?: boolean;
};

export const QueueItemContent = ({
  children,
  completed = false,
  className,
  ...props
}: QueueItemContentProps) => (
  <span
    className={cn(
      "line-clamp-1 grow break-words",
      completed
        ? "text-muted-foreground/50 line-through"
        : "text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

// QueueItemDescription - optional secondary text
export type QueueItemDescriptionProps = ComponentProps<"div"> & {
  completed?: boolean;
};

export const QueueItemDescription = ({
  children,
  completed = false,
  className,
  ...props
}: QueueItemDescriptionProps) => (
  <div
    className={cn(
      "ml-6 text-xs",
      completed ? "text-muted-foreground/40 line-through" : "text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// QueueItemActions - button container
export type QueueItemActionsProps = ComponentProps<"div">;

export const QueueItemActions = ({
  children,
  className,
  ...props
}: QueueItemActionsProps) => (
  <div className={cn("flex gap-1", className)} {...props}>
    {children}
  </div>
);

// QueueItemAction - individual action button
export type QueueItemActionProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size"
>;

export const QueueItemAction = ({
  className,
  ...props
}: QueueItemActionProps) => (
  <Button
    className={cn(
      "invisible size-auto rounded p-1 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground group-hover:visible",
      className
    )}
    size="icon"
    type="button"
    variant="ghost"
    {...props}
  />
);

// QueueItemAttachment - for file/image previews
export type QueueItemAttachmentProps = ComponentProps<"div">;

export const QueueItemAttachment = ({
  children,
  className,
  ...props
}: QueueItemAttachmentProps) => (
  <div className={cn("mt-1 flex flex-wrap gap-2", className)} {...props}>
    {children}
  </div>
);

// QueueItemImage - image attachment
export type QueueItemImageProps = ComponentProps<"img">;

export const QueueItemImage = ({
  className,
  ...props
}: QueueItemImageProps) => (
  // biome-ignore lint/performance/noImgElement: "AI Elements is framework agnostic"
  <img
    className={cn("h-8 w-8 rounded border object-cover", className)}
    height={32}
    width={32}
    {...props}
  />
);

// QueueItemFile - file attachment badge
export type QueueItemFileProps = ComponentProps<"span">;

export const QueueItemFile = ({
  children,
  className,
  ...props
}: QueueItemFileProps) => (
  <span
    className={cn(
      "flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs",
      className
    )}
    {...props}
  >
    <Paperclip size={12} />
    <span className="max-w-[100px] truncate">{children}</span>
  </span>
);

// QueueList - scrollable list container
export type QueueListProps = ComponentProps<typeof ScrollArea>;

export const QueueList = ({ children, className, ...props }: QueueListProps) => (
  <ScrollArea className={cn("-mb-1 mt-2", className)} {...props}>
    <div className="max-h-40 pr-4">
      <ul>{children}</ul>
    </div>
  </ScrollArea>
);

// QueueSection - collapsible section
export type QueueSectionProps = ComponentProps<typeof Collapsible> & {
  label: string;
  count?: number;
  icon?: React.ReactNode;
};

export const QueueSection = ({
  label,
  count,
  icon,
  children,
  className,
  defaultOpen = true,
  ...props
}: QueueSectionProps) => {
  if (count === 0) {
    return null;
  }

  return (
    <Collapsible
      className={cn(className)}
      defaultOpen={defaultOpen}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <button
          className="flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left font-medium text-muted-foreground text-sm transition-colors hover:bg-muted"
          type="button"
        >
          <span className="flex items-center gap-2">
            <ChevronRight className="size-4 transition-transform data-[state=open]:rotate-90" />
            {icon}
            <span>
              {count} {label}
            </span>
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};

// Queue - main container
export type QueueProps = ComponentProps<"div">;

export const Queue = ({ children, className, ...props }: QueueProps) => (
  <div
    className={cn(
      "flex flex-col gap-2 rounded-t-xl border border-border border-b-0 bg-background px-3 pt-2 pb-2 shadow-xs",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Convenience components for common patterns

// QueueMessageItem - pre-built message item
export type QueueMessageItemProps = Omit<QueueItemProps, "children"> & {
  message: QueueMessage;
  onRemove?: (id: string) => void;
  onSendNow?: (id: string) => void;
};

export const QueueMessageItem = ({
  message,
  onRemove,
  onSendNow,
  className,
  ...props
}: QueueMessageItemProps) => {
  const summary = (() => {
    const textParts = message.parts.filter((p) => p.type === "text");
    const text = textParts
      .map((p) => p.text)
      .join(" ")
      .trim();
    return text || "(queued message)";
  })();

  const hasFiles = message.parts.some((p) => p.type === "file" && p.url);

  return (
    <QueueItem className={className} {...props}>
      <div className="flex items-center gap-2">
        <QueueItemIndicator />
        <QueueItemContent>{summary}</QueueItemContent>
        <QueueItemActions>
          <QueueItemAction
            aria-label="Remove from queue"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.(message.id);
            }}
            title="Remove from queue"
          >
            <Trash2 size={12} />
          </QueueItemAction>
          <QueueItemAction
            aria-label="Send now"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSendNow?.(message.id);
            }}
          >
            <ArrowUp size={14} />
          </QueueItemAction>
        </QueueItemActions>
      </div>
      {hasFiles && (
        <QueueItemAttachment>
          {message.parts
            .filter((p) => p.type === "file" && p.url)
            .map((file) => {
              if (file.mediaType?.startsWith("image/") && file.url) {
                return (
                  <QueueItemImage
                    alt={file.filename || "attachment"}
                    key={file.url}
                    src={file.url}
                  />
                );
              }
              return (
                <QueueItemFile key={file.url}>
                  {file.filename || "file"}
                </QueueItemFile>
              );
            })}
        </QueueItemAttachment>
      )}
    </QueueItem>
  );
};

// QueueTodoItem - pre-built todo item
export type QueueTodoItemProps = Omit<QueueItemProps, "children"> & {
  todo: QueueTodo;
  onRemove?: (id: string) => void;
};

export const QueueTodoItem = ({
  todo,
  onRemove,
  className,
  ...props
}: QueueTodoItemProps) => {
  const isCompleted = todo.status === "completed";

  return (
    <QueueItem className={className} {...props}>
      <div className="flex items-center gap-2">
        <QueueItemIndicator completed={isCompleted} />
        <QueueItemContent completed={isCompleted}>
          {todo.title}
        </QueueItemContent>
        <QueueItemActions>
          <QueueItemAction
            aria-label="Remove todo"
            onClick={() => onRemove?.(todo.id)}
          >
            <Trash2 size={12} />
          </QueueItemAction>
        </QueueItemActions>
      </div>
      {todo.description && (
        <QueueItemDescription completed={isCompleted}>
          {todo.description}
        </QueueItemDescription>
      )}
    </QueueItem>
  );
};
