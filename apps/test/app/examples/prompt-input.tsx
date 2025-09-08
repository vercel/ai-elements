"use client";

import { Context } from "@repo/elements/context";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  useAttachments,
} from "@repo/elements/prompt-input";
import { GlobeIcon, MicIcon } from "lucide-react";
import { useState } from "react";

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

const context = {
  maxTokens: 500_000,
  usedTokens: 82_100,
};

const Example = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const handleSubmit = (message: PromptInputMessage) => {
    // Allow submission only if there is text or attachments
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    console.log('Submitting message:', message);

    setTimeout(() => {
      setStatus("streaming");
    }, 200);

    setTimeout(() => {
      setStatus("ready");
    }, 2000);
  };

  return (
    <PromptInput globalDrop multiple onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputAttachments />
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputButton>
            <MicIcon size={16} />
          </PromptInputButton>
          <PromptInputButton>
            <GlobeIcon size={16} />
            <span>Search</span>
          </PromptInputButton>
          <PromptInputModelSelect onValueChange={setModel} value={model}>
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {models.map((modelOption) => (
                <PromptInputModelSelectItem
                  key={modelOption.id}
                  value={modelOption.id}
                >
                  {modelOption.name}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
          <Context
            maxTokens={context.maxTokens}
            usedTokens={context.usedTokens}
          />
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputToolbar>
    </PromptInput>
  );
};

export default Example;
