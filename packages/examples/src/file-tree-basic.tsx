"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@repo/elements/file-tree";

const Example = () => (
  <FileTree>
    <FileTreeFolder name="src" path="src">
      <FileTreeFile name="index.ts" path="src/index.ts" />
    </FileTreeFolder>
    <FileTreeFile name="package.json" path="package.json" />
  </FileTree>
);

export default Example;
