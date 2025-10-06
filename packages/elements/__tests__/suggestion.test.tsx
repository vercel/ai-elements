import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Suggestion, Suggestions } from "../src/suggestion";

describe("Suggestions", () => {
  it("renders children", () => {
    render(
      <Suggestions>
        <Suggestion suggestion="Test">Test</Suggestion>
      </Suggestions>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Suggestions className="custom">
        <div>Content</div>
      </Suggestions>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});

describe("Suggestion", () => {
  it("renders suggestion text", () => {
    render(<Suggestion suggestion="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<Suggestion suggestion="test">Custom text</Suggestion>);
    expect(screen.getByText("Custom text")).toBeInTheDocument();
  });

  it("calls onClick with suggestion", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Suggestion onClick={onClick} suggestion="Test suggestion" />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).toHaveBeenCalledWith("Test suggestion");
  });

  it("applies default variant and size", () => {
    render(<Suggestion suggestion="Test" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies custom className", () => {
    render(<Suggestion className="custom" suggestion="Test" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom");
  });

  it("can be disabled", () => {
    render(<Suggestion disabled suggestion="Test" />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
