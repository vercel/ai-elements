"use client";

import { useState } from "react";
import { Terminal } from "@repo/elements/terminal";

const initialOutput = `\x1b[36m$\x1b[0m npm run build
Building project...
\x1b[32m✓\x1b[0m Compiled successfully
\x1b[32m✓\x1b[0m Bundle size: 124kb`;

const Example = () => {
  const [output, setOutput] = useState(initialOutput);

  return <Terminal output={output} onClear={() => setOutput("")} />;
};

export default Example;
