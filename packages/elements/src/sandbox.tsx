"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shadcn-ui/components/ui/tabs";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ToolUIPart } from "ai";
import { ChevronDownIcon, Code } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import { getStatusBadge } from "./tool";

type SandboxTabsContextValue = {
  activeTab: string;
  contents: MutableRefObject<Map<string, string>>;
  registerContent: (tab: string, content: string) => void;
};

const SandboxTabsContext = createContext<SandboxTabsContextValue | null>(null);
const SandboxTabContentContext = createContext<string | null>(null);

export type SandboxRootProps = ComponentProps<typeof Collapsible>;

export const Sandbox = ({ className, ...props }: SandboxRootProps) => (
  <Collapsible
    className={cn("not-prose group mb-4 w-full rounded-md border", className)}
    defaultOpen
    {...props}
  />
);

export type SandboxHeaderProps = {
  title?: string;
  state: ToolUIPart["state"];
  className?: string;
};

export const SandboxHeader = ({
  className,
  title,
  state,
  ...props
}: SandboxHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      "flex w-full items-center justify-between gap-4 p-3",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      <Code className="size-4 text-muted-foreground" />
      <span className="font-medium text-sm">{title}</span>
      {getStatusBadge(state)}
    </div>
    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

export type SandboxContentProps = ComponentProps<typeof CollapsibleContent>;

export const SandboxContent = ({
  className,
  ...props
}: SandboxContentProps) => (
  <CollapsibleContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...props}
  />
);

export type SandboxTabsProps = ComponentProps<typeof Tabs>;

export const SandboxTabs = ({
  className,
  defaultValue,
  value,
  onValueChange,
  ...props
}: SandboxTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultValue ?? value ?? ""
  );
  const contentsRef = useRef(new Map<string, string>());

  const activeTab = value ?? internalActiveTab;

  const registerContent = (tab: string, content: string) => {
    contentsRef.current.set(tab, content);
  };

  const handleValueChange = (newValue: string) => {
    setInternalActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <SandboxTabsContext.Provider
      value={{ activeTab, contents: contentsRef, registerContent }}
    >
      <Tabs
        className={cn("w-full", className)}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        value={value}
        {...props}
      />
    </SandboxTabsContext.Provider>
  );
};

export type SandboxTabsBarProps = ComponentProps<"div">;

export const SandboxTabsBar = ({
  className,
  ...props
}: SandboxTabsBarProps) => (
  <div
    className={cn(
      "flex w-full items-center border-border border-t border-b",
      className
    )}
    {...props}
  />
);

export type SandboxTabsListProps = ComponentProps<typeof TabsList>;

export const SandboxTabsList = ({
  className,
  ...props
}: SandboxTabsListProps) => (
  <TabsList
    className={cn("h-auto rounded-none border-0 bg-transparent p-0", className)}
    {...props}
  />
);

export type SandboxTabsTriggerProps = ComponentProps<typeof TabsTrigger>;

export const SandboxTabsTrigger = ({
  className,
  ...props
}: SandboxTabsTriggerProps) => (
  <TabsTrigger
    className={cn(
      "rounded-none border-0 border-transparent border-b-2 px-4 py-2 font-medium text-muted-foreground text-sm transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
      className
    )}
    {...props}
  />
);

export type SandboxCopyButtonProps = {
  className?: string;
};

export const SandboxCopyButton = ({ className }: SandboxCopyButtonProps) => {
  const ctx = useContext(SandboxTabsContext);

  const handleCopy = () => {
    if (ctx) {
      const content = ctx.contents.current.get(ctx.activeTab) ?? "";
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div
      className={cn("ml-auto flex items-center justify-end pr-2", className)}
    >
      <CodeBlockCopyButton
        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        onCopy={handleCopy}
        size="sm"
      />
    </div>
  );
};

export type SandboxTabContentProps = ComponentProps<typeof TabsContent>;

export const SandboxTabContent = ({
  className,
  value,
  ...props
}: SandboxTabContentProps) => (
  <SandboxTabContentContext.Provider value={value ?? null}>
    <TabsContent
      className={cn("mt-0 text-sm", className)}
      value={value}
      {...props}
    />
  </SandboxTabContentContext.Provider>
);

export type SandboxCodeProps = ComponentProps<typeof CodeBlock>;

export const SandboxCode = ({
  className,
  code,
  ...props
}: SandboxCodeProps) => {
  const tabsCtx = useContext(SandboxTabsContext);
  const tabValue = useContext(SandboxTabContentContext);

  useEffect(() => {
    if (tabsCtx && tabValue && code) {
      tabsCtx.registerContent(tabValue, code);
    }
  }, [tabsCtx, tabValue, code]);

  return (
    <CodeBlock className={cn("border-0", className)} code={code} {...props} />
  );
};

export type SandboxOutputProps = Omit<
  ComponentProps<typeof CodeBlock>,
  "language"
>;

export const SandboxOutput = ({
  className,
  code,
  ...props
}: SandboxOutputProps) => {
  const tabsCtx = useContext(SandboxTabsContext);
  const tabValue = useContext(SandboxTabContentContext);

  useEffect(() => {
    if (tabsCtx && tabValue && code) {
      tabsCtx.registerContent(tabValue, code);
    }
  }, [tabsCtx, tabValue, code]);

  return (
    <CodeBlock
      className={cn("border-0", className)}
      code={code}
      language="log"
      {...props}
    />
  );
};
