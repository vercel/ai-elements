"use client";

import {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalCopyButton,
  TerminalHeader,
  TerminalStatus,
  TerminalTitle,
} from "@/components/ai-elements/terminal";
import { useCallback, useEffect, useState } from "react";

const handleTerminalCopy = () => {
  console.log("Copied!");
};

const ansiOutput = `\u001B[32m✓\u001B[0m Compiled successfully in 1.2s

\u001B[1m\u001B[34minfo\u001B[0m  - Collecting page data...
\u001B[1m\u001B[34minfo\u001B[0m  - Generating static pages (0/3)
\u001B[32m✓\u001B[0m Generated static pages (3/3)

\u001B[1m\u001B[33mwarn\u001B[0m  - Using \u001B[1mexperimental\u001B[0m server actions

\u001B[36mRoute (app)\u001B[0m                              \u001B[36mSize\u001B[0m     \u001B[36mFirst Load JS\u001B[0m
\u001B[37m┌ ○ /\u001B[0m                                    \u001B[32m5.2 kB\u001B[0m   \u001B[32m87.3 kB\u001B[0m
\u001B[37m├ ○ /about\u001B[0m                               \u001B[32m2.1 kB\u001B[0m   \u001B[32m84.2 kB\u001B[0m
\u001B[37m└ ○ /contact\u001B[0m                             \u001B[32m3.8 kB\u001B[0m   \u001B[32m85.9 kB\u001B[0m

\u001B[32m✓\u001B[0m Build completed successfully!
\u001B[90mTotal time: 3.45s\u001B[0m
`;

const Example = () => {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < ansiOutput.length) {
        setOutput(ansiOutput.slice(0, index + 10));
        index += 10;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleClear = useCallback(() => {
    setOutput("");
    setIsStreaming(false);
  }, []);

  return (
    <Terminal
      autoScroll={true}
      isStreaming={isStreaming}
      onClear={handleClear}
      output={output}
    >
      <TerminalHeader>
        <TerminalTitle>Build Output</TerminalTitle>
        <div className="flex items-center gap-1">
          <TerminalStatus />
          <TerminalActions>
            <TerminalCopyButton onCopy={handleTerminalCopy} />
            <TerminalClearButton />
          </TerminalActions>
        </div>
      </TerminalHeader>
      <TerminalContent />
    </Terminal>
  );
};

export default Example;
