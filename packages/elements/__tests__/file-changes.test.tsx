import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  FileChanges,
  FileChangesAcceptButton,
  FileChangesActions,
  FileChangesContent,
  FileChangesCopyButton,
  FileChangesExpandButton,
  FileChangesHeader,
  FileChangesIcon,
  FileChangesMoreButton,
  FileChangesRejectButton,
  FileChangesStats,
  FileChangesTitle,
} from "../src/file-changes";

vi.mock("@pierre/diffs/react", () => ({
  MultiFileDiff: () => <div data-testid="multi-file-diff">Diff content</div>,
  PatchDiff: () => <div data-testid="patch-diff">Patch content</div>,
}));

const oldFile = { name: "test.ts", content: "const a = 1;" };
const newFile = { name: "test.ts", content: "const a = 2;\nconst b = 3;" };

describe("FileChanges", () => {
  it("renders children", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <div>Content</div>
      </FileChanges>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FileChanges className="custom" oldFile={oldFile} newFile={newFile}>
        Test
      </FileChanges>
    );
    expect(container.firstChild).toHaveClass("custom");
  });

  it("is closed by default", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesHeader>
          <FileChangesTitle />
        </FileChangesHeader>
        <FileChangesContent />
      </FileChanges>
    );
    expect(screen.queryByTestId("multi-file-diff")).not.toBeInTheDocument();
  });

  it("can start open", () => {
    render(
      <FileChanges defaultOpen oldFile={oldFile} newFile={newFile}>
        <FileChangesHeader>
          <FileChangesTitle />
        </FileChangesHeader>
        <FileChangesContent />
      </FileChanges>
    );
    expect(screen.getAllByTestId("multi-file-diff")).toHaveLength(2);
  });
});

describe("FileChangesHeader", () => {
  it("renders children", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesHeader>Header content</FileChangesHeader>
      </FileChanges>
    );
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesHeader>
          <FileChangesTitle />
        </FileChangesHeader>
        <FileChangesContent />
      </FileChanges>
    );

    expect(screen.queryByTestId("multi-file-diff")).not.toBeInTheDocument();

    await user.click(screen.getByText("test.ts"));

    expect(screen.getAllByTestId("multi-file-diff")).toHaveLength(2);
  });
});

describe("FileChangesIcon", () => {
  it("renders default file icon", () => {
    const { container } = render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesIcon />
      </FileChanges>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom icon", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesIcon icon={<span data-testid="custom-icon">Icon</span>} />
      </FileChanges>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});

describe("FileChangesTitle", () => {
  it("renders filename from context", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesTitle />
      </FileChanges>
    );
    expect(screen.getByText("test.ts")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesTitle>Custom title</FileChangesTitle>
      </FileChanges>
    );
    expect(screen.getByText("Custom title")).toBeInTheDocument();
  });

  it("throws when used outside FileChanges", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<FileChangesTitle />)).toThrow(
      "FileChanges components must be used within a <FileChanges> component"
    );
    consoleError.mockRestore();
  });
});

describe("FileChangesStats", () => {
  it("calculates and displays stats", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesStats />
      </FileChanges>
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesStats className="custom" />
      </FileChanges>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("FileChangesActions", () => {
  it("renders children", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesActions>
          <button type="button">Action</button>
        </FileChangesActions>
      </FileChanges>
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("stops click propagation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesHeader>
          <FileChangesActions>
            <button type="button" onClick={onClick}>
              Action
            </button>
          </FileChangesActions>
        </FileChangesHeader>
        <FileChangesContent />
      </FileChanges>
    );

    await user.click(screen.getByText("Action"));

    expect(onClick).toHaveBeenCalled();
    expect(screen.queryByTestId("multi-file-diff")).not.toBeInTheDocument();
  });
});

describe("FileChangesMoreButton", () => {
  it("renders more button", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesMoreButton />
      </FileChanges>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesMoreButton>Custom</FileChangesMoreButton>
      </FileChanges>
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });
});

describe("FileChangesCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy button", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesCopyButton />
      </FileChanges>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies new file content", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesCopyButton />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));
    expect(writeTextSpy).toHaveBeenCalledWith(newFile.content);
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesCopyButton onCopy={onCopy} />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));
    expect(onCopy).toHaveBeenCalled();
  });

  it("calls onError when clipboard fails", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();
    const error = new Error("Clipboard error");

    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(error);

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesCopyButton onError={onError} />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});

describe("FileChangesRejectButton", () => {
  it("renders reject button", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesRejectButton />
      </FileChanges>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onStatusChange with rejected", async () => {
    const onStatusChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FileChanges
        oldFile={oldFile}
        newFile={newFile}
        onStatusChange={onStatusChange}
      >
        <FileChangesRejectButton />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));
    expect(onStatusChange).toHaveBeenCalledWith("rejected");
  });

  it("calls onReject callback", async () => {
    const onReject = vi.fn();
    const user = userEvent.setup();

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesRejectButton onReject={onReject} />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));
    expect(onReject).toHaveBeenCalled();
  });
});

describe("FileChangesAcceptButton", () => {
  it("renders accept button", () => {
    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesAcceptButton />
      </FileChanges>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onStatusChange with accepted", async () => {
    const onStatusChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FileChanges
        oldFile={oldFile}
        newFile={newFile}
        onStatusChange={onStatusChange}
      >
        <FileChangesAcceptButton />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));
    expect(onStatusChange).toHaveBeenCalledWith("accepted");
  });

  it("calls onAccept callback", async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();

    render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesAcceptButton onAccept={onAccept} />
      </FileChanges>
    );

    await user.click(screen.getByRole("button"));
    expect(onAccept).toHaveBeenCalled();
  });
});

describe("FileChangesExpandButton", () => {
  it("renders expand button with chevron", () => {
    const { container } = render(
      <FileChanges oldFile={oldFile} newFile={newFile}>
        <FileChangesExpandButton />
      </FileChanges>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("FileChangesContent", () => {
  it("renders diff content when open", () => {
    render(
      <FileChanges defaultOpen oldFile={oldFile} newFile={newFile}>
        <FileChangesHeader>
          <FileChangesTitle />
        </FileChangesHeader>
        <FileChangesContent />
      </FileChanges>
    );
    expect(screen.getAllByTestId("multi-file-diff")).toHaveLength(2);
  });

  it("applies custom className", () => {
    const { container } = render(
      <FileChanges defaultOpen oldFile={oldFile} newFile={newFile}>
        <FileChangesContent className="custom" />
      </FileChanges>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});
