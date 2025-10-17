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
  CSSProperties,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const DEFAULT_LINES_TO_SHOW = 8;
const DEFAULT_LINE_HEIGHT_REM = 1.25;
const DEFAULT_EXTRA_PADDING_REM = 2;

type CSSVars = CSSProperties & {
  "--cb-line-height"?: string;
  "--cb-extra-padding"?: string;
};

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
    extraPaddingRem?: number;
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
  const toggleWrap = () => setIsWrapped((prev) => !prev);

  const isCollapsible = !!collapsible;
  const linesToShow = collapsible?.linesToShow ?? DEFAULT_LINES_TO_SHOW;
  const lineHeightRem = collapsible?.lineHeightRem ?? DEFAULT_LINE_HEIGHT_REM;
  const extraPaddingRem =
    collapsible?.extraPaddingRem ?? DEFAULT_EXTRA_PADDING_REM;
  const [collapsed, setCollapsed] = useState(
    collapsible?.defaultCollapsed ?? false
  );

  const totalLines = useMemo(() => code.split("\n").length, [code]);
  const hiddenCount = useMemo(
    () => Math.max(totalLines - linesToShow, 0),
    [totalLines, linesToShow]
  );

  const codeCtx = useMemo(() => ({ code }), [code]);
  const uiCtx: CodeUIContextType = {
    isWrapped,
    toggleWrap,
    isCollapsible,
    linesToShow,
    collapsed,
    setCollapsed,
  };

  const styleVars: CSSVars = {
    "--cb-line-height": `${lineHeightRem}rem`,
    "--cb-extra-padding": `${extraPaddingRem}rem`,
  };

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
            <div
              className="relative"
              style={{
                ...styleVars,
                maxHeight:
                  isCollapsible && collapsed
                    ? `calc((var(--cb-line-height) * ${linesToShow}) + var(--cb-extra-padding))`
                    : undefined,
                overflow: isCollapsible && collapsed ? "hidden" : undefined,
              }}
            >
              <SyntaxHighlighter
                className="overflow-hidden dark:hidden"
                codeTagProps={{
                  className: "font-mono text-sm leading-[1.25rem]",
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
                  className: "font-mono text-sm leading-[1.25rem]",
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
              {isCollapsible && collapsed && hiddenCount > 0 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background/95 backdrop-blur-[2px] dark:to-background/95" />
              )}
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {children}
            </div>
            {isCollapsible && hiddenCount > 0 && (
              <div className="-translate-x-1/2 absolute bottom-2 left-1/2 z-10">
                <Button
                  className="h-7 rounded-full border bg-background/60 px-3 text-foreground text-xs shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50"
                  onClick={() => setCollapsed(!collapsed)}
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
      onClick={() => setCollapsed(!collapsed)}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ??
        (collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
    </Button>
  );
};
