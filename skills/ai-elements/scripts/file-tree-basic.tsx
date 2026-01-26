"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";

const Example = () => (
  <FileTree>
    <FileTreeFolder name="src" path="src">
      <FileTreeFile name="index.ts" path="src/index.ts" />
    </FileTreeFolder>
    <FileTreeFile name="package.json" path="package.json" />
  </FileTree>
);

export default Example;
