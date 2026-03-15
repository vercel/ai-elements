"use client";

import type { ReactNode } from "react";
import { Tool, ToolContent, ToolHeader, ToolInput } from "@repo/elements/tool";
import { DatabaseIcon, GlobeIcon, SearchIcon } from "lucide-react";
import type { LucideProps } from "lucide-react";

const toolIcons: Record<string, (props: LucideProps) => ReactNode> = {
  database_query: DatabaseIcon,
  web_search: SearchIcon,
  browse_url: GlobeIcon,
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
        icon={({ className }) => (
          <SearchIcon className={`${className} text-blue-500`} />
        )}
        state="output-available"
        title="custom_search"
        type="tool-custom_search"
      />
      <ToolContent>
        <ToolInput input={{ query: "custom styled icon" }} />
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
