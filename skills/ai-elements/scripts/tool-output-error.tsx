"use client";

import type { ToolUIPart } from "ai";

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

const toolCall: ToolUIPart = {
  errorText:
    "Connection timeout: The request took longer than 5000ms to complete. Please check your network connection and try again.",
  input: {
    headers: {
      Authorization: "Bearer token123",
      "Content-Type": "application/json",
    },
    method: "GET",
    timeout: 5000,
    url: "https://api.example.com/data",
  },
  output: undefined,
  state: "output-error" as const,
  toolCallId: "api_request_1",
  type: "tool-api_request" as const,
};

const Example = () => (
  <div style={{ height: "500px" }}>
    <Tool>
      <ToolHeader state={toolCall.state} type={toolCall.type} />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        {toolCall.state === "output-error" && (
          <ToolOutput errorText={toolCall.errorText} output={toolCall.output} />
        )}
      </ToolContent>
    </Tool>
  </div>
);

export default Example;
