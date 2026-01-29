import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Commit,
  CommitActions,
  CommitContent,
  CommitCopyButton,
  CommitFile,
  CommitFileAdditions,
  CommitFileChanges,
  CommitFileDeletions,
  CommitFileInfo,
  CommitFilePath,
  CommitFileStatus,
  CommitFiles,
  CommitHeader,
  CommitInfo,
  CommitMessage,
} from "../src/commit";

const mockCommit = {
  hash: "a1b2c3d4e5f6g7h8i9j0",
  message: "feat: Add new feature",
  author: "John Doe",
  timestamp: new Date("2024-01-15T10:00:00Z"),
  files: [
    {
      path: "src/index.ts",
      status: "added" as const,
      additions: 10,
      deletions: 0,
    },
    {
      path: "src/utils.ts",
      status: "modified" as const,
      additions: 5,
      deletions: 3,
    },
  ],
};

describe("Commit", () => {
  it("renders commit message", () => {
    render(
      <Commit>
        <CommitHeader>
          <CommitInfo>
            <CommitMessage>{mockCommit.message}</CommitMessage>
          </CommitInfo>
        </CommitHeader>
      </Commit>
    );
    expect(screen.getByText("feat: Add new feature")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Commit>Test Content</Commit>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Commit className="custom-class">Test</Commit>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("CommitCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("copies hash to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <Commit>
        <CommitActions>
          <CommitCopyButton hash={mockCommit.hash} />
        </CommitActions>
      </Commit>
    );

    const copyButton = screen.getByRole("button");
    await user.click(copyButton);

    expect(writeTextSpy).toHaveBeenCalledWith(mockCommit.hash);
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <Commit>
        <CommitActions>
          <CommitCopyButton hash={mockCommit.hash} onCopy={onCopy} />
        </CommitActions>
      </Commit>
    );

    const copyButton = screen.getByRole("button");
    await user.click(copyButton);

    expect(onCopy).toHaveBeenCalled();
  });
});

describe("CommitFile", () => {
  it("renders file path", () => {
    render(
      <CommitFile>
        <CommitFileInfo>
          <CommitFilePath>src/test.ts</CommitFilePath>
        </CommitFileInfo>
      </CommitFile>
    );
    expect(screen.getByText("src/test.ts")).toBeInTheDocument();
  });

  it("renders added status", () => {
    render(
      <CommitFile>
        <CommitFileInfo>
          <CommitFileStatus status="added" />
        </CommitFileInfo>
      </CommitFile>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders modified status", () => {
    render(
      <CommitFile>
        <CommitFileInfo>
          <CommitFileStatus status="modified" />
        </CommitFileInfo>
      </CommitFile>
    );
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders deleted status", () => {
    render(
      <CommitFile>
        <CommitFileInfo>
          <CommitFileStatus status="deleted" />
        </CommitFileInfo>
      </CommitFile>
    );
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders additions and deletions", () => {
    render(
      <CommitFile>
        <CommitFileChanges>
          <CommitFileAdditions count={10} />
          <CommitFileDeletions count={5} />
        </CommitFileChanges>
      </CommitFile>
    );
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

describe("CommitFiles", () => {
  it("renders all files", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Commit>
        <CommitHeader>
          <CommitMessage>{mockCommit.message}</CommitMessage>
        </CommitHeader>
        <CommitContent>
          <CommitFiles>
            {mockCommit.files.map((file) => (
              <CommitFile key={file.path}>
                <CommitFileInfo>
                  <CommitFileStatus status={file.status} />
                  <CommitFilePath>{file.path}</CommitFilePath>
                </CommitFileInfo>
              </CommitFile>
            ))}
          </CommitFiles>
        </CommitContent>
      </Commit>
    );

    // Expand collapsible to show files
    const trigger = container.querySelector(
      "[data-slot='collapsible-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    await user.click(trigger as Element);

    expect(screen.getByText("src/index.ts")).toBeInTheDocument();
    expect(screen.getByText("src/utils.ts")).toBeInTheDocument();
  });
});
