import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Choice,
  ChoiceOption,
  ChoiceOptions,
  ChoiceQuestion,
  ChoiceStatus,
  ChoiceSubmit,
} from "../src/choice";

describe("choice", () => {
  it("renders a labelled options group", () => {
    render(
      <Choice>
        <ChoiceQuestion>What should we focus on?</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="crime">Crime</ChoiceOption>
          <ChoiceOption value="events">Events</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    expect(
      screen.getByRole("group", { name: "What should we focus on?" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crime" })).toBeInTheDocument();
  });

  it("selects one option in single mode and auto-submits by default", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <Choice onSubmit={onSubmit} onValueChange={onValueChange}>
        <ChoiceQuestion>Pick one</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="high">High priority</ChoiceOption>
          <ChoiceOption value="low">Low priority</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    const high = screen.getByRole("button", { name: "High priority" });
    await user.click(high);

    expect(onValueChange).toHaveBeenCalledWith("high");
    expect(onSubmit).toHaveBeenCalledWith("high");
    expect(high).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles options in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Choice multiple onValueChange={onValueChange}>
        <ChoiceQuestion>Select all that apply</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="alerts">Alerts</ChoiceOption>
          <ChoiceOption value="permits">Permits</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    const alerts = screen.getByRole("button", { name: "Alerts" });
    const permits = screen.getByRole("button", { name: "Permits" });

    await user.click(alerts);
    await user.click(permits);
    await user.click(alerts);

    expect(onValueChange).toHaveBeenNthCalledWith(1, ["alerts"]);
    expect(onValueChange).toHaveBeenNthCalledWith(2, ["alerts", "permits"]);
    expect(onValueChange).toHaveBeenNthCalledWith(3, ["permits"]);
    expect(alerts).toHaveAttribute("aria-pressed", "false");
    expect(permits).toHaveAttribute("aria-pressed", "true");
  });

  it("submits selected values via ChoiceSubmit in multiple mode", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <Choice multiple onSubmit={onSubmit} submitOnSelect={false}>
        <ChoiceQuestion>Select categories</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="events">Events</ChoiceOption>
          <ChoiceOption value="news">News</ChoiceOption>
        </ChoiceOptions>
        <ChoiceSubmit />
      </Choice>
    );

    const submit = screen.getByRole("button", { name: "Confirm (0)" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Events" }));
    expect(screen.getByRole("button", { name: "Confirm (1)" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Confirm (1)" }));
    expect(onSubmit).toHaveBeenCalledWith(["events"]);
  });

  it("prevents interactions when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <Choice disabled onSubmit={onSubmit} onValueChange={onValueChange}>
        <ChoiceQuestion>Disabled question</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="crime">Crime</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    const button = screen.getByRole("button", { name: "Crime" });
    expect(button).toBeDisabled();
    await user.click(button);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("choiceStatus", () => {
  it("renders error status as an alert", () => {
    render(<ChoiceStatus status="error">Unable to submit</ChoiceStatus>);
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to submit");
  });

  it("renders info status as a status region", () => {
    render(<ChoiceStatus status="info">Awaiting your response</ChoiceStatus>);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Awaiting your response"
    );
  });
});
