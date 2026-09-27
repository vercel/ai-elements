"use client";

import type { UIMessage } from "ai";
import type {
  ComponentProps,
  HTMLAttributes,
  MouseEventHandler,
  PointerEventHandler,
  ReactElement,
  RefObject,
} from "react";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@repo/shadcn-ui/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ReplyIcon,
  XIcon,
} from "lucide-react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Streamdown } from "streamdown";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
      className
    )}
    {...props}
  />
);

export type MessageContentProps = ComponentProps<"div">;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
      "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
      "group-[.is-assistant]:text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageActionsProps = ComponentProps<"div">;

export const MessageActions = ({
  className,
  children,
  ...props
}: MessageActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: MessageActionProps) => {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
      <span className="sr-only">{label ?? tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

const getMessageSelection = (element: HTMLElement | null | undefined) => {
  const selection = element?.ownerDocument.getSelection();

  if (
    !element ||
    !selection ||
    selection.isCollapsed ||
    selection.rangeCount !== 1
  ) {
    return;
  }

  const range = selection.getRangeAt(0);

  // Never quote text from another message or a selection crossing messages.
  if (
    !element.contains(range.startContainer) ||
    !element.contains(range.endContainer)
  ) {
    return;
  }

  const text = selection.toString();
  return text.trim() ? text : undefined;
};

export type MessageReplyProps = MessageActionProps & {
  /** The complete message to quote when no text is selected. */
  text: string;
  /** Limit selected text to this message's content. */
  selectionRef?: RefObject<HTMLElement | null>;
  onReply: (text: string) => void;
};

export const MessageReply = ({
  children,
  label,
  onClick,
  onPointerDown,
  onPointerCancel,
  onReply,
  selectionRef,
  text,
  ...props
}: MessageReplyProps) => {
  const selectedText = useRef<string | null>(null);

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event);
      const selection =
        (event.detail > 0 ? selectedText.current : undefined) ??
        getMessageSelection(selectionRef?.current);
      selectedText.current = null;

      if (event.defaultPrevented) {
        return;
      }

      const quote = selection ?? text;
      if (quote.trim()) {
        onReply(quote);
      }
    },
    [onClick, onReply, selectionRef, text]
  );

  const handlePointerCancel = useCallback<
    PointerEventHandler<HTMLButtonElement>
  >(
    (event) => {
      selectedText.current = null;
      onPointerCancel?.(event);
    },
    [onPointerCancel]
  );

  const handlePointerDown = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      onPointerDown?.(event);
      // Capture before the browser moves focus and collapses the selection.
      selectedText.current =
        event.button === 0 && !event.defaultPrevented
          ? (getMessageSelection(selectionRef?.current) ?? null)
          : null;
    },
    [onPointerDown, selectionRef]
  );

  return (
    <MessageAction
      label={
        label ?? (children === undefined || children === null ? "Reply" : "")
      }
      onClick={handleClick}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {children ?? <ReplyIcon className="size-4" />}
    </MessageAction>
  );
};

export type MessageQuoteProps = ComponentProps<"div"> & {
  label?: string;
  onRemove?: () => void;
  removeLabel?: string;
};

export const MessageQuote = ({
  children,
  className,
  label = "Replying to",
  onRemove,
  removeLabel = "Remove quote",
  ...props
}: MessageQuoteProps) => (
  <div
    aria-label={label}
    className={cn(
      "flex w-full min-w-0 items-start gap-2 rounded-md border bg-muted/50 p-3 text-sm",
      className
    )}
    role="group"
    {...props}
  >
    <ReplyIcon
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
    />
    <div className="min-w-0 flex-1 border-s-2 border-muted-foreground/30 ps-3">
      <p className="mb-1 font-medium text-xs">{label}</p>
      <blockquote
        className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring [overflow-wrap:anywhere]"
        tabIndex={0}
      >
        {children}
      </blockquote>
    </div>
    {onRemove && (
      <MessageAction
        aria-label={removeLabel}
        className="-me-1 -mt-1 shrink-0"
        onClick={onRemove}
      >
        <XIcon aria-hidden="true" className="size-4" />
      </MessageAction>
    )}
  </div>
);

interface MessageBranchContextType {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
}

const MessageBranchContext = createContext<MessageBranchContextType | null>(
  null
);

const useMessageBranch = () => {
  const context = useContext(MessageBranchContext);

  if (!context) {
    throw new Error(
      "MessageBranch components must be used within MessageBranch"
    );
  }

  return context;
};

export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const MessageBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: MessageBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = useCallback(
    (newBranch: number) => {
      setCurrentBranch(newBranch);
      onBranchChange?.(newBranch);
    },
    [onBranchChange]
  );

  const goToPrevious = useCallback(() => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  }, [currentBranch, branches.length, handleBranchChange]);

  const goToNext = useCallback(() => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  }, [currentBranch, branches.length, handleBranchChange]);

  const contextValue = useMemo<MessageBranchContextType>(
    () => ({
      branches,
      currentBranch,
      goToNext,
      goToPrevious,
      setBranches,
      totalBranches: branches.length,
    }),
    [branches, currentBranch, goToNext, goToPrevious]
  );

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div
        className={cn("grid w-full gap-2 [&>div]:pb-0", className)}
        {...props}
      />
    </MessageBranchContext.Provider>
  );
};

export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageBranchContent = ({
  children,
  ...props
}: MessageBranchContentProps) => {
  const { currentBranch, setBranches, branches } = useMessageBranch();
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  );

  // Use useEffect to update branches when they change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => (
    <div
      className={cn(
        "grid gap-2 overflow-hidden [&>div]:pb-0",
        index === currentBranch ? "block" : "hidden"
      )}
      key={branch.key}
      {...props}
    >
      {branch}
    </div>
  ));
};

export type MessageBranchSelectorProps = ComponentProps<typeof ButtonGroup>;

export const MessageBranchSelector = ({
  className,
  ...props
}: MessageBranchSelectorProps) => {
  const { totalBranches } = useMessageBranch();

  // Don't render if there's only one branch
  if (totalBranches <= 1) {
    return null;
  }

  return (
    <ButtonGroup
      className={cn(
        "[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md",
        className
      )}
      orientation="horizontal"
      {...props}
    />
  );
};

export type MessageBranchPreviousProps = ComponentProps<typeof Button>;

export const MessageBranchPrevious = ({
  children,
  ...props
}: MessageBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useMessageBranch();

  return (
    <Button
      aria-label="Previous branch"
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </Button>
  );
};

export type MessageBranchNextProps = ComponentProps<typeof Button>;

export const MessageBranchNext = ({
  children,
  ...props
}: MessageBranchNextProps) => {
  const { goToNext, totalBranches } = useMessageBranch();

  return (
    <Button
      aria-label="Next branch"
      disabled={totalBranches <= 1}
      onClick={goToNext}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </Button>
  );
};

export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>;

export const MessageBranchPage = ({
  className,
  ...props
}: MessageBranchPageProps) => {
  const { currentBranch, totalBranches } = useMessageBranch();

  return (
    <ButtonGroupText
      className={cn(
        "border-none bg-transparent text-muted-foreground shadow-none",
        className
      )}
      {...props}
    >
      {currentBranch + 1} of {totalBranches}
    </ButtonGroupText>
  );
};

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

const streamdownPlugins = { cjk, code, math, mermaid };

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      plugins={streamdownPlugins}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    nextProps.isAnimating === prevProps.isAnimating
);

MessageResponse.displayName = "MessageResponse";

export type MessageToolbarProps = ComponentProps<"div">;

export const MessageToolbar = ({
  className,
  children,
  ...props
}: MessageToolbarProps) => (
  <div
    className={cn(
      "mt-4 flex w-full items-center justify-between gap-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
