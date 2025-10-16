"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  CheckIcon,
  ChevronDown,
  ChevronUp,
  CopyIcon,
  WrapText,
} from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const DEFAULT_LINES_TO_SHOW = 8;
const LINE_HEIGHT_REM = 1.25;
const EXTRA_PADDING_REM = 2;

type CodeBlockContextType = {
  code: string;
  isWrapped: boolean;
  toggleWrap: () => void;
  collapsibleEnabled: boolean;
  setCollapsibleEnabled: (enabled: boolean) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  linesToShow: number;
  setLinesToShow: (n: number) => void;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
  isWrapped: false,
  toggleWrap: () => {
    /* noop */
  },
  collapsibleEnabled: false,
  setCollapsibleEnabled: () => {
    /* noop */
  },
  collapsed: false,
  setCollapsed: () => {
    /* noop */
  },
  linesToShow: DEFAULT_LINES_TO_SHOW,
  setLinesToShow: () => {
    /* noop */
  },
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  defaultWrap?: boolean;
  children?: ReactNode;
};

export const CodeBlock = ({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  defaultWrap = false,
  ...props
}: CodeBlockProps) => {
  const [isWrapped, setIsWrapped] = useState(defaultWrap);
  const toggleWrap = () => setIsWrapped((prev) => !prev);

  const [collapsibleEnabled, setCollapsibleEnabled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [linesToShow, setLinesToShow] = useState(DEFAULT_LINES_TO_SHOW);

  const totalLines = useMemo(() => code.split("\n").length, [code]);
  const hiddenCount = useMemo(
    () => Math.max(totalLines - linesToShow, 0),
    [totalLines, linesToShow]
  );
  const collapsedMaxHeightRem =
    linesToShow * LINE_HEIGHT_REM + EXTRA_PADDING_REM;

  return (
    <CodeBlockContext.Provider
      value={{
        code,
        isWrapped,
        toggleWrap,
        collapsibleEnabled,
        setCollapsibleEnabled,
        collapsed,
        setCollapsed,
        linesToShow,
        setLinesToShow,
      }}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md border bg-background text-foreground",
          className
        )}
        {...props}
      >
        <div className="relative">
          <div
            className="relative"
            style={{
              maxHeight:
                collapsibleEnabled && collapsed
                  ? `${collapsedMaxHeightRem}rem`
                  : undefined,
              overflow: collapsibleEnabled && collapsed ? "hidden" : undefined,
            }}
          >
            <SyntaxHighlighter
              className="overflow-hidden dark:hidden"
              codeTagProps={{
                className: "font-mono text-sm",
              }}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
              }}
              language={language}
              lineNumberStyle={{
                color: "hsl(var(--muted-foreground))",
                paddingRight: "1rem",
                minWidth: "2.5rem",
              }}
              showLineNumbers={showLineNumbers}
              style={oneLight}
              wrapLongLines={isWrapped}
            >
              {code}
            </SyntaxHighlighter>
            <SyntaxHighlighter
              className="hidden overflow-hidden dark:block"
              codeTagProps={{
                className: "font-mono text-sm",
              }}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
              }}
              language={language}
              lineNumberStyle={{
                color: "hsl(var(--muted-foreground))",
                paddingRight: "1rem",
                minWidth: "2.5rem",
              }}
              showLineNumbers={showLineNumbers}
              style={oneDark}
              wrapLongLines={isWrapped}
            >
              {code}
            </SyntaxHighlighter>
            {collapsibleEnabled && collapsed && hiddenCount > 0 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background/95 backdrop-blur-[2px] dark:to-background/95" />
            )}
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {children}
            {collapsibleEnabled && hiddenCount > 0 && (
              <Button
                aria-pressed={collapsed}
                className="shrink-0"
                onClick={() => setCollapsed((v) => !v)}
                size="icon"
                variant="ghost"
              >
                {collapsed ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronUp size={14} />
                )}
              </Button>
            )}
          </div>
          {collapsibleEnabled && hiddenCount > 0 && (
            <div className="-translate-x-1/2 absolute bottom-2 left-1/2 z-10">
              <Button
                className="h-7 rounded-full border bg-background/60 px-3 text-foreground text-xs shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50"
                onClick={() => setCollapsed((v) => !v)}
                size="sm"
                variant="secondary"
              >
                {collapsed ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronUp size={14} />
                )}
                {collapsed && (
                  <span className="ml-2 text-muted-foreground">
                    {hiddenCount} hidden {hiddenCount === 1 ? "line" : "lines"}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
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

export type CodeBlockWrapButtonProps = ComponentProps<typeof Button> & {
  onToggle?: (wrapped: boolean) => void;
};

export const CodeBlockWrapButton = ({
  onToggle,
  children,
  className,
  ...props
}: CodeBlockWrapButtonProps) => {
  const { isWrapped, toggleWrap } = useContext(CodeBlockContext);

  const handleClick = () => {
    toggleWrap();
    onToggle?.(!isWrapped);
  };

  return (
    <Button
      aria-pressed={isWrapped}
      className={cn("shrink-0", className)}
      onClick={handleClick}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <WrapText size={14} />}
    </Button>
  );
};

export type CodeBlockCollapsibleButtonProps = {
  linesToShow?: number;
  defaultCollapsed?: boolean;
};

export const CodeBlockCollapsibleButton = ({
  linesToShow = DEFAULT_LINES_TO_SHOW,
  defaultCollapsed = true,
}: CodeBlockCollapsibleButtonProps) => {
  const { setCollapsibleEnabled, setLinesToShow, setCollapsed } =
    useContext(CodeBlockContext);

  useEffect(() => {
    setCollapsibleEnabled(true);
    setLinesToShow(linesToShow);
    setCollapsed(defaultCollapsed);
  }, [
    setCollapsibleEnabled,
    setLinesToShow,
    setCollapsed,
    linesToShow,
    defaultCollapsed,
  ]);

  return null;
};
