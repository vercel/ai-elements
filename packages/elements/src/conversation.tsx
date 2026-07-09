"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { UIMessage } from "ai";
import { ArrowDownIcon, DownloadIcon } from "lucide-react";
import type { ComponentProps, Key, ReactNode } from "react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-hidden", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn("flex flex-col gap-8 p-4", className)}
    {...props}
  />
);

export type ConversationVirtualizedContentProps<TItem> = Omit<
  ConversationContentProps,
  "children"
> & {
  items: TItem[];
  children: (item: TItem, index: number) => ReactNode;
  estimateSize?: (item: TItem, index: number) => number;
  getItemKey?: (item: TItem, index: number) => Key;
  gap?: number;
  overscan?: number;
  itemClassName?: string;
};

const DEFAULT_VIRTUALIZED_MESSAGE_SIZE = 120;
const DEFAULT_VIRTUALIZED_MESSAGE_GAP = 32;
const DEFAULT_VIRTUALIZED_OVERSCAN = 8;

export const ConversationVirtualizedContent = <TItem,>({
  className,
  children,
  estimateSize,
  gap = DEFAULT_VIRTUALIZED_MESSAGE_GAP,
  getItemKey,
  itemClassName,
  items,
  overscan = DEFAULT_VIRTUALIZED_OVERSCAN,
  ...props
}: ConversationVirtualizedContentProps<TItem>) => {
  const { scrollRef } = useStickToBottomContext();

  const virtualizer = useVirtualizer<HTMLElement, HTMLDivElement>({
    count: items.length,
    estimateSize: (index) => {
      const item = items[index];

      if (item === undefined) {
        return DEFAULT_VIRTUALIZED_MESSAGE_SIZE;
      }

      return estimateSize?.(item, index) ?? DEFAULT_VIRTUALIZED_MESSAGE_SIZE;
    },
    gap,
    getItemKey: (index) => {
      const item = items[index];
      return item === undefined || !getItemKey
        ? index
        : getItemKey(item, index);
    },
    getScrollElement: () => scrollRef.current,
    overscan,
  });

  return (
    <StickToBottom.Content
      className={cn("relative min-h-full p-4", className)}
      {...props}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];

          if (item === undefined) {
            return null;
          }

          return (
            <div
              className={cn("absolute top-0 left-0 w-full", itemClassName)}
              data-index={virtualItem.index}
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              {children(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </StickToBottom.Content>
  );
};

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full dark:bg-background dark:hover:bg-muted",
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};

const getMessageText = (message: UIMessage): string =>
  message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

export type ConversationDownloadProps = Omit<
  ComponentProps<typeof Button>,
  "onClick"
> & {
  messages: UIMessage[];
  filename?: string;
  formatMessage?: (message: UIMessage, index: number) => string;
};

const defaultFormatMessage = (message: UIMessage): string => {
  const roleLabel =
    message.role.charAt(0).toUpperCase() + message.role.slice(1);
  return `**${roleLabel}:** ${getMessageText(message)}`;
};

export const messagesToMarkdown = (
  messages: UIMessage[],
  formatMessage: (
    message: UIMessage,
    index: number
  ) => string = defaultFormatMessage
): string => messages.map((msg, i) => formatMessage(msg, i)).join("\n\n");

export const ConversationDownload = ({
  messages,
  filename = "conversation.md",
  formatMessage = defaultFormatMessage,
  className,
  children,
  ...props
}: ConversationDownloadProps) => {
  const handleDownload = useCallback(() => {
    const markdown = messagesToMarkdown(messages, formatMessage);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [messages, filename, formatMessage]);

  return (
    <Button
      className={cn(
        "absolute top-4 right-4 rounded-full dark:bg-background dark:hover:bg-muted",
        className
      )}
      onClick={handleDownload}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  );
};
