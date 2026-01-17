"use client";

import { Snippet, SnippetCopyButton } from "@repo/elements/snippet";

const Example = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <span>Run</span>
      <Snippet code="npm install @repo/elements" language="bash">
        <SnippetCopyButton />
      </Snippet>
      <span>to install.</span>
    </div>

    <div>
      <span>Use the </span>
      <Snippet code="useState" inline />
      <span> hook for state management.</span>
    </div>

    <Snippet code="git clone https://github.com/example/repo.git">
      <SnippetCopyButton
        onCopy={() => console.log("Copied!")}
        onError={(error) => console.error(error)}
      />
    </Snippet>
  </div>
);

export default Example;
