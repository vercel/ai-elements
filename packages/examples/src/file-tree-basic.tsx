"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@repo/elements/file-tree";

const Example = () => (
  <FileTree>
    <FileTreeFolder path="src" name="src">
      <FileTreeFile path="src/index.ts" name="index.ts" />
    </FileTreeFolder>
    <FileTreeFile path="package.json" name="package.json" />
  </FileTree>
);

export default Example;
