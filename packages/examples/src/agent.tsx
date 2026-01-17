"use client";

import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@repo/elements/agent";

const outputSchema = `z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  score: z.number(),
  summary: z.string(),
})`;

const Example = () => (
  <div className="space-y-4" style={{ minHeight: "500px" }}>
    {/* Research Assistant Agent */}
    <Agent defaultOpen>
      <AgentHeader name="Research Assistant" model="anthropic/claude-sonnet-4-5" />
      <AgentContent>
        <AgentInstructions>
          You are a helpful research assistant. Your job is to search the web
          for information and summarize findings for the user. Always cite your
          sources and provide accurate, up-to-date information.
        </AgentInstructions>
        <AgentTools>
          <AgentTool
            name="web_search"
            description="Search the web for information"
          />
          <AgentTool name="read_url" description="Read and parse a URL" />
          <AgentTool
            name="summarize"
            description="Summarize text into key points"
          />
        </AgentTools>
      </AgentContent>
    </Agent>

    {/* Analysis Agent with Output Schema */}
    <Agent defaultOpen>
      <AgentHeader name="Sentiment Analyzer" model="anthropic/claude-sonnet-4-5" />
      <AgentContent>
        <AgentInstructions>
          Analyze the sentiment of the provided text and return a structured
          analysis with sentiment classification, confidence score, and summary.
        </AgentInstructions>
        <AgentOutput schema={outputSchema} />
      </AgentContent>
    </Agent>

    {/* Code Assistant Agent */}
    <Agent>
      <AgentHeader name="Code Assistant" model="openai/gpt-4o" />
      <AgentContent>
        <AgentInstructions>
          You help users write, review, and debug code. You can read files,
          write code, and run tests to verify your changes work correctly.
        </AgentInstructions>
        <AgentTools>
          <AgentTool name="read_file" description="Read a file from disk" />
          <AgentTool name="write_file" description="Write content to a file" />
          <AgentTool name="run_tests" description="Execute test suite" />
        </AgentTools>
      </AgentContent>
    </Agent>
  </div>
);

export default Example;
