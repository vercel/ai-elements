"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { type BundledLanguage, codeToHtml } from "shiki";

interface SnippetContextType {
  code: string;
}

const SnippetContext = createContext<SnippetContextType>({
  code: "",
});

export type SnippetProps = HTMLAttributes<HTMLElement> & {
  code: string;
  language?: BundledLanguage;
  inline?: boolean;
};

export const Snippet = ({
  code,
  language,
  inline = false,
  className,
  children,
  ...props
}: SnippetProps) => {
  const [html, setHtml] = useState<string>("");
  const [darkHtml, setDarkHtml] = useState<string>("");
  const mounted = useRef(false);

  useEffect(() => {
    if (!language) {
      return;
    }

    Promise.all([
      codeToHtml(code, { lang: language, theme: "one-light" }),
      codeToHtml(code, { lang: language, theme: "one-dark-pro" }),
    ]).then(([light, dark]) => {
      if (!mounted.current) {
        setHtml(light);
        setDarkHtml(dark);
        mounted.current = true;
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [code, language]);

  if (inline) {
    return (
      <SnippetContext.Provider value={{ code }}>
        <code
          className={cn(
            "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
            className
          )}
          {...props}
        >
          {code}
          {children}
        </code>
      </SnippetContext.Provider>
    );
  }

  if (!language) {
    return (
      <SnippetContext.Provider value={{ code }}>
        <div
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 font-mono text-sm",
            className
          )}
          {...props}
        >
          <code>{code}</code>
          {children}
        </div>
      </SnippetContext.Provider>
    );
  }

  return (
    <SnippetContext.Provider value={{ code }}>
      <div
        className={cn(
          "group relative inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 font-mono text-sm",
          className
        )}
        {...props}
      >
        <div
          className="dark:hidden [&>pre]:m-0 [&>pre]:bg-transparent! [&>pre]:p-0 [&_code]:text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "needed for syntax highlighting"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div
          className="hidden dark:block [&>pre]:m-0 [&>pre]:bg-transparent! [&>pre]:p-0 [&_code]:text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "needed for syntax highlighting"
          dangerouslySetInnerHTML={{ __html: darkHtml }}
        />
        {children}
      </div>
    </SnippetContext.Provider>
  );
};

export type SnippetCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const SnippetCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: SnippetCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(SnippetContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
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
      className={cn("size-6 shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={12} />}
    </Button>
  );
};
