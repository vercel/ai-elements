"use client";

import type { QuestionResponse } from "@repo/elements/question";

import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionInput,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "@repo/elements/question";
import { useState } from "react";

const Example = () => {
  const [response, setResponse] = useState<QuestionResponse>();

  if (response) {
    const selected = response.selectedValues.join(", ");
    const summary = [selected, response.text].filter(Boolean).join(" — ");

    return (
      <div className="w-full max-w-2xl rounded-lg border bg-background p-4 text-sm">
        <span className="text-muted-foreground">Answered: </span>
        {summary}
      </div>
    );
  }

  return (
    <Question
      className="w-full max-w-2xl"
      onSubmit={setResponse}
      selectionMode="multiple"
    >
      <div className="space-y-1">
        <QuestionPrompt>What should the project include?</QuestionPrompt>
        <QuestionDescription>
          Choose any features and add details if needed.
        </QuestionDescription>
      </div>
      <QuestionOptions aria-label="Project features">
        <QuestionOption value="authentication">Authentication</QuestionOption>
        <QuestionOption value="database">Database</QuestionOption>
        <QuestionOption value="payments">Payments</QuestionOption>
      </QuestionOptions>
      <QuestionInput
        aria-label="Additional requirements"
        placeholder="Add any other requirements…"
      />
      <QuestionActions>
        <QuestionSubmit>Answer</QuestionSubmit>
      </QuestionActions>
    </Question>
  );
};

export default Example;
