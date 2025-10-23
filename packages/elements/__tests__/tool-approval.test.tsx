import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CheckIcon, XIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  ToolApproval,
  ToolApprovalAccepted,
  ToolApprovalAction,
  ToolApprovalActions,
  ToolApprovalContent,
  ToolApprovalRejected,
  ToolApprovalRequest,
} from "../src/tool-approval";

describe("ToolApproval", () => {
  it("renders children when approval is present", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <div>Approval Content</div>
      </ToolApproval>
    );
    expect(screen.getByText("Approval Content")).toBeInTheDocument();
  });

  it("does not render when approval is not present", () => {
    const { container } = render(
      <ToolApproval state="input-streaming">
        <div>Approval Content</div>
      </ToolApproval>
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render in input-streaming state", () => {
    const { container } = render(
      <ToolApproval approval={{ id: "test-id" }} state="input-streaming">
        <div>Approval Content</div>
      </ToolApproval>
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render in input-available state", () => {
    const { container } = render(
      <ToolApproval approval={{ id: "test-id" }} state="input-available">
        <div>Approval Content</div>
      </ToolApproval>
    );
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ToolApproval
        approval={{ id: "test-id" }}
        className="custom-class"
        state="approval-requested"
      >
        <div>Content</div>
      </ToolApproval>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("ToolApprovalContent", () => {
  it("renders ToolApprovalRequest when state is approval-requested", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalContent>
          <ToolApprovalRequest>Custom approval message</ToolApprovalRequest>
          <ToolApprovalAccepted>Accepted</ToolApprovalAccepted>
          <ToolApprovalRejected>Rejected</ToolApprovalRejected>
        </ToolApprovalContent>
      </ToolApproval>
    );
    expect(screen.getByText("Custom approval message")).toBeInTheDocument();
    expect(screen.queryByText("Accepted")).not.toBeInTheDocument();
    expect(screen.queryByText("Rejected")).not.toBeInTheDocument();
  });

  it("renders ToolApprovalAccepted when approved and state is approval-responded", () => {
    render(
      <ToolApproval
        approval={{ id: "test-id", approved: true }}
        state="approval-responded"
      >
        <ToolApprovalContent>
          <ToolApprovalRequest>Custom approval message</ToolApprovalRequest>
          <ToolApprovalAccepted>
            <CheckIcon />
            <span>Accepted</span>
          </ToolApprovalAccepted>
          <ToolApprovalRejected>
            <XIcon />
            <span>Rejected</span>
          </ToolApprovalRejected>
        </ToolApprovalContent>
      </ToolApproval>
    );
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(
      screen.queryByText("Custom approval message")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Rejected")).not.toBeInTheDocument();
  });

  it("renders ToolApprovalRejected when not approved and state is output-denied", () => {
    render(
      <ToolApproval
        approval={{ id: "test-id", approved: false }}
        state="output-denied"
      >
        <ToolApprovalContent>
          <ToolApprovalRequest>Custom approval message</ToolApprovalRequest>
          <ToolApprovalAccepted>
            <CheckIcon />
            <span>Accepted</span>
          </ToolApprovalAccepted>
          <ToolApprovalRejected>
            <XIcon />
            <span>Rejected</span>
          </ToolApprovalRejected>
        </ToolApprovalContent>
      </ToolApproval>
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(
      screen.queryByText("Custom approval message")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Accepted")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalContent className="custom-class">
          <ToolApprovalRequest>Custom approval message</ToolApprovalRequest>
          <ToolApprovalAccepted>Accepted</ToolApprovalAccepted>
          <ToolApprovalRejected>Rejected</ToolApprovalRejected>
        </ToolApprovalContent>
      </ToolApproval>
    );
    const content = container.querySelector(".custom-class");
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Custom approval message");
  });
});

describe("ToolApprovalActions", () => {
  it("renders custom children buttons", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalActions>
          <ToolApprovalAction variant="outline">Reject</ToolApprovalAction>
          <ToolApprovalAction variant="default">Accept</ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("hides when state is not approval-requested", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-responded">
        <ToolApprovalActions>
          <ToolApprovalAction variant="outline">Reject</ToolApprovalAction>
          <ToolApprovalAction variant="default">Accept</ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
  });

  it("shows when state is approval-requested", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalActions>
          <ToolApprovalAction variant="outline">Reject</ToolApprovalAction>
          <ToolApprovalAction variant="default">Accept</ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("calls onClick when accept button is clicked", async () => {
    const user = userEvent.setup();
    const handleAccept = vi.fn();
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalActions>
          <ToolApprovalAction variant="outline">Reject</ToolApprovalAction>
          <ToolApprovalAction onClick={handleAccept} variant="default">
            Accept
          </ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );

    await user.click(screen.getByText("Accept"));
    expect(handleAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when reject button is clicked", async () => {
    const user = userEvent.setup();
    const handleReject = vi.fn();
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalActions>
          <ToolApprovalAction onClick={handleReject} variant="outline">
            Reject
          </ToolApprovalAction>
          <ToolApprovalAction variant="default">Accept</ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );

    await user.click(screen.getByText("Reject"));
    expect(handleReject).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when disabled prop is true", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalActions>
          <ToolApprovalAction disabled variant="outline">
            Reject
          </ToolApprovalAction>
          <ToolApprovalAction disabled variant="default">
            Accept
          </ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );
    expect(screen.getByText("Accept")).toBeDisabled();
    expect(screen.getByText("Reject")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(
      <ToolApproval approval={{ id: "test-id" }} state="approval-requested">
        <ToolApprovalActions className="custom-class">
          <ToolApprovalAction variant="outline">Reject</ToolApprovalAction>
          <ToolApprovalAction variant="default">Accept</ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    );
    const actionsContainer = screen.getByText("Accept").parentElement;
    expect(actionsContainer).toHaveClass("custom-class");
  });
});

describe("ToolApprovalAccepted", () => {
  it("renders accepted status with icon", () => {
    render(
      <ToolApproval
        approval={{ id: "test-id", approved: true }}
        state="approval-responded"
      >
        <ToolApprovalContent>
          <ToolApprovalRequest>Request</ToolApprovalRequest>
          <ToolApprovalAccepted>
            <CheckIcon className="size-4" />
            <span>Accepted</span>
          </ToolApprovalAccepted>
          <ToolApprovalRejected>Rejected</ToolApprovalRejected>
        </ToolApprovalContent>
      </ToolApproval>
    );
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });
});

describe("ToolApprovalRejected", () => {
  it("renders rejected status with icon", () => {
    render(
      <ToolApproval
        approval={{ id: "test-id", approved: false }}
        state="output-denied"
      >
        <ToolApprovalContent>
          <ToolApprovalRequest>Request</ToolApprovalRequest>
          <ToolApprovalAccepted>Accepted</ToolApprovalAccepted>
          <ToolApprovalRejected>
            <XIcon className="size-4" />
            <span>Rejected</span>
          </ToolApprovalRejected>
        </ToolApprovalContent>
      </ToolApproval>
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });
});
