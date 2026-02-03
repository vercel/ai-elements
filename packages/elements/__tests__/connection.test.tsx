import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Connection } from "../src/connection";

describe("connection", () => {
  it("renders with basic props", () => {
    // Mock console.error to suppress React SVG warnings from @xyflow/react
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const props = {
      connectionStatus: null,
      fromPosition: "right" as const,
      fromX: 0,
      fromY: 0,
      toPosition: "left" as const,
      toX: 100,
      toY: 100,
    };

    const { container } = render(<Connection {...props} />);
    const path = container.querySelector("path");
    const circle = container.querySelector("circle");

    expect(path).toBeInTheDocument();
    expect(circle).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("renders path with correct coordinates", () => {
    const props = {
      connectionStatus: null,
      fromPosition: "right" as const,
      fromX: 10,
      fromY: 20,
      toPosition: "left" as const,
      toX: 100,
      toY: 120,
    };

    const { container } = render(<Connection {...props} />);
    const path = container.querySelector("path");

    expect(path).toHaveAttribute("d");
    expect(path).toHaveAttribute("fill", "none");
    expect(path).toHaveAttribute("stroke", "var(--color-ring)");
    expect(path).toHaveAttribute("stroke-width", "1");
  });

  it("renders circle at target position", () => {
    const props = {
      connectionStatus: null,
      fromPosition: "right" as const,
      fromX: 0,
      fromY: 0,
      toPosition: "left" as const,
      toX: 100,
      toY: 100,
    };

    const { container } = render(<Connection {...props} />);
    const circle = container.querySelector("circle");

    expect(circle).toHaveAttribute("cx", "100");
    expect(circle).toHaveAttribute("cy", "100");
    expect(circle).toHaveAttribute("r", "3");
    expect(circle).toHaveAttribute("fill", "#fff");
    expect(circle).toHaveAttribute("stroke", "var(--color-ring)");
  });

  it("calculates correct bezier curve", () => {
    const props = {
      connectionStatus: null,
      fromPosition: "right" as const,
      fromX: 0,
      fromY: 50,
      toPosition: "left" as const,
      toX: 200,
      toY: 50,
    };

    const { container } = render(<Connection {...props} />);
    const path = container.querySelector("path");
    const d = path?.getAttribute("d");

    expect(d).toContain("M0,50");
    expect(d).toContain("200,50");
  });
});
