"use client";

import { useState } from "react";
import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
} from "@repo/elements/file-tree";

const Example = () => {
  const [selectedPath, setSelectedPath] = useState<string | undefined>();

  return (
    <FileTree
      defaultExpanded={new Set(["src", "src/components"])}
      selectedPath={selectedPath}
      onSelect={setSelectedPath}
    >
      <FileTreeFolder path="src" name="src">
        <FileTreeFolder path="src/components" name="components">
          <FileTreeFile path="src/components/button.tsx" name="button.tsx" />
          <FileTreeFile path="src/components/input.tsx" name="input.tsx" />
          <FileTreeFile path="src/components/modal.tsx" name="modal.tsx" />
        </FileTreeFolder>
        <FileTreeFolder path="src/hooks" name="hooks">
          <FileTreeFile path="src/hooks/use-auth.ts" name="use-auth.ts" />
          <FileTreeFile path="src/hooks/use-theme.ts" name="use-theme.ts" />
        </FileTreeFolder>
        <FileTreeFolder path="src/lib" name="lib">
          <FileTreeFile path="src/lib/utils.ts" name="utils.ts" />
        </FileTreeFolder>
        <FileTreeFile path="src/app.tsx" name="app.tsx" />
        <FileTreeFile path="src/main.tsx" name="main.tsx" />
      </FileTreeFolder>
      <FileTreeFile path="package.json" name="package.json" />
      <FileTreeFile path="tsconfig.json" name="tsconfig.json" />
      <FileTreeFile path="README.md" name="README.md" />
    </FileTree>
  );
};

export default Example;
