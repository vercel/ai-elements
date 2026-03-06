import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { FileTree, FileTreeFile, FileTreeFolder } from "../src/file-tree";

describe("fileTree", () => {
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

describe("fileTreeFolder", () => {
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

  it("toggles expansion on chevron click", async () => {
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

    // Click chevron to expand
    const [chevronButton] = screen.getAllByRole("button");
    await user.click(chevronButton);

    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("selects folder without toggling expansion", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <FileTree onSelect={onSelect}>
        <FileTreeFolder name="src" path="src">
          <FileTreeFile name="index.ts" path="src/index.ts" />
        </FileTreeFolder>
      </FileTree>
    );

    // Click folder name to select (not chevron)
    await user.click(screen.getByText("src"));

    expect(onSelect).toHaveBeenCalledWith("src");
    // Should NOT expand
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();
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

    const [chevronButton] = screen.getAllByRole("button");
    await user.click(chevronButton);

    expect(onExpandedChange).toHaveBeenCalledWith(new Set(["src"]));
  });
});

describe("fileTreeFile", () => {
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

describe("composability", () => {
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

    // Click folder name to find its sibling chevron, then expand
    const componentsText = screen.getByText("components");
    const componentsRow = componentsText.closest("div");
    const chevronButton = componentsRow?.querySelector("button:first-child");
    // oxlint-disable-next-line eslint-plugin-jest(no-conditional-in-test)
    if (chevronButton) {
      await user.click(chevronButton);
    }

    expect(screen.getByText("Button.tsx")).toBeInTheDocument();
  });
});
