"use client";

import {
  Diff,
  DiffActions,
  DiffContent,
  DiffCopyButton,
  DiffHeader,
  DiffStats,
  DiffTitle,
} from "@repo/elements/diff";

const oldFile = {
  name: "config.ts",
  content: `export const debug = false;
export const apiUrl = "https://api.example.com";`,
};

const newFile = {
  name: "config.ts",
  content: `export const debug = true;
export const apiUrl = "https://api.example.com";
export const verbose = true;`,
};

const Example = () => (
  <Diff mode="files" oldFile={oldFile} newFile={newFile}>
    <DiffHeader>
      <div className="flex items-center gap-2">
        <DiffTitle />
        <DiffStats />
      </div>
      <DiffActions>
        <DiffCopyButton
          onCopy={() => console.log("Copied diff to clipboard")}
          onError={() => console.error("Failed to copy diff to clipboard")}
        />
      </DiffActions>
    </DiffHeader>
    <DiffContent />
  </Diff>
);

export default Example;
