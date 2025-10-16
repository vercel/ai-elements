"use client";

import {
  CodeBlock,
  CodeBlockCollapsibleButton,
  CodeBlockCopyButton,
  CodeBlockWrapButton,
} from "@repo/elements/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const Example = () => (
  <CodeBlock code={code} language="jsx">
    <CodeBlockCollapsibleButton linesToShow={8} />
    <CodeBlockWrapButton
      onToggle={(wrapped) => console.log("Wrap toggled:", wrapped)}
    />
    <CodeBlockCopyButton
      onCopy={() => console.log("Copied code to clipboard")}
      onError={() => console.error("Failed to copy code to clipboard")}
    />
  </CodeBlock>
);

export default Example;
