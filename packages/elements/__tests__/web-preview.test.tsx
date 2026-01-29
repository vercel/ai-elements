import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const CONSOLE_REGEX = /console/i;

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "../src/web-preview";

describe("WebPreview", () => {
  it("renders children", () => {
    render(<WebPreview>Content</WebPreview>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("uses default URL", () => {
    render(
      <WebPreview defaultUrl="https://example.com">
        <WebPreviewUrl />
      </WebPreview>
    );
    const input = screen.getByPlaceholderText("Enter URL...");
    expect(input).toHaveValue("https://example.com");
  });

  it("calls onUrlChange", async () => {
    const onUrlChange = vi.fn();
    const user = userEvent.setup();

    render(
      <WebPreview onUrlChange={onUrlChange}>
        <WebPreviewUrl />
      </WebPreview>
    );

    const input = screen.getByPlaceholderText("Enter URL...");
    await user.type(input, "https://test.com{Enter}");

    expect(onUrlChange).toHaveBeenCalled();
  });

  it("throws error when component used outside provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<WebPreviewUrl />)).toThrow(
      "WebPreview components must be used within a WebPreview"
    );

    spy.mockRestore();
  });
});

describe("WebPreviewNavigation", () => {
  it("renders navigation", () => {
    render(<WebPreviewNavigation>Nav content</WebPreviewNavigation>);
    expect(screen.getByText("Nav content")).toBeInTheDocument();
  });
});

describe("WebPreviewNavigationButton", () => {
  it("renders button with tooltip", () => {
    render(
      <WebPreviewNavigationButton tooltip="Back">
        <span>←</span>
      </WebPreviewNavigationButton>
    );
    expect(screen.getByText("←")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(
      <WebPreviewNavigationButton disabled tooltip="Forward">
        →
      </WebPreviewNavigationButton>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("handles click", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <WebPreviewNavigationButton onClick={onClick} tooltip="Refresh">
        ↻
      </WebPreviewNavigationButton>
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("WebPreviewUrl", () => {
  it("renders URL input", () => {
    render(
      <WebPreview>
        <WebPreviewUrl />
      </WebPreview>
    );
    expect(screen.getByPlaceholderText("Enter URL...")).toBeInTheDocument();
  });

  it("updates URL on Enter key", async () => {
    const user = userEvent.setup();

    render(
      <WebPreview>
        <WebPreviewUrl />
      </WebPreview>
    );

    const input = screen.getByPlaceholderText(
      "Enter URL..."
    ) as HTMLInputElement;
    await user.type(input, "https://example.com{Enter}");

    // Wait for the state to update
    await vi.waitFor(() => {
      expect(input).toHaveValue("https://example.com");
    });
  });
});

describe("WebPreviewBody", () => {
  it("renders iframe", () => {
    render(
      <WebPreview>
        <WebPreviewBody src="https://example.com" />
      </WebPreview>
    );
    const iframe = screen.getByTitle("Preview");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://example.com");
  });

  it("has sandbox attribute", () => {
    render(
      <WebPreview>
        <WebPreviewBody />
      </WebPreview>
    );
    const iframe = screen.getByTitle("Preview");
    expect(iframe).toHaveAttribute("sandbox");
  });

  it("renders loading component", () => {
    render(
      <WebPreview>
        <WebPreviewBody loading={<div>Loading...</div>} />
      </WebPreview>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("WebPreviewConsole", () => {
  it("renders console", () => {
    render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    expect(
      screen.getByRole("button", { name: CONSOLE_REGEX })
    ).toBeInTheDocument();
  });

  it("displays no output message", async () => {
    const user = userEvent.setup();

    render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );

    await user.click(screen.getByRole("button", { name: CONSOLE_REGEX }));
    expect(screen.getByText("No console output")).toBeVisible();
  });

  it("displays logs", async () => {
    const user = userEvent.setup();
    const logs = [
      { level: "log" as const, message: "Test log", timestamp: new Date() },
      {
        level: "error" as const,
        message: "Error message",
        timestamp: new Date(),
      },
    ];

    render(
      <WebPreview>
        <WebPreviewConsole logs={logs} />
      </WebPreview>
    );

    await user.click(screen.getByRole("button", { name: CONSOLE_REGEX }));
    expect(screen.getByText("Test log")).toBeVisible();
    expect(screen.getByText("Error message")).toBeVisible();
  });
});
