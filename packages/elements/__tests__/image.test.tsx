import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Image } from "../src/image";

describe("Image", () => {
  it("renders image with base64 data", () => {
    render(
      <Image
        alt="Test image"
        base64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        mediaType="image/png"
      />
    );
    const img = screen.getByAltText("Test image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("data:image/png;base64,")
    );
  });

  it("applies custom className", () => {
    render(
      <Image
        alt="Test"
        base64="test"
        className="custom-class"
        mediaType="image/jpeg"
      />
    );
    expect(screen.getByAltText("Test")).toHaveClass("custom-class");
  });

  it("renders without alt text", () => {
    const { container } = render(<Image base64="test" mediaType="image/png" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it("uses correct media type in data URL", () => {
    render(<Image alt="JPEG test" base64="test" mediaType="image/jpeg" />);
    const img = screen.getByAltText("JPEG test");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("data:image/jpeg;base64,")
    );
  });
});
