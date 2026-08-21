import type { FormEvent } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  Question,
  QuestionInput,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "../src/question";

describe("question", () => {
  it("submits one selected option", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <Question onSubmit={handleSubmit}>
        <QuestionPrompt>Where should we deploy?</QuestionPrompt>
        <QuestionOptions>
          <QuestionOption value="iad1">Washington, D.C.</QuestionOption>
          <QuestionOption value="sfo1">San Francisco</QuestionOption>
        </QuestionOptions>
        <QuestionSubmit />
      </Question>
    );

    await user.click(screen.getByRole("radio", { name: "San Francisco" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        selectedValues: ["sfo1"],
        text: undefined,
      },
      expect.anything()
    );
  });

  it("replaces the selected option in single selection mode", async () => {
    const user = userEvent.setup();

    render(
      <Question>
        <QuestionOptions>
          <QuestionOption value="one">One</QuestionOption>
          <QuestionOption value="two">Two</QuestionOption>
        </QuestionOptions>
      </Question>
    );

    const first = screen.getByRole("radio", { name: "One" });
    const second = screen.getByRole("radio", { name: "Two" });
    await user.click(first);
    await user.click(second);

    expect(first).toHaveAttribute("aria-checked", "false");
    expect(second).toHaveAttribute("aria-checked", "true");
  });

  it("submits multiple selected options", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <Question onSubmit={handleSubmit} selectionMode="multiple">
        <QuestionOptions aria-label="Features">
          <QuestionOption value="search">Search</QuestionOption>
          <QuestionOption value="export">Export</QuestionOption>
        </QuestionOptions>
        <QuestionSubmit>Continue</QuestionSubmit>
      </Question>
    );

    await user.click(screen.getByRole("checkbox", { name: "Search" }));
    await user.click(screen.getByRole("checkbox", { name: "Export" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        selectedValues: ["search", "export"],
        text: undefined,
      },
      expect.anything()
    );
  });

  it("submits a trimmed freeform response", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <Question onSubmit={handleSubmit}>
        <QuestionInput aria-label="Answer" />
        <QuestionSubmit />
      </Question>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Answer" }),
      "  My project  "
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        selectedValues: [],
        text: "My project",
      },
      expect.anything()
    );
  });

  it("submits selected options and freeform text together", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <Question onSubmit={handleSubmit} selectionMode="multiple">
        <QuestionOptions>
          <QuestionOption value="typescript">TypeScript</QuestionOption>
        </QuestionOptions>
        <QuestionInput aria-label="Other requirements" />
        <QuestionSubmit />
      </Question>
    );

    await user.click(screen.getByRole("checkbox", { name: "TypeScript" }));
    await user.type(
      screen.getByRole("textbox", { name: "Other requirements" }),
      "Include tests"
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        selectedValues: ["typescript"],
        text: "Include tests",
      },
      expect.anything()
    );
  });

  it("disables submission until a response is present", async () => {
    const user = userEvent.setup();

    render(
      <Question>
        <QuestionInput aria-label="Answer" />
        <QuestionSubmit />
      </Question>
    );

    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeDisabled();

    await user.type(screen.getByRole("textbox", { name: "Answer" }), "Answer");
    expect(submit).toBeEnabled();
  });

  it("passes the form event through and supports async submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn(
      async (_response, event: FormEvent<HTMLFormElement>) => {
        expect(event.currentTarget).toHaveAttribute("data-question", "example");
        await Promise.resolve();
      }
    );

    render(
      <Question data-question="example" onSubmit={handleSubmit}>
        <QuestionInput aria-label="Answer" />
        <QuestionSubmit />
      </Question>
    );

    await user.type(screen.getByRole("textbox", { name: "Answer" }), "Answer");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  it("reports value changes", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Question onValueChange={handleValueChange}>
        <QuestionOptions>
          <QuestionOption value="yes">Yes</QuestionOption>
        </QuestionOptions>
      </Question>
    );

    await user.click(screen.getByRole("radio", { name: "Yes" }));

    expect(handleValueChange).toHaveBeenCalledWith({
      selectedValues: ["yes"],
      text: "",
    });
  });
});
