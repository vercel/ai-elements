'use client';

import type { ToolUIPart } from 'ai';
import { ChevronDownIcon, Code } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { BundledLanguage } from 'shiki';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeBlock, CodeBlockCopyButton } from './code-block';
import { getStatusBadge } from './tool';

export type SandboxRootProps = ComponentProps<typeof Collapsible>;

export const Sandbox = ({ className, ...props }: SandboxRootProps) => (
  <Collapsible
    className={cn('not-prose group mb-4 w-full rounded-md border', className)}
    defaultOpen
    {...props}
  />
);

export type SandboxHeaderProps = {
  title?: string;
  state: ToolUIPart['state'];
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
      'flex w-full items-center justify-between gap-4 p-3',
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
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    {...props}
  />
);

export type SandboxTabsProps = ComponentProps<typeof Tabs>;

export const SandboxTabs = ({ className, ...props }: SandboxTabsProps) => (
  <Tabs className={cn('w-full', className)} {...props} />
);

export type SandboxTabsListProps = ComponentProps<typeof TabsList>;

export const SandboxTabsList = ({
  className,
  ...props
}: SandboxTabsListProps) => (
  <div className="flex items-center border-border border-b">
    <TabsList
      className={cn(
        'h-auto rounded-none border-0 bg-transparent p-0',
        className
      )}
      {...props}
    />
  </div>
);

export type SandboxTabsTriggerProps = ComponentProps<typeof TabsTrigger>;

export const SandboxTabsTrigger = ({
  className,
  ...props
}: SandboxTabsTriggerProps) => (
  <TabsTrigger
    className={cn(
      'rounded-none border-0 border-transparent border-b-2 px-4 py-2 font-medium text-muted-foreground text-sm transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none',
      className
    )}
    {...props}
  />
);

export type SandboxCopyButtonProps = {
  code: string;
  className?: string;
};

export const SandboxCopyButton = ({
  code,
  className,
}: SandboxCopyButtonProps) => (
  <div className={cn('ml-auto flex items-center pr-2', className)}>
    <CodeBlockCopyButton
      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      onCopy={() => navigator.clipboard.writeText(code)}
      size="sm"
    />
  </div>
);

export type SandboxCodeProps = {
  code: string;
  language?: BundledLanguage;
  className?: string;
};

export const SandboxCode = ({
  code,
  language = 'tsx',
  className,
}: SandboxCodeProps) => (
  <TabsContent className={cn('mt-0 text-sm', className)} value="code">
    <CodeBlock code={code} language={language} showLineNumbers />
  </TabsContent>
);

export type SandboxOutputProps = {
  output: string;
  className?: string;
};

export const SandboxOutput = ({ output, className }: SandboxOutputProps) => (
  <TabsContent className={cn('mt-0 text-sm', className)} value="output">
    <CodeBlock code={output} language="log" showLineNumbers />
  </TabsContent>
);
