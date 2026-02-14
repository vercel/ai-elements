"use client";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import { FileIcon } from "lucide-react";

const handleCopy = () => {
  console.log("Copied code to clipboard");
};

const handleCopyError = () => {
  console.error("Failed to copy code to clipboard");
};

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const Example = () => (
  <div className="dark">
    <CodeBlock code={code} language="jsx">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <FileIcon size={14} />
          <CodeBlockFilename>MyComponent.jsx</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton onCopy={handleCopy} onError={handleCopyError} />
        </CodeBlockActions>
      </CodeBlockHeader>
    </CodeBlock>
  </div>
);

export default Example;
