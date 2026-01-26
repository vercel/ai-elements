"use client";

import { Terminal } from "@/components/ai-elements/terminal";
import { useEffect, useState } from "react";

const lines = [
  "\x1b[36m$\x1b[0m npm install",
  "Installing dependencies...",
  "\x1b[32m✓\x1b[0m react@19.0.0",
  "\x1b[32m✓\x1b[0m typescript@5.0.0",
  "\x1b[32m✓\x1b[0m vite@5.0.0",
  "",
  "\x1b[32mDone!\x1b[0m Installed 3 packages in 1.2s",
];

const Example = () => {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        setOutput((prev) => prev + (prev ? "\n" : "") + lines[lineIndex]);
        lineIndex++;
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
