"use client";

import { Terminal } from "@/components/ai-elements/terminal";
import { useCallback, useState } from "react";

const initialOutput = `\u001B[36m$\u001B[0m npm run build
Building project...
\u001B[32m✓\u001B[0m Compiled successfully
\u001B[32m✓\u001B[0m Bundle size: 124kb`;

const Example = () => {
  const [output, setOutput] = useState(initialOutput);

  const handleClear = useCallback(() => setOutput(""), []);

  return <Terminal onClear={handleClear} output={output} />;
};

export default Example;
