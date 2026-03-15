"use client";

import type { ComponentProps, ReactNode } from "react";
import { Tool, ToolContent, ToolHeader, ToolInput } from "@repo/elements/tool";

type SvgProps = ComponentProps<"svg">;

const DatabaseIcon = (props: SvgProps) => (
  <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
    <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
  </svg>
);

const SearchIcon = (props: SvgProps) => (
  <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const toolIcons: Record<string, (props: SvgProps) => ReactNode> = {
  database_query: DatabaseIcon,
  web_search: SearchIcon,
};

const renderIcon = ({ toolName, className }: { toolName: string; className: string }) => {
  const Icon = toolIcons[toolName];
  return Icon ? <Icon className={className} /> : null;
};

const Example = () => (
  <div className="space-y-4">
    <Tool>
      <ToolHeader
        icon={({ className }) => <DatabaseIcon className={className} />}
        state="output-available"
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput
          input={{
            query: "SELECT COUNT(*) FROM users WHERE created_at >= ?",
            params: ["2024-01-01"],
          }}
        />
      </ToolContent>
    </Tool>
    <Tool>
      <ToolHeader
        icon={renderIcon}
        state="output-available"
        title="web_search"
        type="tool-web_search"
      />
      <ToolContent>
        <ToolInput input={{ query: "latest AI news" }} />
      </ToolContent>
    </Tool>
    <Tool>
      <ToolHeader
        icon={renderIcon}
        state="output-available"
        title="unknown_tool"
        type="tool-unknown_tool"
      />
      <ToolContent>
        <ToolInput input={{ foo: "bar" }} />
      </ToolContent>
    </Tool>
  </div>
);

export default Example;
