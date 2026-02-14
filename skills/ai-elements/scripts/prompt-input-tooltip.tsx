"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { GlobeIcon, MicIcon, PaperclipIcon } from "lucide-react";

const handleSubmit = () => {
  // Handle submit
};

const Example = () => (
  <PromptInput onSubmit={handleSubmit}>
    <PromptInputBody>
      <PromptInputTextarea />
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
);

export default Example;
