"use client";

import { Tool, ToolContent, ToolHeader, ToolInput } from "@/components/ai-elements/tool";
import { nanoid } from "nanoid";

const toolCall = {
  errorText: undefined,
  input: {
    include_snippets: true,
    max_results: 10,
    query: "latest AI market trends 2024",
  },
  output: undefined,
  state: "input-streaming" as const,
  toolCallId: nanoid(),
  type: "tool-web_search" as const,
};

const Example = () => (
  <div style={{ height: "500px" }}>
    <Tool>
      <ToolHeader state={toolCall.state} type={toolCall.type} />
      <ToolContent>
        <ToolInput input={toolCall.input} />
      </ToolContent>
    </Tool>
  </div>
);

export default Example;
