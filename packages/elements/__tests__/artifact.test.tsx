import { render, screen } from "@testing-library/react";
import { XIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "../src/artifact";

describe("Artifact", () => {
  it("renders children", () => {
    render(<Artifact>Content</Artifact>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Artifact className="custom">Test</Artifact>);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("ArtifactHeader", () => {
  it("renders children", () => {
    render(<ArtifactHeader>Header</ArtifactHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});

describe("ArtifactClose", () => {
  it("renders default close icon", () => {
    const { container } = render(<ArtifactClose />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<ArtifactClose>Custom Close</ArtifactClose>);
    expect(screen.getByText("Custom Close")).toBeInTheDocument();
  });

  it("has sr-only close text", () => {
    render(<ArtifactClose />);
    expect(screen.getByText("Close")).toHaveClass("sr-only");
  });
});

describe("ArtifactTitle", () => {
  it("renders title text", () => {
    render(<ArtifactTitle>My Title</ArtifactTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });
});

describe("ArtifactDescription", () => {
  it("renders description text", () => {
    render(<ArtifactDescription>Description text</ArtifactDescription>);
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });
});

describe("ArtifactActions", () => {
  it("renders action buttons", () => {
    render(
      <ArtifactActions>
        <button type="button">Action 1</button>
      </ArtifactActions>
    );
    expect(screen.getByText("Action 1")).toBeInTheDocument();
  });
});

describe("ArtifactAction", () => {
  it("renders with icon", () => {
    render(<ArtifactAction icon={XIcon} label="Close" />);
    expect(screen.getByText("Close")).toHaveClass("sr-only");
  });

  it("renders with tooltip", () => {
    render(<ArtifactAction label="Action" tooltip="Help" />);
    expect(screen.getByText("Action")).toHaveClass("sr-only");
  });

  it("renders with tooltip only (no label)", () => {
    render(<ArtifactAction tooltip="Help text">Content</ArtifactAction>);
    expect(screen.getByText("Help text")).toHaveClass("sr-only");
  });

  it("renders children when no icon", () => {
    render(<ArtifactAction label="Custom">Content</ArtifactAction>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("ArtifactContent", () => {
  it("renders content", () => {
    render(<ArtifactContent>Main content</ArtifactContent>);
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });
});
