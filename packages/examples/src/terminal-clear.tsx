"use client";

import { Terminal } from "@repo/elements/terminal";
import { useState } from "react";

const initialOutput = `\u001B[36m$\u001B[0m npm run build
Building project...
\u001B[32m✓\u001B[0m Compiled successfully
\u001B[32m✓\u001B[0m Bundle size: 124kb`;

const Example = () => {
  const [output, setOutput] = useState(initialOutput);

  return <Terminal onClear={() => setOutput("")} output={output} />;
};

export default Example;
