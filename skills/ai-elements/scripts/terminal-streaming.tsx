"use client";

import { Terminal } from "@/components/ai-elements/terminal";
import { useEffect, useState } from "react";

const lines = [
  "\u001B[36m$\u001B[0m npm install",
  "Installing dependencies...",
  "\u001B[32m✓\u001B[0m react@19.0.0",
  "\u001B[32m✓\u001B[0m typescript@5.0.0",
  "\u001B[32m✓\u001B[0m vite@5.0.0",
  "",
  "\u001B[32mDone!\u001B[0m Installed 3 packages in 1.2s",
];

const Example = () => {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        setOutput((prev) => prev + (prev ? "\n" : "") + lines[lineIndex]);
        lineIndex += 1;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <Terminal autoScroll isStreaming={isStreaming} output={output} />;
};

export default Example;
