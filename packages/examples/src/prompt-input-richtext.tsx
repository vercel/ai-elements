"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputProvider,
  PromptInputRichtext,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/elements/prompt-input";
import { GlobeIcon, MicIcon, PaperclipIcon } from "lucide-react";

const handleSubmit = (message: PromptInputMessage) => {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("Submitting message:", message);
};

const Example = () => (
  <PromptInputProvider initialInput="This **input field** supports *richtext* via the [Lexical editor](https://lexical.dev/)">
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputRichtext />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton tooltip="Attach files">
            <PaperclipIcon size={16} />
          </PromptInputButton>
          <PromptInputButton
            tooltip={{ content: "Search the web", shortcut: "⌘K" }}
          >
            <GlobeIcon size={16} />
          </PromptInputButton>
          <PromptInputButton
            tooltip={{ content: "Voice input", shortcut: "⌘M", side: "bottom" }}
          >
            <MicIcon size={16} />
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  </PromptInputProvider>
);

export default Example;
