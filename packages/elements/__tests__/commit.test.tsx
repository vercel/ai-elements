import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Commit,
  CommitActions,
  CommitCopyButton,
  CommitFile,
  CommitHeader,
  CommitMessage,
} from "../src/commit";

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

describe("Commit", () => {
  it("renders commit message", () => {
    render(<Commit {...mockCommit} />);
    expect(screen.getByText("feat: Add new feature")).toBeInTheDocument();
  });

  it("renders short hash", () => {
    render(<Commit {...mockCommit} />);
    expect(screen.getByText("a1b2c3d")).toBeInTheDocument();
  });

  it("renders author initials", () => {
    render(<Commit {...mockCommit} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Commit {...mockCommit} className="custom-class" />
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
      <Commit {...mockCommit}>
        <div className="flex items-center justify-between gap-4 p-4">
          <CommitHeader>
            <CommitMessage />
          </CommitHeader>
          <CommitActions>
            <CommitCopyButton />
          </CommitActions>
        </div>
      </Commit>
    );

    const buttons = screen.getAllByRole("button");
    const copyButton = buttons.find(
      (btn) => btn.getAttribute("data-slot") === "button"
    );
    if (copyButton) {
      await user.click(copyButton);
    }

    expect(writeTextSpy).toHaveBeenCalledWith(mockCommit.hash);
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <Commit {...mockCommit}>
        <div className="flex items-center justify-between gap-4 p-4">
          <CommitHeader>
            <CommitMessage />
          </CommitHeader>
          <CommitActions>
            <CommitCopyButton onCopy={onCopy} />
          </CommitActions>
        </div>
      </Commit>
    );

    const buttons = screen.getAllByRole("button");
    const copyButton = buttons.find(
      (btn) => btn.getAttribute("data-slot") === "button"
    );
    if (copyButton) {
      await user.click(copyButton);
    }

    expect(onCopy).toHaveBeenCalled();
  });
});

describe("CommitFile", () => {
  it("renders file path", () => {
    render(
      <Commit {...mockCommit}>
        <CommitFile path="src/test.ts" status="added" />
      </Commit>
    );
    expect(screen.getByText("src/test.ts")).toBeInTheDocument();
  });

  it("renders added status", () => {
    render(
      <Commit {...mockCommit}>
        <CommitFile path="src/test.ts" status="added" />
      </Commit>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders modified status", () => {
    render(
      <Commit {...mockCommit}>
        <CommitFile path="src/test.ts" status="modified" />
      </Commit>
    );
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders deleted status", () => {
    render(
      <Commit {...mockCommit}>
        <CommitFile path="src/test.ts" status="deleted" />
      </Commit>
    );
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders additions and deletions", () => {
    render(
      <Commit {...mockCommit}>
        <CommitFile
          additions={10}
          deletions={5}
          path="src/test.ts"
          status="modified"
        />
      </Commit>
    );
    expect(screen.getByText("+10")).toBeInTheDocument();
    expect(screen.getByText("-5")).toBeInTheDocument();
  });
});

describe("CommitFiles", () => {
  it("renders all files from context", async () => {
    const user = userEvent.setup();
    render(<Commit {...mockCommit} />);

    // Expand collapsible to show files
    const trigger = screen.getByRole("button", { name: FEAT_REGEX });
    await user.click(trigger);

    expect(screen.getByText("src/index.ts")).toBeInTheDocument();
    expect(screen.getByText("src/utils.ts")).toBeInTheDocument();
  });
});
