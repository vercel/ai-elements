"use client";

import {
  Commit,
  CommitActions,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitContent,
  CommitCopyButton,
  CommitFile,
  CommitFileAdditions,
  CommitFileChanges,
  CommitFileDeletions,
  CommitFileIcon,
  CommitFileInfo,
  CommitFilePath,
  CommitFileStatus,
  CommitFiles,
  CommitHash,
  CommitHeader,
  CommitInfo,
  CommitMessage,
  CommitMetadata,
  CommitSeparator,
  CommitTimestamp,
} from "@/components/ai-elements/commit";

const handleCopy = () => {
  console.log("Copied hash!");
};

const hash = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0";
const timestamp = new Date(Date.now() - 1000 * 60 * 60 * 2);

const files = [
  {
    additions: 150,
    deletions: 0,
    path: "src/auth/login.tsx",
    status: "added" as const,
  },
  {
    additions: 45,
    deletions: 0,
    path: "src/auth/logout.tsx",
    status: "added" as const,
  },
  {
    additions: 23,
    deletions: 8,
    path: "src/lib/session.ts",
    status: "modified" as const,
  },
];

const Example = () => (
  <Commit>
    <CommitHeader>
      <CommitAuthor>
        <CommitAuthorAvatar initials="HB" />
      </CommitAuthor>
      <CommitInfo>
        <CommitMessage>feat: Add user authentication flow</CommitMessage>
        <CommitMetadata>
          <CommitHash>{hash.slice(0, 7)}</CommitHash>
          <CommitSeparator />
          <CommitTimestamp date={timestamp} />
        </CommitMetadata>
      </CommitInfo>
      <CommitActions>
        <CommitCopyButton hash={hash} onCopy={handleCopy} />
      </CommitActions>
    </CommitHeader>
    <CommitContent>
      <CommitFiles>
        {files.map((file) => (
          <CommitFile key={file.path}>
            <CommitFileInfo>
              <CommitFileStatus status={file.status} />
              <CommitFileIcon />
              <CommitFilePath>{file.path}</CommitFilePath>
            </CommitFileInfo>
            <CommitFileChanges>
              <CommitFileAdditions count={file.additions} />
              <CommitFileDeletions count={file.deletions} />
            </CommitFileChanges>
          </CommitFile>
        ))}
      </CommitFiles>
    </CommitContent>
  </Commit>
);

export default Example;
