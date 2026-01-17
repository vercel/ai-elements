"use client";

import { MultiFileDiff, PatchDiff } from "@pierre/diffs/react";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { CheckIcon, CopyIcon, MinusIcon, PlusIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useMemo,
  useState,
} from "react";

export interface FileContents {
  name: string;
  content: string;
}

type DiffContextType =
  | {
      mode: "files";
      oldFile: FileContents;
      newFile: FileContents;
      patch?: undefined;
    }
  | {
      mode: "patch";
      patch: string;
      oldFile?: undefined;
      newFile?: undefined;
    };

const DiffContext = createContext<DiffContextType | null>(null);

const useDiffContext = () => {
  const context = useContext(DiffContext);
  if (!context) {
    throw new Error("Diff components must be used within a <Diff> component");
  }
  return context;
};

export type DiffProps = HTMLAttributes<HTMLDivElement> &
  (
    | { mode: "files"; oldFile: FileContents; newFile: FileContents }
    | { mode: "patch"; patch: string }
  );

export const Diff = ({ className, children, ...props }: DiffProps) => {
  const contextValue: DiffContextType =
    props.mode === "files"
      ? {
          mode: "files",
          oldFile: props.oldFile,
          newFile: props.newFile,
        }
      : {
          mode: "patch",
          patch: props.patch,
        };

  return (
    <DiffContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm",
          className
        )}
      >
        {children}
      </div>
    </DiffContext.Provider>
  );
};

export type DiffHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DiffHeader = ({ className, ...props }: DiffHeaderProps) => (
  <div
    className={cn(
      "flex items-center justify-between border-b bg-muted/50 px-4 py-3",
      className
    )}
    {...props}
  />
);

export type DiffTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const DiffTitle = ({
  className,
  children,
  ...props
}: DiffTitleProps) => {
  const context = useDiffContext();

  const filename =
    context.mode === "files"
      ? context.newFile.name || context.oldFile.name
      : undefined;

  return (
    <p
      className={cn("font-medium font-mono text-foreground text-sm", className)}
      {...props}
    >
      {children ?? filename}
    </p>
  );
};

export type DiffStatsProps = HTMLAttributes<HTMLDivElement>;

export const DiffStats = ({ className, ...props }: DiffStatsProps) => {
  const context = useDiffContext();

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Diff stats calculation requires this complexity
  const stats = useMemo(() => {
    if (context.mode === "files") {
      const oldLines = context.oldFile.content.split("\n");
      const newLines = context.newFile.content.split("\n");

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
    }

    const lines = context.patch.split("\n");
    let additions = 0;
    let deletions = 0;

    for (const line of lines) {
      if (line.startsWith("+") && !line.startsWith("+++")) {
        additions++;
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        deletions++;
      }
    }

    return { additions, deletions };
  }, [context]);

  return (
    <div
      className={cn("flex items-center gap-2 text-sm", className)}
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

export type DiffActionsProps = HTMLAttributes<HTMLDivElement>;

export const DiffActions = ({ className, ...props }: DiffActionsProps) => (
  <div
    className={cn("-my-2 -mr-3 flex items-center gap-1", className)}
    {...props}
  />
);

export type DiffCopyButtonProps = ComponentProps<typeof Button> & {
  copyTarget?: "new" | "old" | "patch";
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const DiffCopyButton = ({
  copyTarget = "new",
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: DiffCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const context = useDiffContext();

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Copy logic requires conditional handling
  const getContentToCopy = () => {
    if (context.mode === "patch") {
      return context.patch;
    }

    if (copyTarget === "new") {
      return context.newFile.content;
    }

    if (copyTarget === "old") {
      return context.oldFile.content;
    }

    const oldLines = context.oldFile.content.split("\n");
    const newLines = context.newFile.content.split("\n");

    let patch = `--- a/${context.oldFile.name}\n+++ b/${context.newFile.name}\n`;

    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === newLine) {
        patch += ` ${oldLine ?? ""}\n`;
      } else {
        if (oldLine !== undefined) {
          patch += `-${oldLine}\n`;
        }
        if (newLine !== undefined) {
          patch += `+${newLine}\n`;
        }
      }
    }

    return patch;
  };

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(getContentToCopy());
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
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};

export type DiffContentProps = HTMLAttributes<HTMLDivElement> & {
  showLineNumbers?: boolean;
  maxHeight?: string | number;
};

export const DiffContent = ({
  showLineNumbers = true,
  maxHeight,
  className,
  ...props
}: DiffContentProps) => {
  const context = useDiffContext();

  const containerStyle = maxHeight
    ? {
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
      }
    : undefined;

  return (
    <div
      className={cn("overflow-auto", className)}
      style={containerStyle}
      {...props}
    >
      {context.mode === "files" ? (
        <>
          <div className="dark:hidden">
            <MultiFileDiff
              lineNumbers={showLineNumbers}
              newFile={{
                name: context.newFile.name,
                contents: context.newFile.content,
              }}
              oldFile={{
                name: context.oldFile.name,
                contents: context.oldFile.content,
              }}
              theme="one-light"
            />
          </div>
          <div className="hidden dark:block">
            <MultiFileDiff
              lineNumbers={showLineNumbers}
              newFile={{
                name: context.newFile.name,
                contents: context.newFile.content,
              }}
              oldFile={{
                name: context.oldFile.name,
                contents: context.oldFile.content,
              }}
              theme="one-dark-pro"
            />
          </div>
        </>
      ) : (
        <>
          <div className="dark:hidden">
            <PatchDiff
              lineNumbers={showLineNumbers}
              patch={context.patch}
              theme="one-light"
            />
          </div>
          <div className="hidden dark:block">
            <PatchDiff
              lineNumbers={showLineNumbers}
              patch={context.patch}
              theme="one-dark-pro"
            />
          </div>
        </>
      )}
    </div>
  );
};
