import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const BOLD_REGEX = /Bold/;
const NEXT_REGEX = /next/i;
const PREVIOUS_REGEX = /previous/i;
const TWO_OF_TWO_REGEX = /2 of 2/;
const ONE_OF_TWO_REGEX = /1 of 2/;
const ONE_OF_THREE_REGEX = /1 of 3/;
const THREE_OF_THREE_REGEX = /3 of 3/;

import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "../src/message";

describe("Message", () => {
  it("renders children", () => {
    render(<Message from="user">Content</Message>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies user class", () => {
    const { container } = render(<Message from="user">Content</Message>);
    expect(container.firstChild).toHaveClass("is-user");
  });

  it("applies assistant class", () => {
    const { container } = render(<Message from="assistant">Content</Message>);
    expect(container.firstChild).toHaveClass("is-assistant");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Message className="custom" from="user">
        Content
      </Message>
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("MessageContent", () => {
  it("renders content", () => {
    render(<MessageContent>Message text</MessageContent>);
    expect(screen.getByText("Message text")).toBeInTheDocument();
  });

  it("applies contained variant styles", () => {
    render(<MessageContent variant="contained">Text</MessageContent>);
    expect(screen.getByText("Text")).toBeInTheDocument();
  });

  it("applies flat variant styles", () => {
    render(<MessageContent variant="flat">Text</MessageContent>);
    expect(screen.getByText("Text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MessageContent className="custom">Text</MessageContent>
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("MessageActions", () => {
  it("renders children", () => {
    render(
      <MessageActions>
        <button type="button">Test Action</button>
      </MessageActions>
    );
    expect(screen.getByText("Test Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MessageActions className="custom-class">
        <button type="button">Test</button>
      </MessageActions>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("MessageAction", () => {
  it("renders button with children", () => {
    render(<MessageAction>Click me</MessageAction>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders with tooltip", () => {
    render(<MessageAction tooltip="Help text">Icon</MessageAction>);
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("renders with label for accessibility", () => {
    render(<MessageAction label="Save">Icon</MessageAction>);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("applies default variant and size", () => {
    render(<MessageAction>Test</MessageAction>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies custom className", () => {
    render(<MessageAction className="custom-button">Test</MessageAction>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-button");
  });
});

describe("MessageResponse", () => {
  it("renders markdown content", () => {
    render(<MessageResponse>Plain text</MessageResponse>);
    expect(screen.getByText("Plain text")).toBeInTheDocument();
  });

  it("renders markdown with formatting", () => {
    render(<MessageResponse>**Bold** text</MessageResponse>);
    expect(screen.getByText(BOLD_REGEX)).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MessageResponse className="custom-class">Text</MessageResponse>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children as markdown", () => {
    render(<MessageResponse># Heading</MessageResponse>);
    expect(screen.getByText("Heading")).toBeInTheDocument();
  });
});

describe("MessageBranch", () => {
  it("renders children", () => {
    render(<MessageBranch>Content</MessageBranch>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when components used outside MessageBranch provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<MessageBranchNext />)).toThrow(
      "MessageBranch components must be used within MessageBranch"
    );

    spy.mockRestore();
  });

  it("calls onBranchChange when branch changes", async () => {
    const onBranchChange = vi.fn();
    const user = userEvent.setup();

    render(
      <MessageBranch onBranchChange={onBranchChange}>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchPrevious />
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>
    );

    const nextButton = screen.getByRole("button", { name: NEXT_REGEX });
    await user.click(nextButton);

    expect(onBranchChange).toHaveBeenCalledWith(1);
  });
});

describe("MessageBranchContent", () => {
  it("renders active branch", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
      </MessageBranch>
    );

    expect(screen.getByText("Branch 1")).toBeInTheDocument();
  });
});

describe("MessageBranchSelector", () => {
  it("hides when only one branch", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">Single Branch</div>
        </MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <span>Selector</span>
        </MessageBranchSelector>
      </MessageBranch>
    );

    expect(screen.queryByText("Selector")).not.toBeInTheDocument();
  });

  it("shows when multiple branches", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <span>Selector</span>
        </MessageBranchSelector>
      </MessageBranch>
    );

    expect(screen.getByText("Selector")).toBeInTheDocument();
  });
});

describe("MessageBranchPrevious", () => {
  it("renders previous button", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
        <MessageBranchPrevious />
      </MessageBranch>
    );

    expect(
      screen.getByRole("button", { name: PREVIOUS_REGEX })
    ).toBeInTheDocument();
  });

  it("navigates to previous branch", async () => {
    const user = userEvent.setup();

    render(
      <MessageBranch defaultBranch={1}>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
        <MessageBranchPrevious />
        <MessageBranchPage />
      </MessageBranch>
    );

    // Should start at branch 2
    expect(screen.getByText(TWO_OF_TWO_REGEX)).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: PREVIOUS_REGEX });
    await user.click(prevButton);

    // Should navigate to branch 1
    expect(screen.getByText(ONE_OF_TWO_REGEX)).toBeInTheDocument();
  });

  it("wraps to last branch when clicking previous on first branch", async () => {
    const user = userEvent.setup();

    render(
      <MessageBranch defaultBranch={0}>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
          <div key="3">Branch 3</div>
        </MessageBranchContent>
        <MessageBranchPrevious />
        <MessageBranchPage />
      </MessageBranch>
    );

    // Should start at branch 1
    expect(screen.getByText(ONE_OF_THREE_REGEX)).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: PREVIOUS_REGEX });
    await user.click(prevButton);

    // Should wrap to branch 3
    expect(screen.getByText(THREE_OF_THREE_REGEX)).toBeInTheDocument();
  });
});

describe("MessageBranchNext", () => {
  it("renders next button", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
        <MessageBranchNext />
      </MessageBranch>
    );

    expect(
      screen.getByRole("button", { name: NEXT_REGEX })
    ).toBeInTheDocument();
  });
});

describe("MessageBranchPage", () => {
  it("displays current page count", () => {
    render(
      <MessageBranch>
        <MessageBranchContent>
          <div key="1">Branch 1</div>
          <div key="2">Branch 2</div>
        </MessageBranchContent>
        <MessageBranchPage />
      </MessageBranch>
    );

    expect(screen.getByText(ONE_OF_TWO_REGEX)).toBeInTheDocument();
  });
});
