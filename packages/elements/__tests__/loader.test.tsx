import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader } from "../src/loader";

describe("Loader", () => {
  it("renders loader icon", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Loader className="custom-loader" />);
    expect(container.firstChild).toHaveClass("custom-loader");
  });

  it("renders with custom size", () => {
    const { container } = render(<Loader size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("has default size of 16", () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("has animate-spin class", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass("animate-spin");
  });
});
