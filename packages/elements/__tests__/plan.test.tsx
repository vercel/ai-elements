import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "../src/plan";

describe("Plan", () => {
  describe("Plan", () => {
    it("renders with children", () => {
      render(
        <Plan>
          <div>Content</div>
        </Plan>
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Plan className="custom-class">
          <div>Content</div>
        </Plan>
      );
      const card = container.querySelector('[data-slot="plan"]');
      expect(card).toHaveClass("custom-class");
    });

    it("applies shadow-none class by default", () => {
      const { container } = render(
        <Plan>
          <div>Content</div>
        </Plan>
      );
      const card = container.querySelector('[data-slot="plan"]');
      expect(card).toHaveClass("shadow-none");
    });

    it("sets isStreaming to false by default", () => {
      render(
        <Plan>
          <PlanHeader>
            <PlanTitle>Test</PlanTitle>
          </PlanHeader>
        </Plan>
      );
      // Should render without Shimmer when not streaming
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("provides isStreaming context when true", () => {
      render(
        <Plan isStreaming>
          <PlanHeader>
            <PlanTitle>Test</PlanTitle>
          </PlanHeader>
        </Plan>
      );
      // Should render with Shimmer when streaming
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("forwards collapsible props", () => {
      const { container } = render(
        <Plan defaultOpen={false}>
          <PlanContent>Hidden content</PlanContent>
        </Plan>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe("PlanHeader", () => {
    it("renders with children", () => {
      render(
        <Plan>
          <PlanHeader>
            <div>Header content</div>
          </PlanHeader>
        </Plan>
      );
      expect(screen.getByText("Header content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Plan>
          <PlanHeader className="custom-header">
            <div>Content</div>
          </PlanHeader>
        </Plan>
      );
      const header = container.querySelector('[data-slot="plan-header"]');
      expect(header).toHaveClass("custom-header");
    });

    it("applies default flex layout classes", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>Content</PlanHeader>
        </Plan>
      );
      const header = container.querySelector('[data-slot="plan-header"]');
      expect(header).toHaveClass("flex", "items-start", "justify-between");
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>Content</PlanHeader>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-header"]')
      ).toBeInTheDocument();
    });
  });

  describe("PlanTitle", () => {
    it("renders text content", () => {
      render(
        <Plan>
          <PlanHeader>
            <PlanTitle>Plan Title</PlanTitle>
          </PlanHeader>
        </Plan>
      );
      expect(screen.getByText("Plan Title")).toBeInTheDocument();
    });

    it("renders without Shimmer when not streaming", () => {
      const { container } = render(
        <Plan isStreaming={false}>
          <PlanHeader>
            <PlanTitle>Static Title</PlanTitle>
          </PlanHeader>
        </Plan>
      );
      const title = container.querySelector('[data-slot="plan-title"]');
      expect(title?.textContent).toBe("Static Title");
    });

    it("renders with Shimmer when streaming", () => {
      const { container } = render(
        <Plan isStreaming>
          <PlanHeader>
            <PlanTitle>Streaming Title</PlanTitle>
          </PlanHeader>
        </Plan>
      );
      const title = container.querySelector('[data-slot="plan-title"]');
      // When streaming, the title should have shimmer effect applied
      expect(title).toBeInTheDocument();
      expect(screen.getByText("Streaming Title")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanTitle>Title</PlanTitle>
          </PlanHeader>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-title"]')
      ).toBeInTheDocument();
    });

    it("throws error when used outside Plan context", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      expect(() => {
        render(<PlanTitle>Title</PlanTitle>);
      }).toThrow("Plan components must be used within Plan");

      consoleSpy.mockRestore();
    });
  });

  describe("PlanDescription", () => {
    it("renders text content", () => {
      render(
        <Plan>
          <PlanHeader>
            <PlanDescription>Plan description text</PlanDescription>
          </PlanHeader>
        </Plan>
      );
      expect(screen.getByText("Plan description text")).toBeInTheDocument();
    });

    it("applies text-balance class by default", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanDescription>Description</PlanDescription>
          </PlanHeader>
        </Plan>
      );
      const description = container.querySelector(
        '[data-slot="plan-description"]'
      );
      expect(description).toHaveClass("text-balance");
    });

    it("applies custom className", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanDescription className="custom-desc">
              Description
            </PlanDescription>
          </PlanHeader>
        </Plan>
      );
      const description = container.querySelector(
        '[data-slot="plan-description"]'
      );
      expect(description).toHaveClass("custom-desc");
    });

    it("renders without Shimmer when not streaming", () => {
      render(
        <Plan isStreaming={false}>
          <PlanHeader>
            <PlanDescription>Static description</PlanDescription>
          </PlanHeader>
        </Plan>
      );
      expect(screen.getByText("Static description")).toBeInTheDocument();
    });

    it("renders with Shimmer when streaming", () => {
      render(
        <Plan isStreaming>
          <PlanHeader>
            <PlanDescription>Streaming description</PlanDescription>
          </PlanHeader>
        </Plan>
      );
      expect(screen.getByText("Streaming description")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanDescription>Description</PlanDescription>
          </PlanHeader>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-description"]')
      ).toBeInTheDocument();
    });

    it("throws error when used outside Plan context", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      expect(() => {
        render(<PlanDescription>Description</PlanDescription>);
      }).toThrow("Plan components must be used within Plan");

      consoleSpy.mockRestore();
    });
  });

  describe("PlanAction", () => {
    it("renders with children", () => {
      render(
        <Plan>
          <PlanHeader>
            <PlanAction>
              <button type="button">Action</button>
            </PlanAction>
          </PlanHeader>
        </Plan>
      );
      expect(
        screen.getByRole("button", { name: "Action" })
      ).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanAction>Action</PlanAction>
          </PlanHeader>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-action"]')
      ).toBeInTheDocument();
    });
  });

  describe("PlanContent", () => {
    it("renders with children", () => {
      render(
        <Plan defaultOpen>
          <PlanContent>
            <div>Plan content</div>
          </PlanContent>
        </Plan>
      );
      expect(screen.getByText("Plan content")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan defaultOpen>
          <PlanContent>Content</PlanContent>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-content"]')
      ).toBeInTheDocument();
    });

    it("is collapsible", async () => {
      const user = userEvent.setup();

      render(
        <Plan defaultOpen={false}>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>Collapsible content</PlanContent>
        </Plan>
      );

      // Content should not be visible initially
      expect(screen.queryByText("Collapsible content")).not.toBeInTheDocument();

      // Click the trigger
      const trigger = screen.getByRole("button", { name: "Toggle plan" });
      await user.click(trigger);

      // Content should now be visible
      expect(screen.getByText("Collapsible content")).toBeInTheDocument();
    });
  });

  describe("PlanFooter", () => {
    it("renders with children", () => {
      render(
        <Plan>
          <PlanFooter>
            <div>Footer content</div>
          </PlanFooter>
        </Plan>
      );
      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan>
          <PlanFooter>Footer</PlanFooter>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-footer"]')
      ).toBeInTheDocument();
    });
  });

  describe("PlanTrigger", () => {
    it("renders toggle button", () => {
      render(
        <Plan>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
        </Plan>
      );
      expect(
        screen.getByRole("button", { name: "Toggle plan" })
      ).toBeInTheDocument();
    });

    it("renders chevron icon", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
        </Plan>
      );
      const icon = container.querySelector(".size-4");
      expect(icon).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Plan>
          <PlanHeader>
            <PlanTrigger className="custom-trigger" />
          </PlanHeader>
        </Plan>
      );
      const button = screen.getByRole("button", { name: "Toggle plan" });
      expect(button).toHaveClass("custom-trigger");
    });

    it("has correct default size and variant", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
        </Plan>
      );
      const button = container.querySelector('[data-slot="plan-trigger"]');
      expect(button).toHaveClass("size-8");
    });

    it("has correct data-slot attribute", () => {
      const { container } = render(
        <Plan>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
        </Plan>
      );
      expect(
        container.querySelector('[data-slot="plan-trigger"]')
      ).toBeInTheDocument();
    });

    it("toggles content visibility on click", async () => {
      const user = userEvent.setup();

      render(
        <Plan defaultOpen={false}>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>Toggle content</PlanContent>
        </Plan>
      );

      const trigger = screen.getByRole("button", { name: "Toggle plan" });

      // Initially hidden
      expect(screen.queryByText("Toggle content")).not.toBeInTheDocument();

      // Click to show
      await user.click(trigger);
      expect(screen.getByText("Toggle content")).toBeInTheDocument();

      // Click to hide
      await user.click(trigger);
      expect(screen.queryByText("Toggle content")).not.toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("renders complete plan structure", () => {
      render(
        <Plan defaultOpen>
          <PlanHeader>
            <PlanTitle>My Plan</PlanTitle>
            <PlanDescription>Plan description</PlanDescription>
            <PlanAction>
              <button type="button">Edit</button>
            </PlanAction>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>
            <ul>
              <li>Step 1</li>
              <li>Step 2</li>
            </ul>
          </PlanContent>
          <PlanFooter>
            <button type="button">Submit</button>
          </PlanFooter>
        </Plan>
      );

      expect(screen.getByText("My Plan")).toBeInTheDocument();
      expect(screen.getByText("Plan description")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Toggle plan" })
      ).toBeInTheDocument();
      expect(screen.getByText("Step 1")).toBeInTheDocument();
      expect(screen.getByText("Step 2")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit" })
      ).toBeInTheDocument();
    });

    it("handles streaming state throughout components", () => {
      const { container } = render(
        <Plan defaultOpen isStreaming>
          <PlanHeader>
            <PlanTitle>Streaming Plan</PlanTitle>
            <PlanDescription>Loading description</PlanDescription>
          </PlanHeader>
          <PlanContent>Content</PlanContent>
        </Plan>
      );

      // Both title and description should have shimmer when streaming
      const title = container.querySelector('[data-slot="plan-title"]');
      const description = container.querySelector(
        '[data-slot="plan-description"]'
      );

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(screen.getByText("Streaming Plan")).toBeInTheDocument();
      expect(screen.getByText("Loading description")).toBeInTheDocument();
    });

    it("can be controlled", async () => {
      const user = userEvent.setup();
      let open = false;
      const setOpen = (value: boolean) => {
        open = value;
      };

      const { rerender } = render(
        <Plan onOpenChange={setOpen} open={open}>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>Controlled content</PlanContent>
        </Plan>
      );

      expect(screen.queryByText("Controlled content")).not.toBeInTheDocument();

      const trigger = screen.getByRole("button", { name: "Toggle plan" });
      await user.click(trigger);

      // Update the controlled state
      open = true;
      rerender(
        <Plan onOpenChange={setOpen} open={open}>
          <PlanHeader>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>Controlled content</PlanContent>
        </Plan>
      );

      expect(screen.getByText("Controlled content")).toBeInTheDocument();
    });
  });
});
