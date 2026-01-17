"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FileIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useMemo,
  useState,
} from "react";
import { Diff, DiffContent, type FileContents } from "./diff";

type FileChangesStatus = "pending" | "accepted" | "rejected";

interface FileChangesContextType {
  oldFile: FileContents;
  newFile: FileContents;
  status: FileChangesStatus;
  onStatusChange?: (status: FileChangesStatus) => void;
}

const FileChangesContext = createContext<FileChangesContextType | null>(null);

const useFileChangesContext = () => {
  const context = useContext(FileChangesContext);
  if (!context) {
    throw new Error(
      "FileChanges components must be used within a <FileChanges> component"
    );
  }
  return context;
};

export type FileChangesProps = ComponentProps<typeof Collapsible> & {
  oldFile: FileContents;
  newFile: FileContents;
  status?: FileChangesStatus;
  onStatusChange?: (status: FileChangesStatus) => void;
};

export const FileChanges = ({
  oldFile,
  newFile,
  status = "pending",
  onStatusChange,
  defaultOpen = false,
  className,
  ...props
}: FileChangesProps) => (
  <FileChangesContext.Provider
    value={{ oldFile, newFile, status, onStatusChange }}
  >
    <Collapsible
      className={cn(
        "overflow-hidden rounded-lg border bg-background shadow-sm",
        className
      )}
      defaultOpen={defaultOpen}
      {...props}
    />
  </FileChangesContext.Provider>
);

export type FileChangesHeaderProps = ComponentProps<typeof CollapsibleTrigger>;

export const FileChangesHeader = ({
  className,
  children,
  ...props
}: FileChangesHeaderProps) => (
  <CollapsibleTrigger
    asChild
    className={cn("group w-full", className)}
    {...props}
  >
    <div className="flex cursor-pointer items-center justify-between bg-muted/50 px-4 py-3 transition-colors hover:bg-muted/70">
      {children}
    </div>
  </CollapsibleTrigger>
);

export type FileChangesIconProps = HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
};

export const FileChangesIcon = ({
  icon,
  className,
  ...props
}: FileChangesIconProps) => (
  <div
    className={cn("flex items-center text-muted-foreground", className)}
    {...props}
  >
    {icon ?? <FileIcon className="size-4" />}
  </div>
);

export type FileChangesTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const FileChangesTitle = ({
  className,
  children,
  ...props
}: FileChangesTitleProps) => {
  const { newFile, oldFile } = useFileChangesContext();
  const filename = newFile.name || oldFile.name;

  return (
    <p
      className={cn("font-medium font-mono text-foreground text-sm", className)}
      {...props}
    >
      {children ?? filename}
    </p>
  );
};

export type FileChangesStatsProps = HTMLAttributes<HTMLDivElement>;

export const FileChangesStats = ({
  className,
  ...props
}: FileChangesStatsProps) => {
  const { oldFile, newFile } = useFileChangesContext();

  const stats = useMemo(() => {
    const oldLines = oldFile.content.split("\n");
    const newLines = newFile.content.split("\n");

    let additions = 0;
    let deletions = 0;

    const oldSet = new Set(oldLines);
    const newSet = new Set(newLines);

    for (const line of newLines) {
      if (!oldSet.has(line)) {
        additions++;
      }
    }

    for (const line of oldLines) {
      if (!newSet.has(line)) {
        deletions++;
      }
    }

    return { additions, deletions };
  }, [oldFile, newFile]);

  return (
    <div
      className={cn("flex items-center gap-1.5 text-sm", className)}
      {...props}
    >
      <span className="flex items-center gap-0.5 text-green-600">
        <PlusIcon className="size-3" />
        {stats.additions}
      </span>
      <span className="flex items-center gap-0.5 text-red-600">
        <MinusIcon className="size-3" />
        {stats.deletions}
      </span>
    </div>
  );
};

export type FileChangesActionsProps = HTMLAttributes<HTMLDivElement>;

export const FileChangesActions = ({
  className,
  ...props
}: FileChangesActionsProps) => (
  // biome-ignore lint/a11y/noNoninteractiveElementInteractions: This wrapper needs to stop event propagation
  // biome-ignore lint/a11y/noStaticElementInteractions: This wrapper needs to stop event propagation
  <div
    className={cn("flex items-center gap-0.5", className)}
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
    {...props}
  />
);

export type FileChangesMoreButtonProps = ComponentProps<typeof Button>;

export const FileChangesMoreButton = ({
  className,
  children,
  ...props
}: FileChangesMoreButtonProps) => (
  <Button
    className={cn(
      "size-7 text-muted-foreground hover:text-foreground",
      className
    )}
    size="icon"
    variant="ghost"
    {...props}
  >
    {children ?? <MoreHorizontalIcon className="size-4" />}
  </Button>
);

export type FileChangesCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const FileChangesCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  className,
  children,
  ...props
}: FileChangesCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { newFile } = useFileChangesContext();

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(newFile.content);
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
      className={cn(
        "size-7 text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon className="size-4" />}
    </Button>
  );
};

export type FileChangesRejectButtonProps = ComponentProps<typeof Button> & {
  onReject?: () => void;
};

export const FileChangesRejectButton = ({
  onReject,
  className,
  children,
  ...props
}: FileChangesRejectButtonProps) => {
  const { onStatusChange } = useFileChangesContext();

  const handleReject = () => {
    onStatusChange?.("rejected");
    onReject?.();
  };

  return (
    <Button
      className={cn(
        "size-7 text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleReject}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <XIcon className="size-4" />}
    </Button>
  );
};

export type FileChangesAcceptButtonProps = ComponentProps<typeof Button> & {
  onAccept?: () => void;
};

export const FileChangesAcceptButton = ({
  onAccept,
  className,
  children,
  ...props
}: FileChangesAcceptButtonProps) => {
  const { onStatusChange } = useFileChangesContext();

  const handleAccept = () => {
    onStatusChange?.("accepted");
    onAccept?.();
  };

  return (
    <Button
      className={cn(
        "size-7 text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleAccept}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <CheckIcon className="size-4" />}
    </Button>
  );
};

export type FileChangesExpandButtonProps = HTMLAttributes<HTMLDivElement>;

export const FileChangesExpandButton = ({
  className,
  ...props
}: FileChangesExpandButtonProps) => (
  <div
    className={cn("flex items-center text-muted-foreground", className)}
    {...props}
  >
    <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
  </div>
);

export type FileChangesContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  showLineNumbers?: boolean;
  maxHeight?: string | number;
};

export const FileChangesContent = ({
  showLineNumbers = true,
  maxHeight,
  className,
  ...props
}: FileChangesContentProps) => {
  const { oldFile, newFile } = useFileChangesContext();

  return (
    <CollapsibleContent
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      {...props}
    >
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffContent maxHeight={maxHeight} showLineNumbers={showLineNumbers} />
      </Diff>
    </CollapsibleContent>
  );
};
