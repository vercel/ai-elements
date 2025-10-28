import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CheckIcon, XIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
} from "../src/confirmation";

describe("Confirmation", () => {
  it("renders children when approval is present", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <div>Approval Content</div>
      </Confirmation>
    );
    expect(screen.getByText("Approval Content")).toBeInTheDocument();
  });

  it("does not render when approval is not present", () => {
    const { container } = render(
      <Confirmation state="input-streaming">
        <div>Approval Content</div>
      </Confirmation>
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render in input-streaming state", () => {
    const { container } = render(
      <Confirmation approval={{ id: "test-id" }} state="input-streaming">
        <div>Approval Content</div>
      </Confirmation>
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render in input-available state", () => {
    const { container } = render(
      <Confirmation approval={{ id: "test-id" }} state="input-available">
        <div>Approval Content</div>
      </Confirmation>
    );
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Confirmation
        approval={{ id: "test-id" }}
        className="custom-class"
        state="approval-requested"
      >
        <div>Content</div>
      </Confirmation>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("ConfirmationRequest, ConfirmationAccepted, ConfirmationRejected", () => {
  it("renders ConfirmationRequest when state is approval-requested", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationRequest>Custom approval message</ConfirmationRequest>
        <ConfirmationAccepted>Accepted</ConfirmationAccepted>
        <ConfirmationRejected>Rejected</ConfirmationRejected>
      </Confirmation>
    );
    expect(screen.getByText("Custom approval message")).toBeInTheDocument();
    expect(screen.queryByText("Accepted")).not.toBeInTheDocument();
    expect(screen.queryByText("Rejected")).not.toBeInTheDocument();
  });

  it("renders ConfirmationAccepted when approved and state is approval-responded", () => {
    render(
      <Confirmation
        approval={{ id: "test-id", approved: true }}
        state="approval-responded"
      >
        <ConfirmationRequest>Custom approval message</ConfirmationRequest>
        <ConfirmationAccepted>
          <CheckIcon />
          <span>Accepted</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <XIcon />
          <span>Rejected</span>
        </ConfirmationRejected>
      </Confirmation>
    );
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(
      screen.queryByText("Custom approval message")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Rejected")).not.toBeInTheDocument();
  });

  it("renders ConfirmationRejected when not approved and state is output-denied", () => {
    render(
      <Confirmation
        approval={{ id: "test-id", approved: false }}
        state="output-denied"
      >
        <ConfirmationRequest>Custom approval message</ConfirmationRequest>
        <ConfirmationAccepted>
          <CheckIcon />
          <span>Accepted</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <XIcon />
          <span>Rejected</span>
        </ConfirmationRejected>
      </Confirmation>
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(
      screen.queryByText("Custom approval message")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Accepted")).not.toBeInTheDocument();
  });
});

describe("ConfirmationActions", () => {
  it("renders custom children buttons", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationActions>
          <ConfirmationAction variant="outline">Reject</ConfirmationAction>
          <ConfirmationAction variant="default">Accept</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("hides when state is not approval-requested", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-responded">
        <ConfirmationActions>
          <ConfirmationAction variant="outline">Reject</ConfirmationAction>
          <ConfirmationAction variant="default">Accept</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
  });

  it("shows when state is approval-requested", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationActions>
          <ConfirmationAction variant="outline">Reject</ConfirmationAction>
          <ConfirmationAction variant="default">Accept</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("calls onClick when accept button is clicked", async () => {
    const user = userEvent.setup();
    const handleAccept = vi.fn();
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationActions>
          <ConfirmationAction variant="outline">Reject</ConfirmationAction>
          <ConfirmationAction onClick={handleAccept} variant="default">
            Accept
          </ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );

    await user.click(screen.getByText("Accept"));
    expect(handleAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when reject button is clicked", async () => {
    const user = userEvent.setup();
    const handleReject = vi.fn();
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationActions>
          <ConfirmationAction onClick={handleReject} variant="outline">
            Reject
          </ConfirmationAction>
          <ConfirmationAction variant="default">Accept</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );

    await user.click(screen.getByText("Reject"));
    expect(handleReject).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when disabled prop is true", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationActions>
          <ConfirmationAction disabled variant="outline">
            Reject
          </ConfirmationAction>
          <ConfirmationAction disabled variant="default">
            Accept
          </ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );
    expect(screen.getByText("Accept")).toBeDisabled();
    expect(screen.getByText("Reject")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(
      <Confirmation approval={{ id: "test-id" }} state="approval-requested">
        <ConfirmationActions className="custom-class">
          <ConfirmationAction variant="outline">Reject</ConfirmationAction>
          <ConfirmationAction variant="default">Accept</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
    );
    const actionsContainer = screen.getByText("Accept").parentElement;
    expect(actionsContainer).toHaveClass("custom-class");
  });
});

describe("ConfirmationAccepted", () => {
  it("renders accepted status with icon", () => {
    render(
      <Confirmation
        approval={{ id: "test-id", approved: true }}
        state="approval-responded"
      >
        <ConfirmationRequest>Request</ConfirmationRequest>
        <ConfirmationAccepted>
          <CheckIcon className="size-4" />
          <span>Accepted</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>Rejected</ConfirmationRejected>
      </Confirmation>
    );
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });
});

describe("ConfirmationRejected", () => {
  it("renders rejected status with icon", () => {
    render(
      <Confirmation
        approval={{ id: "test-id", approved: false }}
        state="output-denied"
      >
        <ConfirmationRequest>Request</ConfirmationRequest>
        <ConfirmationAccepted>Accepted</ConfirmationAccepted>
        <ConfirmationRejected>
          <XIcon className="size-4" />
          <span>Rejected</span>
        </ConfirmationRejected>
      </Confirmation>
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });
});
