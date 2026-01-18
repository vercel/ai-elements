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

const commits = [
  {
    hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    message: "feat: Add user authentication flow",
    author: "John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    files: [
      {
        path: "src/auth/login.tsx",
        status: "added" as const,
        additions: 150,
        deletions: 0,
      },
      {
        path: "src/auth/logout.tsx",
        status: "added" as const,
        additions: 45,
        deletions: 0,
      },
      {
        path: "src/lib/session.ts",
        status: "modified" as const,
        additions: 23,
        deletions: 8,
      },
    ],
  },
  {
    hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
    message: "fix: Resolve memory leak in useEffect",
    author: "Jane Smith",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    files: [
      {
        path: "src/hooks/useData.ts",
        status: "modified" as const,
        additions: 5,
        deletions: 12,
      },
    ],
  },
  {
    hash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
    message: "refactor: Rename config files",
    author: "Bob Wilson",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    files: [
      { path: "config/old-settings.json", status: "deleted" as const },
      { path: "config/settings.json", status: "added" as const },
    ],
  },
];

const Example = () => (
  <div className="flex flex-col gap-4">
    {commits.map((commit) => (
      <Commit
        author={commit.author}
        files={commit.files}
        hash={commit.hash}
        key={commit.hash}
        message={commit.message}
        timestamp={commit.timestamp}
      >
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
            <CommitCopyButton onCopy={() => console.log("Copied hash!")} />
          </CommitActions>
        </CommitHeader>
        <CommitContent>
          <CommitFiles />
        </CommitContent>
      </Commit>
    ))}
  </div>
);

export default Example;
