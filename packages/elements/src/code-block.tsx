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
import type {
  ComponentProps,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const DEFAULT_LINES_TO_SHOW = 8;
const DEFAULT_LINE_HEIGHT_REM = 1.25;

type CodeOnlyContextType = { code: string };
const CodeOnlyContext = createContext<CodeOnlyContextType>({ code: "" });

type CodeUIContextType = {
  isWrapped: boolean;
  toggleWrap: () => void;
  isCollapsible: boolean;
  linesToShow: number;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};
const CodeUIContext = createContext<CodeUIContextType>({
  isWrapped: false,
  toggleWrap: () => {
    /** supressing biome lint issue */
  },
  isCollapsible: false,
  linesToShow: DEFAULT_LINES_TO_SHOW,
  collapsed: false,
  setCollapsed: (() => {
    /** suppressing biome lint issue */
  }) as Dispatch<SetStateAction<boolean>>,
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  defaultWrap?: boolean;
  children?: ReactNode;
  collapsible?: {
    defaultCollapsed?: boolean;
    linesToShow?: number;
    lineHeightRem?: number;
  };
};

export const CodeBlock = ({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  defaultWrap = false,
  collapsible,
  ...props
}: CodeBlockProps) => {
  const [isWrapped, setIsWrapped] = useState(defaultWrap);
  const toggleWrap = useCallback(() => setIsWrapped((prev) => !prev), []);

  const isCollapsible = !!collapsible;
  const linesToShow = collapsible?.linesToShow ?? DEFAULT_LINES_TO_SHOW;
  const lineHeightRem = collapsible?.lineHeightRem ?? DEFAULT_LINE_HEIGHT_REM;
  const [collapsed, setCollapsed] = useState(
    collapsible?.defaultCollapsed ?? false
  );

  const totalLines = useMemo(() => code.split("\n").length, [code]);
  const hiddenCount = useMemo(
    () => Math.max(totalLines - linesToShow, 0),
    [totalLines, linesToShow]
  );

  const displayCode = useMemo(
    () =>
      isCollapsible && collapsed
        ? code.split("\n").slice(0, linesToShow).join("\n")
        : code,
    [code, isCollapsible, collapsed, linesToShow]
  );

  const codeCtx = useMemo(() => ({ code }), [code]);
  const uiCtx = useMemo<CodeUIContextType>(
    () => ({
      isWrapped,
      toggleWrap,
      isCollapsible,
      linesToShow,
      collapsed,
      setCollapsed,
    }),
    [isWrapped, toggleWrap, isCollapsible, linesToShow, collapsed]
  );

  return (
    <CodeOnlyContext.Provider value={codeCtx}>
      <CodeUIContext.Provider value={uiCtx}>
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-md border bg-background text-foreground",
            className
          )}
          {...props}
        >
          <div className="relative">
            <div className="relative">
              <SyntaxHighlighter
                className="overflow-hidden dark:hidden"
                codeTagProps={{
                  className: "font-mono text-sm",
                }}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  fontSize: "0.875rem",
                  lineHeight: `${lineHeightRem}rem`,
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                language={language}
                lineNumberStyle={{
                  color: "hsl(var(--muted-foreground))",
                  paddingRight: "1rem",
                  minWidth: "2.5rem",
                }}
                lineProps={(lineNumber) => ({
                  style:
                    isCollapsible && collapsed && lineNumber > linesToShow
                      ? { display: "none" }
                      : undefined,
                })}
                showLineNumbers={showLineNumbers}
                style={oneLight}
                wrapLines
                wrapLongLines={isWrapped}
              >
                {displayCode}
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
                  lineHeight: `${lineHeightRem}rem`,
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                language={language}
                lineNumberStyle={{
                  color: "hsl(var(--muted-foreground))",
                  paddingRight: "1rem",
                  minWidth: "2.5rem",
                }}
                lineProps={(lineNumber) => ({
                  style:
                    isCollapsible && collapsed && lineNumber > linesToShow
                      ? { display: "none" }
                      : undefined,
                })}
                showLineNumbers={showLineNumbers}
                style={oneDark}
                wrapLines
                wrapLongLines={isWrapped}
              >
                {displayCode}
              </SyntaxHighlighter>
              {isCollapsible && collapsed && hiddenCount > 0 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-background/95 backdrop-blur-[2px] dark:to-background/95" />
              )}
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {children}
            </div>
            {isCollapsible && hiddenCount > 0 && (
              <div className="-translate-x-1/2 absolute bottom-2 left-1/2 z-10">
                <Button
                  className="h-7 rounded-full border bg-background/60 px-3 text-foreground text-xs shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50"
                  onClick={() => setCollapsed((prev) => !prev)}
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
                      {hiddenCount} hidden{" "}
                      {hiddenCount === 1 ? "line" : "lines"}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CodeUIContext.Provider>
    </CodeOnlyContext.Provider>
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
  const { code } = useContext(CodeOnlyContext);

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
  const { isWrapped, toggleWrap } = useContext(CodeUIContext);

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

export type CodeBlockCollapsibleButtonProps = ComponentProps<typeof Button> & {
  children?: ReactNode;
};

export const CodeBlockCollapsibleButton = ({
  children,
  className,
  ...props
}: CodeBlockCollapsibleButtonProps) => {
  const { isCollapsible, collapsed, setCollapsed } = useContext(CodeUIContext);

  if (!isCollapsible) {
    return null;
  }

  return (
    <Button
      aria-pressed={collapsed}
      className={cn("shrink-0", className)}
      onClick={() => setCollapsed((prev) => !prev)}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ??
        (collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
    </Button>
  );
};
