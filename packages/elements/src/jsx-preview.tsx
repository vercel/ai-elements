"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AlertCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import JsxParser from "react-jsx-parser";
import type { TProps as JsxParserProps } from "react-jsx-parser";

interface JSXPreviewContextValue {
  jsx: string;
  processedJsx: string;
  error: Error | null;
  setError: (error: Error | null) => void;
  components: JsxParserProps["components"];
  bindings: JsxParserProps["bindings"];
  onErrorProp?: (error: Error) => void;
}

const JSXPreviewContext = createContext<JSXPreviewContextValue | null>(null);

export const useJSXPreview = () => {
  const context = useContext(JSXPreviewContext);
  if (!context) {
    throw new Error("JSXPreview components must be used within JSXPreview");
  }
  return context;
};

const matchJsxTag = (code: string) => {
  if (code.trim() === "") {
    return null;
  }

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*?)(\/)?>/;
  const match = code.match(tagRegex);

  if (!match || typeof match.index === "undefined") {
    return null;
  }

  const [fullMatch, tagName, attributes, selfClosing] = match;

  const type = selfClosing
    ? "self-closing"
    : fullMatch.startsWith("</")
      ? "closing"
      : "opening";

  return {
    tag: fullMatch,
    tagName,
    type,
    attributes: attributes.trim(),
    startIndex: match.index,
    endIndex: match.index + fullMatch.length,
  };
};

const completeJsxTag = (code: string) => {
  const stack: string[] = [];
  let result = "";
  let currentPosition = 0;

  while (currentPosition < code.length) {
    const match = matchJsxTag(code.slice(currentPosition));
    if (!match) {
      break;
    }
    const { tagName, type, endIndex } = match;

    if (type === "opening") {
      stack.push(tagName);
    } else if (type === "closing") {
      stack.pop();
    }

    result += code.slice(currentPosition, currentPosition + endIndex);
    currentPosition += endIndex;
  }

  return (
    result +
    stack
      .reverse()
      .map((tag) => `</${tag}>`)
      .join("")
  );
};

export type JSXPreviewProps = ComponentProps<"div"> & {
  jsx: string;
  isStreaming?: boolean;
  components?: JsxParserProps["components"];
  bindings?: JsxParserProps["bindings"];
  onError?: (error: Error) => void;
};

export const JSXPreview = memo(
  ({
    jsx,
    isStreaming = false,
    components,
    bindings,
    onError,
    className,
    children,
    ...props
  }: JSXPreviewProps) => {
    const [error, setError] = useState<Error | null>(null);

    const processedJsx = useMemo(
      () => (isStreaming ? completeJsxTag(jsx) : jsx),
      [jsx, isStreaming]
    );

    // Clear error when jsx changes
    useEffect(() => {
      setError(null);
    }, [jsx]);

    return (
      <JSXPreviewContext.Provider
        value={{
          jsx,
          processedJsx,
          error,
          setError,
          components,
          bindings,
          onErrorProp: onError,
        }}
      >
        <div className={cn("relative", className)} {...props}>
          {children}
        </div>
      </JSXPreviewContext.Provider>
    );
  }
);

JSXPreview.displayName = "JSXPreview";

export type JSXPreviewContentProps = Omit<
  ComponentProps<"div">,
  "children"
>;

export const JSXPreviewContent = memo(
  ({ className, ...props }: JSXPreviewContentProps) => {
    const { processedJsx, components, bindings, setError, onErrorProp } =
      useJSXPreview();
    const errorReportedRef = useRef<string | null>(null);

    // Reset error tracking when jsx changes
    useEffect(() => {
      errorReportedRef.current = null;
    }, [processedJsx]);

    const handleError = (err: Error) => {
      // Prevent duplicate error reports for the same jsx
      if (errorReportedRef.current === processedJsx) {
        return;
      }
      errorReportedRef.current = processedJsx;
      setError(err);
      onErrorProp?.(err);
    };

    return (
      <div className={cn("jsx-preview-content", className)} {...props}>
        <JsxParser
          jsx={processedJsx}
          components={components}
          bindings={bindings}
          onError={handleError}
          renderInWrapper={false}
        />
      </div>
    );
  }
);

JSXPreviewContent.displayName = "JSXPreviewContent";

export type JSXPreviewErrorProps = ComponentProps<"div"> & {
  children?: ReactNode | ((error: Error) => ReactNode);
};

export const JSXPreviewError = memo(
  ({ className, children, ...props }: JSXPreviewErrorProps) => {
    const { error } = useJSXPreview();

    if (!error) {
      return null;
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm",
          className
        )}
        {...props}
      >
        {children ? (
          typeof children === "function" ? (
            children(error)
          ) : (
            children
          )
        ) : (
          <>
            <AlertCircle className="size-4 shrink-0" />
            <span>{error.message}</span>
          </>
        )}
      </div>
    );
  }
);

JSXPreviewError.displayName = "JSXPreviewError";
