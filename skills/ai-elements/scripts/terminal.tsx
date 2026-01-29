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
import { useEffect, useState } from "react";

const ansiOutput = `\x1b[32m✓\x1b[0m Compiled successfully in 1.2s

\x1b[1m\x1b[34minfo\x1b[0m  - Collecting page data...
\x1b[1m\x1b[34minfo\x1b[0m  - Generating static pages (0/3)
\x1b[32m✓\x1b[0m Generated static pages (3/3)

\x1b[1m\x1b[33mwarn\x1b[0m  - Using \x1b[1mexperimental\x1b[0m server actions

\x1b[36mRoute (app)\x1b[0m                              \x1b[36mSize\x1b[0m     \x1b[36mFirst Load JS\x1b[0m
\x1b[37m┌ ○ /\x1b[0m                                    \x1b[32m5.2 kB\x1b[0m   \x1b[32m87.3 kB\x1b[0m
\x1b[37m├ ○ /about\x1b[0m                               \x1b[32m2.1 kB\x1b[0m   \x1b[32m84.2 kB\x1b[0m
\x1b[37m└ ○ /contact\x1b[0m                             \x1b[32m3.8 kB\x1b[0m   \x1b[32m85.9 kB\x1b[0m

\x1b[32m✓\x1b[0m Build completed successfully!
\x1b[90mTotal time: 3.45s\x1b[0m
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

  const handleClear = () => {
    setOutput("");
    setIsStreaming(false);
  };

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
            <TerminalCopyButton onCopy={() => console.log("Copied!")} />
            <TerminalClearButton />
          </TerminalActions>
        </div>
      </TerminalHeader>
      <TerminalContent />
    </Terminal>
  );
};

export default Example;
