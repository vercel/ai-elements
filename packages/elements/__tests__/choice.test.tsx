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
        <ChoiceQuestion>How detailed should the response be?</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="brief">Brief</ChoiceOption>
          <ChoiceOption value="detailed">Detailed</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    expect(
      screen.getByRole("group", {
        name: "How detailed should the response be?",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Brief" })).toBeInTheDocument();
  });

  it("selects one option in single mode and auto-submits by default", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <Choice onSubmit={onSubmit} onValueChange={onValueChange}>
        <ChoiceQuestion>Pick one</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="brief">Brief</ChoiceOption>
          <ChoiceOption value="detailed">Detailed</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    const brief = screen.getByRole("button", { name: "Brief" });
    await user.click(brief);

    expect(onValueChange).toHaveBeenCalledWith("brief");
    expect(onSubmit).toHaveBeenCalledWith("brief");
    expect(brief).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles options in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Choice multiple onValueChange={onValueChange}>
        <ChoiceQuestion>Select all that apply</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="key-points">Key points</ChoiceOption>
          <ChoiceOption value="sources">Sources</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    const keyPoints = screen.getByRole("button", { name: "Key points" });
    const sources = screen.getByRole("button", { name: "Sources" });

    await user.click(keyPoints);
    await user.click(sources);
    await user.click(keyPoints);

    expect(onValueChange).toHaveBeenNthCalledWith(1, ["key-points"]);
    expect(onValueChange).toHaveBeenNthCalledWith(2, [
      "key-points",
      "sources",
    ]);
    expect(onValueChange).toHaveBeenNthCalledWith(3, ["sources"]);
    expect(keyPoints).toHaveAttribute("aria-pressed", "false");
    expect(sources).toHaveAttribute("aria-pressed", "true");
  });

  it("submits selected values via ChoiceSubmit in multiple mode", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <Choice multiple onSubmit={onSubmit} submitOnSelect={false}>
        <ChoiceQuestion>What should the summary include?</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="key-points">Key points</ChoiceOption>
          <ChoiceOption value="sources">Sources</ChoiceOption>
        </ChoiceOptions>
        <ChoiceSubmit />
      </Choice>
    );

    const submit = screen.getByRole("button", { name: "Confirm (0)" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Key points" }));
    expect(screen.getByRole("button", { name: "Confirm (1)" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Confirm (1)" }));
    expect(onSubmit).toHaveBeenCalledWith(["key-points"]);
  });

  it("prevents interactions when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <Choice disabled onSubmit={onSubmit} onValueChange={onValueChange}>
        <ChoiceQuestion>Pick a format</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption value="brief">Brief</ChoiceOption>
        </ChoiceOptions>
      </Choice>
    );

    const button = screen.getByRole("button", { name: "Brief" });
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
