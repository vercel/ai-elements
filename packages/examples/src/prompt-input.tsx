"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@repo/elements/attachments";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@repo/elements/model-selector";
import type {
  PromptInputMessage,
  PromptInputSuggestionTrigger,
} from "@repo/elements/prompt-input";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSuggestionContent,
  PromptInputSuggestionEmpty,
  PromptInputSuggestionItem,
  PromptInputSuggestions,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputSuggestions,
} from "@repo/elements/prompt-input";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { memo, useCallback, useState } from "react";

const models = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o",
    name: "GPT-4o",
    providers: ["openai", "azure"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    providers: ["openai", "azure"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    providers: ["google"],
  },
];

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

interface PromptSuggestion {
  description: string;
  label: string;
  value: string;
}

const fileSuggestions: PromptSuggestion[] = [
  {
    description: "Prompt composer and suggestion primitives",
    label: "prompt-input.tsx",
    value: "packages/elements/src/prompt-input.tsx",
  },
  {
    description: "Conversation layout and scroll behavior",
    label: "conversation.tsx",
    value: "packages/elements/src/conversation.tsx",
  },
  {
    description: "Chat message rendering components",
    label: "message.tsx",
    value: "packages/elements/src/message.tsx",
  },
];

const commandSuggestions: PromptSuggestion[] = [
  {
    description: "Search project files and documentation",
    label: "Search",
    value: "search",
  },
  {
    description: "Summarize the current conversation",
    label: "Summarize",
    value: "summarize",
  },
  {
    description: "Explain the selected code or concept",
    label: "Explain",
    value: "explain",
  },
];

const suggestionTriggers = [
  { trigger: "@" },
  { startOfLine: true, trigger: "/" },
] satisfies readonly PromptInputSuggestionTrigger[];

interface AttachmentItemProps {
  attachment: {
    id: string;
    type: "file";
    filename?: string;
    mediaType?: string;
    url: string;
  };
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment data={attachment} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

interface ModelItemProps {
  m: (typeof models)[0];
  selectedModel: string;
  onSelect: (id: string) => void;
}

const ModelItem = memo(({ m, selectedModel, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id]);
  return (
    <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {m.providers.map((provider) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {selectedModel === m.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  );
});

ModelItem.displayName = "ModelItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments]
  );

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
};

const PromptInputSuggestionsDisplay = () => {
  const { match } = usePromptInputSuggestions();

  if (!match) {
    return null;
  }

  const suggestions =
    match.trigger === "@" ? fileSuggestions : commandSuggestions;
  const normalizedQuery = match.query.toLowerCase();
  const filteredSuggestions = suggestions.filter((suggestion) =>
    `${suggestion.label} ${suggestion.value} ${suggestion.description}`
      .toLowerCase()
      .includes(normalizedQuery)
  );
  const groupLabel = match.trigger === "@" ? "Files" : "Commands";

  return (
    <PromptInputSuggestionContent aria-label={`${groupLabel} suggestions`}>
      <div className="flex items-center justify-between px-2 py-1.5 text-muted-foreground text-xs">
        <span>{groupLabel}</span>
        <span>Use arrow keys to navigate</span>
      </div>
      {filteredSuggestions.length > 0 ? (
        filteredSuggestions.map((suggestion) => (
          <PromptInputSuggestionItem
            key={suggestion.value}
            value={suggestion.value}
          >
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-muted-foreground text-xs"
            >
              {match.trigger}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">
                {suggestion.label}
              </span>
              <span className="block truncate text-muted-foreground text-xs">
                {suggestion.description}
              </span>
            </span>
          </PromptInputSuggestionItem>
        ))
      ) : (
        <PromptInputSuggestionEmpty>
          No {groupLabel.toLowerCase()} found.
        </PromptInputSuggestionEmpty>
      )}
    </PromptInputSuggestionContent>
  );
};

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const selectedModelData = models.find((m) => m.id === model);

  const handleModelSelect = useCallback((id: string) => {
    setModel(id);
    setModelSelectorOpen(false);
  }, []);

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    // eslint-disable-next-line no-console
    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);
  }, []);

  return (
    <div className="size-full">
      <PromptInputProvider>
        <PromptInputSuggestions triggers={suggestionTriggers}>
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputAttachmentsDisplay />
            <PromptInputBody>
              <PromptInputTextarea placeholder="Ask anything, type @ for files or / for commands" />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                    <PromptInputActionAddScreenshot />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton>
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <ModelSelector
                  onOpenChange={setModelSelectorOpen}
                  open={modelSelectorOpen}
                >
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton>
                      {selectedModelData?.chefSlug && (
                        <ModelSelectorLogo
                          provider={selectedModelData.chefSlug}
                        />
                      )}
                      {selectedModelData?.name && (
                        <ModelSelectorName>
                          {selectedModelData.name}
                        </ModelSelectorName>
                      )}
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="Search models..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                      {["OpenAI", "Anthropic", "Google"].map((chef) => (
                        <ModelSelectorGroup heading={chef} key={chef}>
                          {models
                            .filter((m) => m.chef === chef)
                            .map((m) => (
                              <ModelItem
                                key={m.id}
                                m={m}
                                onSelect={handleModelSelect}
                                selectedModel={model}
                              />
                            ))}
                        </ModelSelectorGroup>
                      ))}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              </PromptInputTools>
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
          <PromptInputSuggestionsDisplay />
        </PromptInputSuggestions>
      </PromptInputProvider>
    </div>
  );
};

export default Example;
