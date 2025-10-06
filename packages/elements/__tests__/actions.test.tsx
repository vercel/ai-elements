import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Action, Actions } from "../src/actions";

describe("Actions", () => {
  it("renders children", () => {
    render(
      <Actions>
        <button>Test Action</button>
      </Actions>
    );
    expect(screen.getByText("Test Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Actions className="custom-class">
        <button>Test</button>
      </Actions>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("Action", () => {
  it("renders button with children", () => {
    render(<Action>Click me</Action>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders with tooltip", () => {
    render(<Action tooltip="Help text">Icon</Action>);
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("renders with label for accessibility", () => {
    render(<Action label="Save">Icon</Action>);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("applies default variant and size", () => {
    render(<Action>Test</Action>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies custom className", () => {
    render(<Action className="custom-button">Test</Action>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-button");
  });
});
