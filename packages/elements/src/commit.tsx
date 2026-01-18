"use client";

import { Avatar, AvatarFallback } from "@repo/shadcn-ui/components/ui/avatar";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { CheckIcon, CopyIcon, FileIcon, GitCommitIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useState,
} from "react";

interface CommitFile {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions?: number;
  deletions?: number;
}

interface CommitContextType {
  hash: string;
  message: string;
  author: string;
  timestamp: Date;
  files?: CommitFile[];
}

const CommitContext = createContext<CommitContextType>({
  hash: "",
  message: "",
  author: "",
  timestamp: new Date(),
});

export type CommitProps = ComponentProps<typeof Collapsible> & {
  hash: string;
  message: string;
  author: string;
  timestamp: Date;
  files?: CommitFile[];
};

export const Commit = ({
  hash,
  message,
  author,
  timestamp,
  files,
  className,
  children,
  ...props
}: CommitProps) => (
  <CommitContext.Provider value={{ hash, message, author, timestamp, files }}>
    <Collapsible
      className={cn("rounded-lg border bg-background", className)}
      {...props}
    >
      {children}
    </Collapsible>
  </CommitContext.Provider>
);

export type CommitHeaderProps = ComponentProps<typeof CollapsibleTrigger>;

export const CommitHeader = ({
  className,
  children,
  ...props
}: CommitHeaderProps) => (
  <CollapsibleTrigger asChild>
    <div
      className={cn(
        "group flex cursor-pointer items-center justify-between gap-4 p-4 text-left transition-colors hover:opacity-80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  </CollapsibleTrigger>
);

export type CommitHashProps = HTMLAttributes<HTMLSpanElement>;

export const CommitHash = ({
  className,
  children,
  ...props
}: CommitHashProps) => {
  const { hash } = useContext(CommitContext);
  const shortHash = hash.substring(0, 7);

  return (
    <span className={cn("font-mono text-xs", className)} {...props}>
      <GitCommitIcon className="mr-1 inline-block size-3" />
      {children ?? shortHash}
    </span>
  );
};

export type CommitMessageProps = HTMLAttributes<HTMLSpanElement>;

export const CommitMessage = ({
  className,
  children,
  ...props
}: CommitMessageProps) => {
  const { message } = useContext(CommitContext);

  return (
    <span className={cn("font-medium text-sm", className)} {...props}>
      {children ?? message}
    </span>
  );
};

export type CommitAuthorProps = HTMLAttributes<HTMLDivElement>;

export const CommitAuthor = ({
  className,
  children,
  ...props
}: CommitAuthorProps) => {
  const { author } = useContext(CommitContext);
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children ?? (
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export type CommitTimestampProps = HTMLAttributes<HTMLTimeElement>;

export const CommitTimestamp = ({
  className,
  children,
  ...props
}: CommitTimestampProps) => {
  const { timestamp } = useContext(CommitContext);
  const formatted = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  }).format(
    Math.round((timestamp.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day"
  );

  return (
    <time
      className={cn("text-xs", className)}
      dateTime={timestamp.toISOString()}
      {...props}
    >
      {children ?? formatted}
    </time>
  );
};

export type CommitActionsProps = HTMLAttributes<HTMLDivElement>;

export const CommitActions = ({
  className,
  children,
  ...props
}: CommitActionsProps) => (
  // biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation required for nested interactions
  // biome-ignore lint/a11y/useSemanticElements: fieldset doesn't fit this UI pattern
  <div
    className={cn("flex items-center gap-1", className)}
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
    role="group"
    {...props}
  >
    {children}
  </div>
);

export type CommitCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CommitCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CommitCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { hash } = useContext(CommitContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(hash);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("size-7 shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};

export type CommitContentProps = ComponentProps<typeof CollapsibleContent>;

export const CommitContent = ({
  className,
  children,
  ...props
}: CommitContentProps) => (
  <CollapsibleContent className={cn("border-t", className)} {...props}>
    <div className="p-4">{children}</div>
  </CollapsibleContent>
);

export type CommitFilesProps = HTMLAttributes<HTMLDivElement>;

export const CommitFiles = ({
  className,
  children,
  ...props
}: CommitFilesProps) => {
  const { files } = useContext(CommitContext);

  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children ??
        files?.map((file) => <CommitFile key={file.path} {...file} />)}
    </div>
  );
};

const fileStatusStyles = {
  added: "text-green-600 dark:text-green-400",
  modified: "text-yellow-600 dark:text-yellow-400",
  deleted: "text-red-600 dark:text-red-400",
  renamed: "text-blue-600 dark:text-blue-400",
};

const fileStatusLabels = {
  added: "A",
  modified: "M",
  deleted: "D",
  renamed: "R",
};

export type CommitFileProps = HTMLAttributes<HTMLDivElement> & CommitFile;

export const CommitFile = ({
  path,
  status,
  additions,
  deletions,
  className,
  ...props
}: CommitFileProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-2 rounded px-2 py-1 text-sm hover:bg-muted/50",
      className
    )}
    {...props}
  >
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={cn(
          "font-medium font-mono text-xs",
          fileStatusStyles[status]
        )}
      >
        {fileStatusLabels[status]}
      </span>
      <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate font-mono text-xs">{path}</span>
    </div>
    {(additions !== undefined || deletions !== undefined) && (
      <div className="flex shrink-0 items-center gap-1 font-mono text-xs">
        {additions !== undefined && additions > 0 && (
          <span className="text-green-600 dark:text-green-400">
            +{additions}
          </span>
        )}
        {deletions !== undefined && deletions > 0 && (
          <span className="text-red-600 dark:text-red-400">-{deletions}</span>
        )}
      </div>
    )}
  </div>
);
