import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Message, MessageContent } from "../src/message";

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
