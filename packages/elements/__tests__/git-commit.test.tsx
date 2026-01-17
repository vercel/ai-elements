import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  GitCommit,
  GitCommitActions,
  GitCommitCopyButton,
  GitCommitFile,
  GitCommitHeader,
  GitCommitMessage,
} from "../src/git-commit";

const FEAT_REGEX = /feat/i;

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

describe("GitCommit", () => {
  it("renders commit message", () => {
    render(<GitCommit {...mockCommit} />);
    expect(screen.getByText("feat: Add new feature")).toBeInTheDocument();
  });

  it("renders short hash", () => {
    render(<GitCommit {...mockCommit} />);
    expect(screen.getByText("a1b2c3d")).toBeInTheDocument();
  });

  it("renders author initials", () => {
    render(<GitCommit {...mockCommit} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <GitCommit {...mockCommit} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("GitCommitCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("copies hash to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <GitCommit {...mockCommit}>
        <GitCommitHeader>
          <GitCommitMessage />
          <GitCommitActions>
            <GitCommitCopyButton />
          </GitCommitActions>
        </GitCommitHeader>
      </GitCommit>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith(mockCommit.hash);
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <GitCommit {...mockCommit}>
        <GitCommitHeader>
          <GitCommitMessage />
          <GitCommitActions>
            <GitCommitCopyButton onCopy={onCopy} />
          </GitCommitActions>
        </GitCommitHeader>
      </GitCommit>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onCopy).toHaveBeenCalled();
  });
});

describe("GitCommitFile", () => {
  it("renders file path", () => {
    render(
      <GitCommit {...mockCommit}>
        <GitCommitFile path="src/test.ts" status="added" />
      </GitCommit>
    );
    expect(screen.getByText("src/test.ts")).toBeInTheDocument();
  });

  it("renders added status", () => {
    render(
      <GitCommit {...mockCommit}>
        <GitCommitFile path="src/test.ts" status="added" />
      </GitCommit>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders modified status", () => {
    render(
      <GitCommit {...mockCommit}>
        <GitCommitFile path="src/test.ts" status="modified" />
      </GitCommit>
    );
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders deleted status", () => {
    render(
      <GitCommit {...mockCommit}>
        <GitCommitFile path="src/test.ts" status="deleted" />
      </GitCommit>
    );
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders additions and deletions", () => {
    render(
      <GitCommit {...mockCommit}>
        <GitCommitFile
          additions={10}
          deletions={5}
          path="src/test.ts"
          status="modified"
        />
      </GitCommit>
    );
    expect(screen.getByText("+10")).toBeInTheDocument();
    expect(screen.getByText("-5")).toBeInTheDocument();
  });
});

describe("GitCommitFiles", () => {
  it("renders all files from context", async () => {
    const user = userEvent.setup();
    render(<GitCommit {...mockCommit} />);

    // Expand collapsible to show files
    const trigger = screen.getByRole("button", { name: FEAT_REGEX });
    await user.click(trigger);

    expect(screen.getByText("src/index.ts")).toBeInTheDocument();
    expect(screen.getByText("src/utils.ts")).toBeInTheDocument();
  });
});
