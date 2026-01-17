"use client";

import { Badge } from "@repo/shadcn-ui/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
} from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface SchemaParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: "path" | "query" | "header";
}

interface SchemaProperty {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[];
  items?: SchemaProperty;
}

interface SchemaDisplayContextType {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
}

const SchemaDisplayContext = createContext<SchemaDisplayContextType>({
  method: "GET",
  path: "",
});

export type SchemaDisplayProps = HTMLAttributes<HTMLDivElement> & {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
};

export const SchemaDisplay = ({
  method,
  path,
  description,
  parameters,
  requestBody,
  responseBody,
  className,
  children,
  ...props
}: SchemaDisplayProps) => (
  <SchemaDisplayContext.Provider
    value={{ method, path, description, parameters, requestBody, responseBody }}
  >
    <div
      className={cn("rounded-lg border bg-background overflow-hidden", className)}
      {...props}
    >
      {children ?? (
        <>
          <SchemaDisplayHeader>
            <div className="flex items-center gap-3">
              <SchemaDisplayMethod />
              <SchemaDisplayPath />
            </div>
          </SchemaDisplayHeader>
          {description && <SchemaDisplayDescription />}
          <SchemaDisplayContent>
            {parameters && parameters.length > 0 && <SchemaDisplayParameters />}
            {requestBody && requestBody.length > 0 && <SchemaDisplayRequest />}
            {responseBody && responseBody.length > 0 && <SchemaDisplayResponse />}
          </SchemaDisplayContent>
        </>
      )}
    </div>
  </SchemaDisplayContext.Provider>
);

export type SchemaDisplayHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SchemaDisplayHeader = ({
  className,
  children,
  ...props
}: SchemaDisplayHeaderProps) => (
  <div
    className={cn("flex items-center gap-3 border-b px-4 py-3", className)}
    {...props}
  >
    {children}
  </div>
);

const methodStyles: Record<HttpMethod, string> = {
  GET: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PUT: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  PATCH: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export type SchemaDisplayMethodProps = ComponentProps<typeof Badge>;

export const SchemaDisplayMethod = ({
  className,
  children,
  ...props
}: SchemaDisplayMethodProps) => {
  const { method } = useContext(SchemaDisplayContext);

  return (
    <Badge
      variant="secondary"
      className={cn("font-mono text-xs", methodStyles[method], className)}
      {...props}
    >
      {children ?? method}
    </Badge>
  );
};

export type SchemaDisplayPathProps = HTMLAttributes<HTMLSpanElement>;

export const SchemaDisplayPath = ({
  className,
  children,
  ...props
}: SchemaDisplayPathProps) => {
  const { path } = useContext(SchemaDisplayContext);

  // Highlight path parameters
  const highlightedPath = path.replace(
    /\{([^}]+)\}/g,
    '<span class="text-blue-600 dark:text-blue-400">{$1}</span>'
  );

  return (
    <span
      className={cn("font-mono text-sm", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "needed for parameter highlighting"
      dangerouslySetInnerHTML={{ __html: children ?? highlightedPath }}
      {...props}
    />
  );
};

export type SchemaDisplayDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const SchemaDisplayDescription = ({
  className,
  children,
  ...props
}: SchemaDisplayDescriptionProps) => {
  const { description } = useContext(SchemaDisplayContext);

  return (
    <p
      className={cn(
        "border-b px-4 py-3 text-muted-foreground text-sm",
        className
      )}
      {...props}
    >
      {children ?? description}
    </p>
  );
};

export type SchemaDisplayContentProps = HTMLAttributes<HTMLDivElement>;

export const SchemaDisplayContent = ({
  className,
  children,
  ...props
}: SchemaDisplayContentProps) => (
  <div className={cn("divide-y", className)} {...props}>
    {children}
  </div>
);

export type SchemaDisplayParametersProps = ComponentProps<typeof Collapsible>;

export const SchemaDisplayParameters = ({
  className,
  children,
  ...props
}: SchemaDisplayParametersProps) => {
  const { parameters } = useContext(SchemaDisplayContext);

  return (
    <Collapsible defaultOpen className={cn(className)} {...props}>
      <CollapsibleTrigger className="group flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors">
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        <span className="font-medium text-sm">Parameters</span>
        <Badge variant="secondary" className="ml-auto text-xs">
          {parameters?.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t divide-y">
          {children ??
            parameters?.map((param) => (
              <SchemaDisplayParameter key={param.name} {...param} />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type SchemaDisplayParameterProps = HTMLAttributes<HTMLDivElement> &
  SchemaParameter;

export const SchemaDisplayParameter = ({
  name,
  type,
  required,
  description,
  location,
  className,
  ...props
}: SchemaDisplayParameterProps) => (
  <div className={cn("px-4 py-3 pl-10", className)} {...props}>
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{name}</span>
      <Badge variant="outline" className="text-xs">
        {type}
      </Badge>
      {location && (
        <Badge variant="secondary" className="text-xs">
          {location}
        </Badge>
      )}
      {required && (
        <Badge
          variant="secondary"
          className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          required
        </Badge>
      )}
    </div>
    {description && (
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    )}
  </div>
);

export type SchemaDisplayRequestProps = ComponentProps<typeof Collapsible>;

export const SchemaDisplayRequest = ({
  className,
  children,
  ...props
}: SchemaDisplayRequestProps) => {
  const { requestBody } = useContext(SchemaDisplayContext);

  return (
    <Collapsible defaultOpen className={cn(className)} {...props}>
      <CollapsibleTrigger className="group flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors">
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        <span className="font-medium text-sm">Request Body</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t">
          {children ??
            requestBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type SchemaDisplayResponseProps = ComponentProps<typeof Collapsible>;

export const SchemaDisplayResponse = ({
  className,
  children,
  ...props
}: SchemaDisplayResponseProps) => {
  const { responseBody } = useContext(SchemaDisplayContext);

  return (
    <Collapsible defaultOpen className={cn(className)} {...props}>
      <CollapsibleTrigger className="group flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors">
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        <span className="font-medium text-sm">Response</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t">
          {children ??
            responseBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type SchemaDisplayBodyProps = HTMLAttributes<HTMLDivElement>;

export const SchemaDisplayBody = ({
  className,
  children,
  ...props
}: SchemaDisplayBodyProps) => (
  <div className={cn("divide-y", className)} {...props}>
    {children}
  </div>
);

export type SchemaDisplayPropertyProps = HTMLAttributes<HTMLDivElement> &
  SchemaProperty & {
    depth?: number;
  };

export const SchemaDisplayProperty = ({
  name,
  type,
  required,
  description,
  properties,
  items,
  depth = 0,
  className,
  ...props
}: SchemaDisplayPropertyProps) => {
  const hasChildren = properties || items;
  const paddingLeft = 40 + depth * 16;

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={depth < 2}>
        <CollapsibleTrigger
          className={cn(
            "group flex w-full items-center gap-2 py-3 text-left hover:bg-muted/50 transition-colors",
            className
          )}
          style={{ paddingLeft }}
        >
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
          <span className="font-mono text-sm">{name}</span>
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
          {required && (
            <Badge
              variant="secondary"
              className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              required
            </Badge>
          )}
        </CollapsibleTrigger>
        {description && (
          <p
            className="pb-2 text-muted-foreground text-sm"
            style={{ paddingLeft: paddingLeft + 24 }}
          >
            {description}
          </p>
        )}
        <CollapsibleContent>
          <div className="border-t divide-y">
            {properties?.map((prop) => (
              <SchemaDisplayProperty
                key={prop.name}
                {...prop}
                depth={depth + 1}
              />
            ))}
            {items && (
              <SchemaDisplayProperty
                {...items}
                name={`${name}[]`}
                depth={depth + 1}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div
      className={cn("py-3 pr-4", className)}
      style={{ paddingLeft }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="size-4" /> {/* Spacer for alignment */}
        <span className="font-mono text-sm">{name}</span>
        <Badge variant="outline" className="text-xs">
          {type}
        </Badge>
        {required && (
          <Badge
            variant="secondary"
            className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          >
            required
          </Badge>
        )}
      </div>
      {description && (
        <p className="mt-1 pl-6 text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
};

export type SchemaDisplayExampleProps = HTMLAttributes<HTMLPreElement>;

export const SchemaDisplayExample = ({
  className,
  children,
  ...props
}: SchemaDisplayExampleProps) => (
  <pre
    className={cn(
      "mx-4 mb-4 rounded-md bg-muted p-4 font-mono text-sm overflow-auto",
      className
    )}
    {...props}
  >
    {children}
  </pre>
);
