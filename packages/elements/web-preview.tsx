'use client';

import { ChevronDownIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { Button } from '@ai-studio/shadcn-ui/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ai-studio/shadcn-ui/components/ui/collapsible';
import { Input } from '@ai-studio/shadcn-ui/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ai-studio/shadcn-ui/components/ui/tooltip';
import { cn } from '@ai-studio/shadcn-ui/lib/utils';

export type WebPreviewContextValue = {
  url: string;
  setUrl: (url: string) => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
};

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

const useWebPreview = () => {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error('WebPreview components must be used within a WebPreview');
  }
  return context;
};

export type WebPreviewProps = ComponentProps<'div'> & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
};

export const WebPreview = ({
  className,
  children,
  defaultUrl = '',
  onUrlChange,
  ...props
}: WebPreviewProps) => {
  const [url, setUrl] = useState(defaultUrl);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onUrlChange?.(newUrl);
  };

  const contextValue: WebPreviewContextValue = {
    url,
    setUrl: handleUrlChange,
    consoleOpen,
    setConsoleOpen,
  };

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex size-full flex-col rounded-lg border bg-card',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
};

export type WebPreviewNavigationProps = ComponentProps<'div'>;

export const WebPreviewNavigation = ({
  className,
  children,
  ...props
}: WebPreviewNavigationProps) => (
  <div
    className={cn('flex items-center gap-1 border-b p-2', className)}
    {...props}
  >
    {children}
  </div>
);

export type WebPreviewNavigationButtonProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export const WebPreviewNavigationButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:text-foreground"
          onClick={onClick}
          disabled={disabled}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export type WebPreviewUrlProps = ComponentProps<typeof Input>;

export const WebPreviewUrl = ({
  value,
  onChange,
  onKeyDown,
  ...props
}: WebPreviewUrlProps) => {
  const { url, setUrl } = useWebPreview();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      setUrl(target.value);
    }
    onKeyDown?.(event);
  };

  return (
    <Input
      className="flex-1 h-8 text-sm"
      placeholder="Enter URL..."
      value={value ?? url}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export type WebPreviewBodyProps = ComponentProps<'iframe'> & {
  loading?: ReactNode;
};

export const WebPreviewBody = ({
  className,
  loading,
  src,
  ...props
}: WebPreviewBodyProps) => {
  const { url } = useWebPreview();

  return (
    <div className="flex-1">
      <iframe
        className={cn('size-full', className)}
        src={(src ?? url) || undefined}
        title="Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        {...props}
      />
      {loading}
    </div>
  );
};

export type WebPreviewConsoleProps = ComponentProps<'div'> & {
  logs?: Array<{
    level: 'log' | 'warn' | 'error';
    message: string;
    timestamp: Date;
  }>;
};

export const WebPreviewConsole = ({
  className,
  logs = [],
  children,
  ...props
}: WebPreviewConsoleProps) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview();

  return (
    <Collapsible
      open={consoleOpen}
      onOpenChange={setConsoleOpen}
      className={cn('border-t bg-muted/50 font-mono text-sm', className)}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50"
        >
          Console
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              consoleOpen && 'rotate-180',
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          'px-4 pb-4',
          'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        )}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No console output</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={`${log.timestamp.getTime()}-${index}`}
                className={cn(
                  'text-xs',
                  log.level === 'error' && 'text-destructive',
                  log.level === 'warn' && 'text-yellow-600',
                  log.level === 'log' && 'text-foreground',
                )}
              >
                <span className="text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>{' '}
                {log.message}
              </div>
            ))
          )}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
