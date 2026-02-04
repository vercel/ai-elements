"use client";

import type { ToolUIPart } from "ai";

import { CodeBlock } from "@/components/ai-elements/code-block";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { nanoid } from "nanoid";

const toolCall: ToolUIPart = {
  errorText: undefined,
  input: {
    database: "analytics",
    params: ["2024-01-01"],
    query: "SELECT COUNT(*) FROM users WHERE created_at >= ?",
  },
  output: [
    {
      "Created At": "2024-01-15",
      Email: "john@example.com",
      Name: "John Doe",
      "User ID": 1,
    },
    {
      "Created At": "2024-01-20",
      Email: "jane@example.com",
      Name: "Jane Smith",
      "User ID": 2,
    },
    {
      "Created At": "2024-02-01",
      Email: "bob@example.com",
      Name: "Bob Wilson",
      "User ID": 3,
    },
    {
      "Created At": "2024-02-10",
      Email: "alice@example.com",
      Name: "Alice Brown",
      "User ID": 4,
    },
    {
      "Created At": "2024-02-15",
      Email: "charlie@example.com",
      Name: "Charlie Davis",
      "User ID": 5,
    },
  ],
  state: "output-available" as const,
  toolCallId: nanoid(),
  type: "tool-database_query" as const,
};

const Example = () => (
  <div style={{ height: "500px" }}>
    <Tool>
      <ToolHeader state={toolCall.state} type={toolCall.type} />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        {toolCall.state === "output-available" && (
          <ToolOutput
            errorText={toolCall.errorText}
            output={
              <CodeBlock
                code={JSON.stringify(toolCall.output)}
                language="json"
              />
            }
          />
        )}
      </ToolContent>
    </Tool>
  </div>
);

export default Example;
