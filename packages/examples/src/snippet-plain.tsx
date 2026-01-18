"use client";

import { Snippet, SnippetCopyButton } from "@repo/elements/snippet";

const Example = () => (
  <Snippet code="git clone https://github.com/user/repo">
    <SnippetCopyButton />
  </Snippet>
);

export default Example;
