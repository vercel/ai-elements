"use client";

import {
  Attachment,
  type AttachmentData,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
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
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputCommand,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandInput,
  PromptInputCommandItem,
  PromptInputCommandList,
  PromptInputCommandSeparator,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputHoverCard,
  PromptInputHoverCardContent,
  PromptInputHoverCardTrigger,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTab,
  PromptInputTabBody,
  PromptInputTabItem,
  PromptInputTabLabel,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputReferencedSources,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import type { SourceDocumentUIPart } from "ai";
import {
  AtSignIcon,
  CheckIcon,
  FilesIcon,
  GlobeIcon,
  ImageIcon,
  RulerIcon,
} from "lucide-react";
import { useState } from "react";

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
  },
];

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

const sampleSources: SourceDocumentUIPart[] = [
  {
    type: "source-document",
    sourceId: "1",
    title: "prompt-input.tsx",
    filename: "packages/elements/src",
    mediaType: "text/plain",
  },
  {
    type: "source-document",
    sourceId: "2",
    title: "queue.tsx",
    filename: "apps/test/app/examples",
    mediaType: "text/plain",
  },
  {
    type: "source-document",
    sourceId: "3",
    title: "queue.tsx",
    filename: "packages/elements/src",
    mediaType: "text/plain",
  },
];

const sampleTabs = {
  active: [{ path: "packages/elements/src/task-queue-panel.tsx" }],
  recents: [
    { path: "apps/test/app/examples/task-queue-panel.tsx" },
    { path: "apps/test/app/page.tsx" },
    { path: "packages/elements/src/task.tsx" },
    { path: "apps/test/app/examples/prompt-input.tsx" },
    { path: "packages/elements/src/queue.tsx" },
    { path: "apps/test/app/examples/queue.tsx" },
  ],
};

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const PromptInputReferencedSourcesDisplay = () => {
  const refs = usePromptInputReferencedSources();

  if (refs.sources.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {refs.sources.map((source) => (
        <Attachment
          data={source as AttachmentData}
          key={source.id}
          onRemove={() => refs.remove(source.id)}
        >
          <AttachmentPreview />
          <AttachmentInfo />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const selectedModelData = models.find((m) => m.id === model);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);
  };

  return (
    <div className="flex size-full flex-col justify-end">
      <PromptInputProvider>
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputHeader>
            <PromptInputHoverCard>
              <PromptInputHoverCardTrigger>
                <PromptInputButton
                  className="h-8!"
                  size="icon-sm"
                  variant="outline"
                >
                  <AtSignIcon className="text-muted-foreground" size={12} />
                </PromptInputButton>
              </PromptInputHoverCardTrigger>
              <PromptInputHoverCardContent className="w-[400px] p-0">
                <SampleFilesMenu />
              </PromptInputHoverCardContent>
            </PromptInputHoverCard>
            <PromptInputHoverCard>
              <PromptInputHoverCardTrigger>
                <PromptInputButton size="sm" variant="outline">
                  <RulerIcon className="text-muted-foreground" size={12} />
                  <span>1</span>
                </PromptInputButton>
              </PromptInputHoverCardTrigger>
              <PromptInputHoverCardContent className="divide-y overflow-hidden p-0">
                <div className="space-y-2 p-3">
                  <p className="font-medium text-muted-foreground text-sm">
                    Attached Project Rules
                  </p>
                  <p className="ml-4 text-muted-foreground text-sm">
                    Always Apply:
                  </p>
                  <p className="ml-8 text-sm">ultracite.mdc</p>
                </div>
                <p className="bg-sidebar px-4 py-3 text-muted-foreground text-sm">
                  Click to manage
                </p>
              </PromptInputHoverCardContent>
            </PromptInputHoverCard>
            <PromptInputHoverCard>
              <PromptInputHoverCardTrigger>
                <PromptInputButton size="sm" variant="outline">
                  <FilesIcon className="text-muted-foreground" size={12} />
                  <span>1 Tab</span>
                </PromptInputButton>
              </PromptInputHoverCardTrigger>
              <PromptInputHoverCardContent className="w-[300px] space-y-4 px-0 py-3">
                <PromptInputTab>
                  <PromptInputTabLabel>Active Tabs</PromptInputTabLabel>
                  <PromptInputTabBody>
                    {sampleTabs.active.map((tab) => (
                      <PromptInputTabItem key={tab.path}>
                        <GlobeIcon className="text-primary" size={16} />
                        <span className="truncate" dir="rtl">
                          {tab.path}
                        </span>
                      </PromptInputTabItem>
                    ))}
                  </PromptInputTabBody>
                </PromptInputTab>
                <PromptInputTab>
                  <PromptInputTabLabel>Recents</PromptInputTabLabel>
                  <PromptInputTabBody>
                    {sampleTabs.recents.map((tab) => (
                      <PromptInputTabItem key={tab.path}>
                        <GlobeIcon className="text-primary" size={16} />
                        <span className="truncate" dir="rtl">
                          {tab.path}
                        </span>
                      </PromptInputTabItem>
                    ))}
                  </PromptInputTabBody>
                </PromptInputTab>
                <div className="border-t px-3 pt-2 text-muted-foreground text-xs">
                  Only file paths are included
                </div>
              </PromptInputHoverCardContent>
            </PromptInputHoverCard>
            <PromptInputAttachmentsDisplay />
            <PromptInputReferencedSourcesDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Plan, search, build anything" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
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
                            <ModelSelectorItem
                              key={m.id}
                              onSelect={() => {
                                setModel(m.id);
                                setModelSelectorOpen(false);
                              }}
                              value={m.id}
                            >
                              <ModelSelectorLogo provider={m.chefSlug} />
                              <ModelSelectorName>{m.name}</ModelSelectorName>
                              <ModelSelectorLogoGroup>
                                {m.providers.map((provider) => (
                                  <ModelSelectorLogo
                                    key={provider}
                                    provider={provider}
                                  />
                                ))}
                              </ModelSelectorLogoGroup>
                              {model === m.id ? (
                                <CheckIcon className="ml-auto size-4" />
                              ) : (
                                <div className="ml-auto size-4" />
                              )}
                            </ModelSelectorItem>
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <div className="flex items-center gap-2">
              <Button size="icon-sm" variant="ghost">
                <ImageIcon className="text-muted-foreground" size={16} />
              </Button>
              <PromptInputSubmit className="!h-8" status={status} />
            </div>
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
};

export default Example;

const SampleFilesMenu = () => {
  const refs = usePromptInputReferencedSources();

  const handleAdd = (source: SourceDocumentUIPart) => {
    refs.add(source);
  };

  return (
    <PromptInputCommand>
      <PromptInputCommandInput
        className="border-none focus-visible:ring-0"
        placeholder="Add files, folders, docs..."
      />
      <PromptInputCommandList>
        <PromptInputCommandEmpty className="p-3 text-muted-foreground text-sm">
          No results found.
        </PromptInputCommandEmpty>
        <PromptInputCommandGroup heading="Added">
          <PromptInputCommandItem>
            <GlobeIcon />
            <span>Active Tabs</span>
            <span className="ml-auto text-muted-foreground">✓</span>
          </PromptInputCommandItem>
        </PromptInputCommandGroup>
        <PromptInputCommandSeparator />
        <PromptInputCommandGroup heading="Other Files">
          {sampleSources
            .filter(
              (source) =>
                !refs.sources.some(
                  (s) =>
                    s.title === source.title && s.filename === source.filename
                )
            )
            .map((source, index) => (
              <PromptInputCommandItem
                key={`${source.title}-${index}`}
                onSelect={() => handleAdd(source)}
              >
                <GlobeIcon className="text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{source.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {source.filename}
                  </span>
                </div>
              </PromptInputCommandItem>
            ))}
        </PromptInputCommandGroup>
      </PromptInputCommandList>
    </PromptInputCommand>
  );
};
