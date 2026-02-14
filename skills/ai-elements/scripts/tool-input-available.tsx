"use client";

import { Tool, ToolContent, ToolHeader, ToolInput } from "@/components/ai-elements/tool";
import { nanoid } from "nanoid";

const toolCall = {
  errorText: undefined,
  input: {
    prompt: "A futuristic cityscape at sunset with flying cars",
    quality: "high",
    resolution: "1024x1024",
    style: "digital_art",
  },
  output: undefined,
  state: "input-available" as const,
  toolCallId: nanoid(),
  type: "tool-image_generation" as const,
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
