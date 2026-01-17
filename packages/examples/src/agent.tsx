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
      <AgentHeader
        model="anthropic/claude-sonnet-4-5"
        name="Research Assistant"
      />
      <AgentContent>
        <AgentInstructions>
          You are a helpful research assistant. Your job is to search the web
          for information and summarize findings for the user. Always cite your
          sources and provide accurate, up-to-date information.
        </AgentInstructions>
        <AgentTools>
          <AgentTool
            description="Search the web for information"
            name="web_search"
          />
          <AgentTool description="Read and parse a URL" name="read_url" />
          <AgentTool
            description="Summarize text into key points"
            name="summarize"
          />
        </AgentTools>
      </AgentContent>
    </Agent>

    {/* Analysis Agent with Output Schema */}
    <Agent defaultOpen>
      <AgentHeader
        model="anthropic/claude-sonnet-4-5"
        name="Sentiment Analyzer"
      />
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
      <AgentHeader model="openai/gpt-4o" name="Code Assistant" />
      <AgentContent>
        <AgentInstructions>
          You help users write, review, and debug code. You can read files,
          write code, and run tests to verify your changes work correctly.
        </AgentInstructions>
        <AgentTools>
          <AgentTool description="Read a file from disk" name="read_file" />
          <AgentTool description="Write content to a file" name="write_file" />
          <AgentTool description="Execute test suite" name="run_tests" />
        </AgentTools>
      </AgentContent>
    </Agent>
  </div>
);

export default Example;
