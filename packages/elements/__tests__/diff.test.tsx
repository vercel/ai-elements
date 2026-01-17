import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Diff,
  DiffActions,
  DiffContent,
  DiffCopyButton,
  DiffHeader,
  DiffStats,
  DiffTitle,
} from "../src/diff";

vi.mock("@pierre/diffs/react", () => ({
  MultiFileDiff: ({
    oldFile,
    newFile,
  }: {
    oldFile: { name: string; contents: string };
    newFile: { name: string; contents: string };
  }) => (
    <div data-testid="multi-file-diff">
      <span>{oldFile.name}</span>
      <span>{newFile.name}</span>
    </div>
  ),
  PatchDiff: ({ patch }: { patch: string }) => (
    <div data-testid="patch-diff">{patch.substring(0, 50)}</div>
  ),
}));

const oldFile = { name: "test.ts", content: "const a = 1;" };
const newFile = { name: "test.ts", content: "const a = 2;\nconst b = 3;" };
const patch = `--- a/test.ts
+++ b/test.ts
@@ -1 +1,2 @@
-const a = 1;
+const a = 2;
+const b = 3;`;

describe("Diff", () => {
  it("renders children", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <div>Content</div>
      </Diff>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Diff className="custom" mode="files" newFile={newFile} oldFile={oldFile}>
        Test
      </Diff>
    );
    expect(container.firstChild).toHaveClass("custom");
  });

  it("renders with patch mode", () => {
    render(
      <Diff mode="patch" patch={patch}>
        <div>Patch content</div>
      </Diff>
    );
    expect(screen.getByText("Patch content")).toBeInTheDocument();
  });
});

describe("DiffHeader", () => {
  it("renders children", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffHeader>Header content</DiffHeader>
      </Diff>
    );
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffHeader className="custom">Header</DiffHeader>
      </Diff>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("DiffTitle", () => {
  it("renders filename from context", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffTitle />
      </Diff>
    );
    expect(screen.getByText("test.ts")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffTitle>Custom title</DiffTitle>
      </Diff>
    );
    expect(screen.getByText("Custom title")).toBeInTheDocument();
  });

  it("throws when used outside Diff", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    expect(() => render(<DiffTitle />)).toThrow(
      "Diff components must be used within a <Diff> component"
    );
    consoleError.mockRestore();
  });
});

describe("DiffStats", () => {
  it("calculates stats for files mode", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffStats />
      </Diff>
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calculates stats for patch mode", () => {
    render(
      <Diff mode="patch" patch={patch}>
        <DiffStats />
      </Diff>
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffStats className="custom" />
      </Diff>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("DiffActions", () => {
  it("renders children", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffActions>
          <button type="button">Action</button>
        </DiffActions>
      </Diff>
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("DiffCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy button", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffCopyButton />
      </Diff>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies new file content by default", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffCopyButton />
      </Diff>
    );

    await user.click(screen.getByRole("button"));
    expect(writeTextSpy).toHaveBeenCalledWith(newFile.content);
  });

  it("copies old file content when copyTarget is old", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffCopyButton copyTarget="old" />
      </Diff>
    );

    await user.click(screen.getByRole("button"));
    expect(writeTextSpy).toHaveBeenCalledWith(oldFile.content);
  });

  it("copies patch content in patch mode", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <Diff mode="patch" patch={patch}>
        <DiffCopyButton />
      </Diff>
    );

    await user.click(screen.getByRole("button"));
    expect(writeTextSpy).toHaveBeenCalledWith(patch);
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffCopyButton onCopy={onCopy} />
      </Diff>
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
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffCopyButton onError={onError} />
      </Diff>
    );

    await user.click(screen.getByRole("button"));

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("calls onError when clipboard API is not available", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();

    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: undefined },
      writable: true,
      configurable: true,
    });

    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffCopyButton onError={onError} />
      </Diff>
    );

    await user.click(screen.getByRole("button"));

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Clipboard API not available",
      })
    );

    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });
});

describe("DiffContent", () => {
  it("renders diff content for files mode", () => {
    render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffContent />
      </Diff>
    );
    expect(screen.getAllByTestId("multi-file-diff")).toHaveLength(2);
  });

  it("renders diff content for patch mode", () => {
    render(
      <Diff mode="patch" patch={patch}>
        <DiffContent />
      </Diff>
    );
    expect(screen.getAllByTestId("patch-diff")).toHaveLength(2);
  });

  it("applies maxHeight style", () => {
    const { container } = render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffContent maxHeight={300} />
      </Diff>
    );
    const content = container.querySelector(".overflow-auto");
    expect(content).toHaveStyle({ maxHeight: "300px" });
  });

  it("applies maxHeight as string", () => {
    const { container } = render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffContent maxHeight="50vh" />
      </Diff>
    );
    const content = container.querySelector(".overflow-auto");
    expect(content).toHaveStyle({ maxHeight: "50vh" });
  });

  it("applies custom className", () => {
    const { container } = render(
      <Diff mode="files" newFile={newFile} oldFile={oldFile}>
        <DiffContent className="custom" />
      </Diff>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});
