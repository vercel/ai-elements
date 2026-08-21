"use client";

import type { QuestionResponse } from "@repo/elements/question";

import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionInput,
  QuestionPrompt,
  QuestionSubmit,
} from "@repo/elements/question";
import { useCallback, useState } from "react";

const Example = () => {
  const [answer, setAnswer] = useState<string>();
  const handleSubmit = useCallback(({ text }: QuestionResponse) => {
    setAnswer(text);
  }, []);

  if (answer) {
    return (
      <div className="w-full max-w-2xl rounded-lg border bg-background p-4 text-sm">
        <span className="text-muted-foreground">Answered: </span>
        {answer}
      </div>
    );
  }

  return (
    <Question className="w-full max-w-2xl" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <QuestionPrompt>What should we name the project?</QuestionPrompt>
        <QuestionDescription>
          Enter a short, memorable name.
        </QuestionDescription>
      </div>
      <QuestionInput aria-label="Project name" placeholder="Project name…" />
      <QuestionActions>
        <QuestionSubmit>Answer</QuestionSubmit>
      </QuestionActions>
    </Question>
  );
};

export default Example;
