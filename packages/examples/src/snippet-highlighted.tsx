"use client";

import { Snippet, SnippetCopyButton } from "@repo/elements/snippet";

const Example = () => (
  <Snippet code="npm install package" language="bash">
    <SnippetCopyButton />
  </Snippet>
);

export default Example;
