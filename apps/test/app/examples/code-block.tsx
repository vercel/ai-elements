"use client";

import {
  CodeBlock,
  CodeBlockCollapsibleButton,
  CodeBlockCopyButton,
  CodeBlockWrapButton,
} from "@repo/elements/code-block";

const code = `import { Experimental_Agent as Agent, tool } from "ai";
import { z } from "zod";

const codeAgent = new Agent({
  model: "openai/gpt-5-codex",
  system:
    "You are an expert in code performance optimization, specializing in Python. Your primary goal is to thoroughly analyze provided code snippets to identify and diagnose issues like performance bottlenecks, memory leaks, inefficient algorithms, redundant computations, and scalability problems.",
  tools: {
    runCode: tool({
      description: "Execute Python code",
      inputSchema: z.object({
        code: z.string(),
      }),
      execute: async ({ code }) => {
        // Execute code and return result
        return { output: "Code executed successfully" };
      },
    }),
  },
});
`;

const Example = () => (
  <CodeBlock
    code={code}
    collapsible={{ defaultCollapsed: true, linesToShow: 8 }}
    language="jsx"
  >
    <CodeBlockCollapsibleButton />
    <CodeBlockWrapButton
      onToggle={(wrapped) => console.log("Wrap toggled:", wrapped)}
    />
    <CodeBlockCopyButton
      onCopy={() => console.log("Copied code to clipboard")}
      onError={() => console.error("Failed to copy code to clipboard")}
    />
  </CodeBlock>
);

export default Example;
