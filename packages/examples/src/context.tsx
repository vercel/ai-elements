"use client";

import { Context } from "@repo/elements/context";

const Example = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <Context
        maxTokens={272_000}
        modelId="gpt-4o"
        usage={{
          inputTokens: 100,
          outputTokens: 200,
          totalTokens: 300,
          cachedInputTokens: 400,
          reasoningTokens: 500,
        }}
        usedTokens={50_800}
      />
    </div>
  );
};

export default Example;
