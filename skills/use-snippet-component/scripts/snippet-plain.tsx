"use client";

import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
} from "@/components/ai-elements/snippet";

const Example = () => (
  <Snippet code="git clone https://github.com/user/repo">
    <SnippetInput />
    <SnippetAddon align="inline-end">
      <SnippetCopyButton />
    </SnippetAddon>
  </Snippet>
);

export default Example;
