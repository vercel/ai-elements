"use client";

import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@/components/ai-elements/agent";
import { z } from "zod";

const webSearchTool = {
  description: "Search the web for information",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
};

const readUrlTool = {
  description: "Read and parse a URL",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to read"),
  }),
};

const summarizeTool = {
  description: "Summarize text into key points",
  inputSchema: z.object({
    maxPoints: z.number().optional().describe("Maximum number of key points"),
    text: z.string().describe("The text to summarize"),
  }),
};

const outputSchema = `z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  score: z.number(),
  summary: z.string(),
})`;

const Example = () => (
  <Agent>
    <AgentHeader model="openai/gpt-5.2-pro" name="Research Assistant" />
    <AgentContent>
      <AgentInstructions>
        You are a helpful research assistant. Your job is to search the web for
        information and summarize findings for the user. Always cite your
        sources and provide accurate, up-to-date information.
      </AgentInstructions>
      <AgentTools type="multiple">
        <AgentTool tool={webSearchTool} value="web_search" />
        <AgentTool tool={readUrlTool} value="read_url" />
        <AgentTool tool={summarizeTool} value="summarize" />
      </AgentTools>
      <AgentOutput schema={outputSchema} />
    </AgentContent>
  </Agent>
);

export default Example;
