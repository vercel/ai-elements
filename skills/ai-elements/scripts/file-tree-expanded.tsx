"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";

const Example = () => (
  <FileTree defaultExpanded={new Set(["src", "src/components"])}>
    <FileTreeFolder name="src" path="src">
      <FileTreeFolder name="components" path="src/components">
        <FileTreeFile name="button.tsx" path="src/components/button.tsx" />
        <FileTreeFile name="input.tsx" path="src/components/input.tsx" />
      </FileTreeFolder>
      <FileTreeFile name="index.ts" path="src/index.ts" />
    </FileTreeFolder>
  </FileTree>
);

export default Example;
