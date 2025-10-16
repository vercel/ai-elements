import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Shimmer } from "../src/shimmer";

describe("Shimmer", () => {
  it("renders text content", () => {
    render(<Shimmer>Loading...</Shimmer>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders as paragraph by default", () => {
    const { container } = render(<Shimmer>Text</Shimmer>);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders as custom element", () => {
    const { container } = render(<Shimmer as="span">Text</Shimmer>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders as heading", () => {
    render(<Shimmer as="h1">Heading</Shimmer>);
    expect(
      screen.getByRole("heading", { name: "Heading", level: 1 })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Shimmer className="custom-class">Text</Shimmer>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies default styling classes", () => {
    const { container } = render(<Shimmer>Text</Shimmer>);
    expect(container.firstChild).toHaveClass("relative");
    expect(container.firstChild).toHaveClass("inline-block");
    expect(container.firstChild).toHaveClass("text-transparent");
  });

  it("sets dynamic spread based on text length", () => {
    const { container } = render(<Shimmer spread={2}>Hello</Shimmer>);
    const element = container.firstChild as HTMLElement;
    // With 5 characters and spread=2, expected spread is 10px
    expect(element.style.getPropertyValue("--spread")).toBe("10px");
  });

  it("respects custom duration", () => {
    const { container } = render(<Shimmer duration={5}>Text</Shimmer>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("respects custom spread", () => {
    const { container } = render(<Shimmer spread={5}>Test</Shimmer>);
    const element = container.firstChild as HTMLElement;
    // With 4 characters and spread=5, expected spread is 20px
    expect(element.style.getPropertyValue("--spread")).toBe("20px");
  });

  it("calculates spread for long text", () => {
    const longText = "This is a very long text for shimmer effect";
    const { container } = render(<Shimmer spread={3}>{longText}</Shimmer>);
    const element = container.firstChild as HTMLElement;
    // Length is 43 characters (excluding the extra space), spread=3, so 129px
    expect(element.style.getPropertyValue("--spread")).toBe("129px");
  });

  it("handles empty string", () => {
    const { container } = render(<Shimmer>{""}</Shimmer>);
    const element = container.firstChild as HTMLElement;
    expect(element.style.getPropertyValue("--spread")).toBe("0px");
  });

  it("memoizes component", () => {
    const { rerender, container } = render(<Shimmer>Text</Shimmer>);
    const firstElement = container.firstChild;

    // Rerender with same props
    rerender(<Shimmer>Text</Shimmer>);
    const secondElement = container.firstChild;

    // Should be the same element due to memoization
    expect(firstElement).toBe(secondElement);
  });

  it("re-renders when children change", () => {
    const { rerender } = render(<Shimmer>First</Shimmer>);
    expect(screen.getByText("First")).toBeInTheDocument();

    rerender(<Shimmer>Second</Shimmer>);
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("re-renders when spread changes", () => {
    const { container, rerender } = render(<Shimmer spread={2}>Test</Shimmer>);
    let element = container.firstChild as HTMLElement;
    expect(element.style.getPropertyValue("--spread")).toBe("8px");

    rerender(<Shimmer spread={5}>Test</Shimmer>);
    element = container.firstChild as HTMLElement;
    expect(element.style.getPropertyValue("--spread")).toBe("20px");
  });

  it("sets background image styles", () => {
    const { container } = render(<Shimmer>Text</Shimmer>);
    const element = container.firstChild as HTMLElement;
    expect(element.style.backgroundImage).toContain("linear-gradient");
  });
});
