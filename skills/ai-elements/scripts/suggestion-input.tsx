"use client";

import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { memo, useCallback, useState } from "react";

const suggestions: { key: string; value: string }[] = [
  { key: nanoid(), value: "What are the latest trends in AI?" },
  { key: nanoid(), value: "How does machine learning work?" },
  { key: nanoid(), value: "Explain quantum computing" },
  { key: nanoid(), value: "Best practices for React development" },
  { key: nanoid(), value: "Tell me about TypeScript benefits" },
  { key: nanoid(), value: "How to optimize database queries?" },
  { key: nanoid(), value: "What is the difference between SQL and NoSQL?" },
  { key: nanoid(), value: "Explain cloud computing basics" },
];

const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

const handleSubmit = (message: PromptInputMessage) => {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) {
    return;
  }

  console.log("Submitted message:", message.text || "Sent with attachments");
  console.log("Attached files:", message.files);
};

interface SuggestionItemProps {
  suggestion: { key: string; value: string };
  onSuggestionClick: (value: string) => void;
}

const SuggestionItem = memo(
  ({ suggestion, onSuggestionClick }: SuggestionItemProps) => {
    const handleClick = useCallback(
      () => onSuggestionClick(suggestion.value),
      [onSuggestionClick, suggestion.value]
    );
    return (
      <Suggestion
        key={suggestion.key}
        onClick={handleClick}
        suggestion={suggestion.value}
      />
    );
  }
);

SuggestionItem.displayName = "SuggestionItem";

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [text, setText] = useState<string>("");

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setText(suggestion);
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
    []
  );

  return (
    <div className="grid gap-4">
      <Suggestions>
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.key}
            onSuggestionClick={handleSuggestionClick}
            suggestion={suggestion}
          />
        ))}
      </Suggestions>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          onChange={handleTextChange}
          placeholder="Ask me about anything..."
          value={text}
        />
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton>
              <PlusIcon size={16} />
            </PromptInputButton>
            <PromptInputButton>
              <MicIcon size={16} />
            </PromptInputButton>
            <PromptInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputSelect onValueChange={setModel} value={model}>
              <PromptInputSelectTrigger>
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {models.map((model) => (
                  <PromptInputSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit>
            <SendIcon size={16} />
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default Example;
