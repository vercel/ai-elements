"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

// Context for sharing virtualized scroll state
type VirtualizedScrollContextType = {
  isAtBottom: boolean;
  scrollToBottom: () => void;
  subscribe: (callback: () => void) => () => void;
};

const VirtualizedScrollContext = createContext<VirtualizedScrollContextType | null>(null);

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = {
  className?: string;
  /**
   * Number of items to virtualize. If not provided, virtualization is disabled.
   */
  count?: number;
  /**
   * Function to render each virtualized item.
   * Required when count is provided.
   */
  renderItem?: (index: number) => ReactNode;
  /**
   * Estimated size of each item in pixels for virtualization.
   * @default 100
   */
  estimateSize?: number;
  /**
   * Gap between items in pixels for virtualization.
   * @default 32
   */
  gap?: number;
  /**
   * Overscan count for virtualization (number of items to render outside visible area).
   * @default 5
   */
  overscan?: number;
  /**
   * Children to render when virtualization is disabled.
   */
  children?: ReactNode;
};

export const ConversationContent = ({
  className,
  count,
  renderItem,
  estimateSize = 100,
  gap = 32,
  overscan = 5,
  children,
}: ConversationContentProps) => {
  // If virtualization is enabled (count and renderItem provided)
  if (count !== undefined && renderItem) {
    return (
      <VirtualizedContentWrapper>
        <VirtualizedContent
          className={className}
          count={count}
          renderItem={renderItem}
          estimateSize={estimateSize}
          gap={gap}
          overscan={overscan}
        />
      </VirtualizedContentWrapper>
    );
  }

  // Fallback to non-virtualized rendering
  return (
    <StickToBottom.Content
      className={cn("flex flex-col gap-8 p-4", className)}
    >
      {children}
    </StickToBottom.Content>
  );
};

// Wrapper to provide context at the Conversation level
const VirtualizedContentWrapper = ({ children }: { children: ReactNode }) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollToBottomRef = useRef<(() => void) | null>(null);
  const subscribersRef = useRef<Set<() => void>>(new Set());

  const contextValue: VirtualizedScrollContextType = {
    isAtBottom,
    scrollToBottom: () => scrollToBottomRef.current?.(),
    subscribe: (callback) => {
      subscribersRef.current.add(callback);
      return () => {
        subscribersRef.current.delete(callback);
      };
    },
  };

  // Expose methods to update state from VirtualizedContent
  const updateStateRef = useRef({ setIsAtBottom, subscribersRef });
  updateStateRef.current = { setIsAtBottom, subscribersRef };

  return (
    <VirtualizedScrollContext.Provider value={contextValue}>
      <VirtualizedContentInternal
        updateState={updateStateRef}
        scrollToBottomRef={scrollToBottomRef}
      >
        {children}
      </VirtualizedContentInternal>
    </VirtualizedScrollContext.Provider>
  );
};

const VirtualizedContentInternal = ({
  children,
  updateState,
  scrollToBottomRef,
}: {
  children: ReactNode;
  updateState: React.MutableRefObject<{
    setIsAtBottom: (value: boolean) => void;
    subscribersRef: React.MutableRefObject<Set<() => void>>;
  }>;
  scrollToBottomRef: React.MutableRefObject<(() => void) | null>;
}) => {
  // Clone children and inject the update functions
  if (typeof children === 'object' && children !== null && 'type' in children) {
    return React.cloneElement(children as React.ReactElement, {
      _updateState: updateState,
      _scrollToBottomRef: scrollToBottomRef,
    });
  }
  return <>{children}</>;
};

const VirtualizedContent = ({
  className,
  count,
  renderItem,
  estimateSize,
  gap,
  overscan,
  _updateState,
  _scrollToBottomRef,
}: {
  className?: string;
  count: number;
  renderItem: (index: number) => ReactNode;
  estimateSize: number;
  gap: number;
  overscan: number;
  _updateState?: React.MutableRefObject<{
    setIsAtBottom: (value: boolean) => void;
    subscribersRef: React.MutableRefObject<Set<() => void>>;
  }>;
  _scrollToBottomRef?: React.MutableRefObject<(() => void) | null>;
}) => {
  const context = useStickToBottomContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);
  const [isAtBottomState, setIsAtBottomState] = useState(true);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const prevCountRef = useRef(count);
  const prevTotalSizeRef = useRef(0);
  const autoScrollPendingRef = useRef(false);

  // Update the wrapper's state when local state changes
  useEffect(() => {
    if (_updateState) {
      _updateState.current.setIsAtBottom(isAtBottomState);
    }
  }, [isAtBottomState, _updateState]);

  // Update the wrapper's scrollToBottom ref
  useEffect(() => {
    if (_scrollToBottomRef) {
      _scrollToBottomRef.current = () => scrollToBottom(true);
    }
  }, [_scrollToBottomRef]);

  // Find the scroll container when the component mounts
  useEffect(() => {
    // Try to get from context first
    if (context?.scrollableRef?.current && !scrollParent) {
      setScrollParent(context.scrollableRef.current);
      return;
    }

    // Fallback: find the scroll parent by traversing up the DOM
    if (contentRef.current && !scrollParent) {
      let element = contentRef.current.parentElement;
      while (element) {
        const overflowY = window.getComputedStyle(element).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          setScrollParent(element);
          break;
        }
        element = element.parentElement;
      }
    }
  });

  // Use virtualization
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollParent,
    estimateSize: () => estimateSize,
    overscan,
    gap,
  });

  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Check if user is at bottom
  const checkIsAtBottom = useCallback(() => {
    if (!scrollParent) return false;
    const threshold = 50; // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = scrollParent;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, [scrollParent]);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollParent) return;
    scrollParent.scrollTo({
      top: scrollParent.scrollHeight,
      behavior: smooth ? "smooth" : "instant",
    });
  }, [scrollParent]);

  // Track user scrolling and update isAtBottom state
  useEffect(() => {
    if (!scrollParent) return;

    const handleScroll = () => {
      // Mark as user scrolling
      isUserScrollingRef.current = true;

      // Update isAtBottom state
      setIsAtBottomState(checkIsAtBottom());

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Reset after a delay
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollParent.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollParent, checkIsAtBottom]);

  // Auto-scroll when count changes or content grows
  useEffect(() => {
    if (!scrollParent) return;

    const wasAtBottom = checkIsAtBottom() || autoScrollPendingRef.current;
    const countChanged = prevCountRef.current !== count;
    const sizeChanged = prevTotalSizeRef.current !== totalSize;

    console.log("Auto-scroll effect:", {
      count,
      prevCount: prevCountRef.current,
      wasAtBottom,
      countChanged,
      sizeChanged,
      isUserScrolling: isUserScrollingRef.current,
      autoScrollPending: autoScrollPendingRef.current,
      totalSize,
      prevTotalSize: prevTotalSizeRef.current,
    });

    prevCountRef.current = count;
    prevTotalSizeRef.current = totalSize;

    // Only auto-scroll if:
    // 1. User was already at bottom (or auto-scroll is pending)
    // 2. Not currently user-scrolling
    // 3. Count increased or size changed
    if ((countChanged || sizeChanged) && wasAtBottom && !isUserScrollingRef.current) {
      console.log("Triggering auto-scroll");
      autoScrollPendingRef.current = true;

      // Use double requestAnimationFrame to ensure smooth scrolling after DOM updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(true);
          // Keep auto-scroll pending for longer to handle smooth scroll duration
          setTimeout(() => {
            autoScrollPendingRef.current = false;
            setIsAtBottomState(true);
          }, 500);
        });
      });
    } else if (!wasAtBottom) {
      // Update the button state if we're not at bottom
      setIsAtBottomState(false);
      autoScrollPendingRef.current = false;
    }
  }, [count, totalSize, checkIsAtBottom, scrollToBottom, scrollParent]);

  // Initial scroll to bottom (only once when scrollParent is found)
  useEffect(() => {
    if (scrollParent && count > 0) {
      // Use instant scroll on initial mount
      scrollToBottom(false);
      setIsAtBottomState(true);
    }
  }, [scrollParent]); // Only depend on scrollParent, not count


  // Debug logging for isAtBottom state
  console.log("VirtualizedContent state:", {
    isAtBottom: isAtBottomState,
    count,
    totalSize,
  });

  return (
    <StickToBottom.Content className={cn("p-4", className)}>
      <div
        ref={contentRef}
        style={{
          height: `${totalSize}px`,
          position: "relative",
        }}
      >
        {items.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(virtualItem.index)}
          </div>
        ))}
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
  const stickToBottomContext = useStickToBottomContext();
  const virtualizedContext = useContext(VirtualizedScrollContext);

  // Use virtualized context if available, otherwise fall back to stick-to-bottom
  const isAtBottom = virtualizedContext?.isAtBottom ?? stickToBottomContext?.isAtBottom ?? true;
  const scrollToBottomFn = virtualizedContext?.scrollToBottom ?? stickToBottomContext?.scrollToBottom;

  const handleScrollToBottom = useCallback(() => {
    scrollToBottomFn?.();
  }, [scrollToBottomFn]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
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
