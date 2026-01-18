"use client";

import { useState } from "react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@repo/elements/file-tree";

const Example = () => {
  const [selectedPath, setSelectedPath] = useState<string>();

  return (
    <FileTree selectedPath={selectedPath} onSelect={setSelectedPath}>
      <FileTreeFolder path="src" name="src">
        <FileTreeFile path="src/app.tsx" name="app.tsx" />
        <FileTreeFile path="src/index.ts" name="index.ts" />
      </FileTreeFolder>
      <FileTreeFile path="package.json" name="package.json" />
    </FileTree>
  );
};

export default Example;
