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
} from "@repo/elements/open-in-chat";

const Example = () => {
  const sampleQuery = "How can I implement authentication in Next.js?";

  return (
    <OpenIn query={sampleQuery}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInCursor />
        <OpenInT3 />
        <OpenInScira />
        <OpenInv0 />
      </OpenInContent>
    </OpenIn>
  );
};

export default Example;
