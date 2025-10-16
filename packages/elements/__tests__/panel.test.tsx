import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Canvas } from "../src/canvas";
import { Panel } from "../src/panel";

describe("Panel", () => {
  it("renders children within Canvas", () => {
    render(
      <Canvas edges={[]} nodes={[]}>
        <Panel>Panel content</Panel>
      </Canvas>
    );
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Panel className="custom-panel">Content</Panel>
      </Canvas>
    );
    const panel = container.querySelector(".custom-panel");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass("custom-panel");
  });

  it("renders with default styles", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Panel>Content</Panel>
      </Canvas>
    );
    expect(container.querySelector(".react-flow__panel")).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Panel data-testid="test-panel">Content</Panel>
      </Canvas>
    );
    const panel = container.querySelector("[data-testid='test-panel']");
    expect(panel).toBeInTheDocument();
  });
});
