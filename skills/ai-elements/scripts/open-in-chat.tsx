"use client";

import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from "@/components/ai-elements/open-in-chat";

const Example = () => {
  const sampleQuery = "How can I implement authentication in Next.js?";

  return (
    <OpenIn>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInChatGPT query={sampleQuery} />
        <OpenInClaude query={sampleQuery} />
        <OpenInCursor query={sampleQuery} />
        <OpenInT3 query={sampleQuery} />
        <OpenInScira query={sampleQuery} />
        <OpenInv0 query={sampleQuery} />
      </OpenInContent>
    </OpenIn>
  );
};

export default Example;
