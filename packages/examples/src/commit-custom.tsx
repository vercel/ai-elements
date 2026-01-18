"use client";

import {
  Commit,
  CommitActions,
  CommitAuthor,
  CommitContent,
  CommitCopyButton,
  CommitFiles,
  CommitHash,
  CommitHeader,
  CommitMessage,
  CommitTimestamp,
} from "@repo/elements/commit";

const commit = {
  hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  message: "feat: Add user authentication flow",
  author: "Jane Smith",
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  files: [
    { path: "src/auth/login.tsx", status: "added" as const, additions: 150 },
    { path: "src/lib/session.ts", status: "modified" as const, additions: 23, deletions: 8 },
  ],
};

const Example = () => (
  <Commit {...commit}>
    <CommitHeader>
      <div className="flex items-center gap-3">
        <CommitAuthor />
        <div className="flex flex-col">
          <CommitMessage />
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <CommitHash />
            <span>•</span>
            <CommitTimestamp />
          </div>
        </div>
      </div>
      <CommitActions>
        <CommitCopyButton />
      </CommitActions>
    </CommitHeader>
    <CommitContent>
      <CommitFiles />
    </CommitContent>
  </Commit>
);

export default Example;
