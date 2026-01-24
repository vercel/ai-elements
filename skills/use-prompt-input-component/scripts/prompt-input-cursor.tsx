"use client";

import {
  Attachment,
  type AttachmentData,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@repo/elements/attachments";
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
} from "@repo/elements/prompt-input";
import type { SourceDocumentUIPart } from "ai";
import { AtSignIcon, FilesIcon, GlobeIcon, RulerIcon } from "lucide-react";
import { useState } from "react";

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
];

const sampleTabs = {
  active: [{ path: "packages/elements/src/task-queue-panel.tsx" }],
  recents: [
    { path: "apps/test/app/examples/task-queue-panel.tsx" },
    { path: "apps/test/app/page.tsx" },
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
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

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
                <PromptInputButton size="icon-sm" variant="outline">
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
                </div>
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
              </PromptInputHoverCardContent>
            </PromptInputHoverCard>
            <PromptInputAttachmentsDisplay />
            <PromptInputReferencedSourcesDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Plan, search, build anything" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit status={status} />
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
