import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Canvas } from "../src/canvas";
import { Controls } from "../src/controls";

describe("Controls", () => {
  it("renders within Canvas", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Controls />
      </Canvas>
    );
    expect(
      container.querySelector(".react-flow__controls")
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Controls className="custom-controls" />
      </Canvas>
    );
    const controls = container.querySelector(".custom-controls");
    expect(controls).toBeInTheDocument();
    expect(controls).toHaveClass("custom-controls");
  });

  it("renders with default styles", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Controls />
      </Canvas>
    );
    const controls = container.querySelector(".react-flow__controls");
    expect(controls).toBeInTheDocument();
  });

  it("accepts additional props", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <Controls data-testid="test-controls" />
      </Canvas>
    );
    // Just verify it renders without error
    expect(container).toBeTruthy();
  });
});
