import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileTree, FileTreeFile, FileTreeFolder } from "../src/file-tree";

describe("FileTree", () => {
  it("renders children", () => {
    render(
      <FileTree>
        <FileTreeFile name="test.txt" path="test.txt" />
      </FileTree>
    );
    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FileTree className="custom-class">
        <FileTreeFile name="test.txt" path="test.txt" />
      </FileTree>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has tree role", () => {
    render(
      <FileTree>
        <FileTreeFile name="test.txt" path="test.txt" />
      </FileTree>
    );
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });
});

describe("FileTreeFolder", () => {
  it("renders folder name", () => {
    render(
      <FileTree>
        <FileTreeFolder name="src" path="src">
          <FileTreeFile name="index.ts" path="src/index.ts" />
        </FileTreeFolder>
      </FileTree>
    );
    expect(screen.getByText("src")).toBeInTheDocument();
  });

  it("expands when defaultExpanded contains path", () => {
    render(
      <FileTree defaultExpanded={new Set(["src"])}>
        <FileTreeFolder name="src" path="src">
          <FileTreeFile name="index.ts" path="src/index.ts" />
        </FileTreeFolder>
      </FileTree>
    );
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("toggles expansion on click", async () => {
    const user = userEvent.setup();
    render(
      <FileTree>
        <FileTreeFolder name="src" path="src">
          <FileTreeFile name="index.ts" path="src/index.ts" />
        </FileTreeFolder>
      </FileTree>
    );

    // Initially collapsed
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();

    // Click to expand
    const folderButton = screen.getByRole("button");
    await user.click(folderButton);

    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("calls onExpandedChange when toggling", async () => {
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FileTree onExpandedChange={onExpandedChange}>
        <FileTreeFolder name="src" path="src">
          <FileTreeFile name="index.ts" path="src/index.ts" />
        </FileTreeFolder>
      </FileTree>
    );

    const folderButton = screen.getByRole("button");
    await user.click(folderButton);

    expect(onExpandedChange).toHaveBeenCalledWith(new Set(["src"]));
  });
});

describe("FileTreeFile", () => {
  it("renders file name", () => {
    render(
      <FileTree>
        <FileTreeFile name="test.txt" path="test.txt" />
      </FileTree>
    );
    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <FileTree onSelect={onSelect}>
        <FileTreeFile name="test.txt" path="test.txt" />
      </FileTree>
    );

    await user.click(screen.getByText("test.txt"));
    expect(onSelect).toHaveBeenCalledWith("test.txt");
  });

  it("applies selected styling when selected", () => {
    render(
      <FileTree selectedPath="test.txt">
        <FileTreeFile name="test.txt" path="test.txt" />
      </FileTree>
    );

    const fileElement = screen.getByRole("treeitem");
    expect(fileElement).toHaveClass("bg-muted");
  });

  it("renders custom icon", () => {
    render(
      <FileTree>
        <FileTreeFile
          icon={<span data-testid="custom-icon">📄</span>}
          name="test.tsx"
          path="test.tsx"
        />
      </FileTree>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});

describe("Composability", () => {
  it("renders nested folder structure", async () => {
    const user = userEvent.setup();
    render(
      <FileTree defaultExpanded={new Set(["src"])}>
        <FileTreeFolder name="src" path="src">
          <FileTreeFolder name="components" path="src/components">
            <FileTreeFile name="Button.tsx" path="src/components/Button.tsx" />
          </FileTreeFolder>
        </FileTreeFolder>
      </FileTree>
    );

    expect(screen.getByText("components")).toBeInTheDocument();

    // Expand nested folder
    const componentsFolderButton = screen
      .getByText("components")
      .closest("button");
    if (componentsFolderButton) {
      await user.click(componentsFolderButton);
    }

    expect(screen.getByText("Button.tsx")).toBeInTheDocument();
  });
});
