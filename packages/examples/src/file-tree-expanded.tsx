"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@repo/elements/file-tree";

const Example = () => (
  <FileTree defaultExpanded={new Set(["src", "src/components"])}>
    <FileTreeFolder path="src" name="src">
      <FileTreeFolder path="src/components" name="components">
        <FileTreeFile path="src/components/button.tsx" name="button.tsx" />
        <FileTreeFile path="src/components/input.tsx" name="input.tsx" />
      </FileTreeFolder>
      <FileTreeFile path="src/index.ts" name="index.ts" />
    </FileTreeFolder>
  </FileTree>
);

export default Example;
