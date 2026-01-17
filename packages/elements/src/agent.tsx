"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Badge } from "@repo/shadcn-ui/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { BotIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, memo, useContext, useMemo } from "react";
import { Streamdown } from "streamdown";
import { CodeBlock } from "./code-block";

interface AgentContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("Agent components must be used within Agent");
  }
  return context;
};

export type AgentProps = ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Agent = memo(
  ({
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    children,
    ...props
  }: AgentProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const agentContext = useMemo(
      () => ({ isOpen, setIsOpen }),
      [isOpen, setIsOpen]
    );

    return (
      <AgentContext.Provider value={agentContext}>
        <Collapsible
          className={cn("not-prose w-full rounded-md border", className)}
          onOpenChange={setIsOpen}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </AgentContext.Provider>
    );
  }
);

export type AgentHeaderProps = ComponentProps<typeof CollapsibleTrigger> & {
  name: string;
  model?: string;
};

export const AgentHeader = memo(
  ({ className, name, model, ...props }: AgentHeaderProps) => {
    const { isOpen } = useAgent();

    return (
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between gap-4 p-3",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <BotIcon className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">{name}</span>
          {model && (
            <Badge className="font-mono text-xs" variant="secondary">
              {model}
            </Badge>
          )}
        </div>
        <ChevronDownIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
    );
  }
);

export type AgentContentProps = ComponentProps<typeof CollapsibleContent>;

export const AgentContent = memo(
  ({ className, ...props }: AgentContentProps) => (
    <CollapsibleContent
      className={cn(
        "space-y-4 p-4 pt-0",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      {...props}
    />
  )
);

export type AgentInstructionsProps = ComponentProps<"div"> & {
  children: string;
};

export const AgentInstructions = memo(
  ({ className, children, ...props }: AgentInstructionsProps) => (
    <div className={cn("space-y-2", className)} {...props}>
      <span className="font-medium text-muted-foreground text-sm">
        Instructions
      </span>
      <div className="rounded-md bg-muted/50 p-3 text-muted-foreground text-sm">
        <Streamdown>{children}</Streamdown>
      </div>
    </div>
  )
);

export type AgentToolsProps = ComponentProps<"div">;

export const AgentTools = memo(
  ({ className, children, ...props }: AgentToolsProps) => (
    <div className={cn("space-y-2", className)} {...props}>
      <span className="font-medium text-muted-foreground text-sm">Tools</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
);

export type AgentToolProps = ComponentProps<typeof Badge> & {
  name: string;
  description?: string;
};

export const AgentTool = memo(
  ({ className, name, description, ...props }: AgentToolProps) => {
    const badge = (
      <Badge
        className={cn("gap-1 px-2 py-0.5 font-normal text-xs", className)}
        variant="secondary"
        {...props}
      >
        {name}
      </Badge>
    );

    if (description) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      );
    }

    return badge;
  }
);

export type AgentOutputProps = ComponentProps<"div"> & {
  schema: string;
};

export const AgentOutput = memo(
  ({ className, schema, ...props }: AgentOutputProps) => (
    <div className={cn("space-y-2", className)} {...props}>
      <span className="font-medium text-muted-foreground text-sm">
        Output Schema
      </span>
      <div className="rounded-md bg-muted/50">
        <CodeBlock code={schema} language="typescript" />
      </div>
    </div>
  )
);

Agent.displayName = "Agent";
AgentHeader.displayName = "AgentHeader";
AgentContent.displayName = "AgentContent";
AgentInstructions.displayName = "AgentInstructions";
AgentTools.displayName = "AgentTools";
AgentTool.displayName = "AgentTool";
AgentOutput.displayName = "AgentOutput";
