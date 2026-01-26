"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";
import { useState } from "react";

const Example = () => {
  const [selectedPath, setSelectedPath] = useState<string | undefined>();

  return (
    <FileTree
      defaultExpanded={new Set(["src", "src/components"])}
      onSelect={setSelectedPath}
      selectedPath={selectedPath}
    >
      <FileTreeFolder name="src" path="src">
        <FileTreeFolder name="components" path="src/components">
          <FileTreeFile name="button.tsx" path="src/components/button.tsx" />
          <FileTreeFile name="input.tsx" path="src/components/input.tsx" />
          <FileTreeFile name="modal.tsx" path="src/components/modal.tsx" />
        </FileTreeFolder>
        <FileTreeFolder name="hooks" path="src/hooks">
          <FileTreeFile name="use-auth.ts" path="src/hooks/use-auth.ts" />
          <FileTreeFile name="use-theme.ts" path="src/hooks/use-theme.ts" />
        </FileTreeFolder>
        <FileTreeFolder name="lib" path="src/lib">
          <FileTreeFile name="utils.ts" path="src/lib/utils.ts" />
        </FileTreeFolder>
        <FileTreeFile name="app.tsx" path="src/app.tsx" />
        <FileTreeFile name="main.tsx" path="src/main.tsx" />
      </FileTreeFolder>
      <FileTreeFile name="package.json" path="package.json" />
      <FileTreeFile name="tsconfig.json" path="tsconfig.json" />
      <FileTreeFile name="README.md" path="README.md" />
    </FileTree>
  );
};

export default Example;
