"use client";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
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
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputProvider,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTab,
  PromptInputTabBody,
  PromptInputTabItem,
  PromptInputTabLabel,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@repo/elements/prompt-input";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { AtSignIcon, FilesIcon, GlobeIcon, RulerIcon } from "lucide-react";
import { useRef, useState } from "react";

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

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

const sampleFiles = {
  activeTabs: [{ path: "prompt-input.tsx", location: "packages/elements/src" }],
  recents: [
    { path: "queue.tsx", location: "apps/test/app/examples" },
    { path: "queue.tsx", location: "packages/elements/src" },
  ],
  added: [
    { path: "prompt-input.tsx", location: "packages/elements/src" },
    { path: "queue.tsx", location: "apps/test/app/examples" },
    { path: "queue.tsx", location: "packages/elements/src" },
  ],
  filesAndFolders: [
    { path: "prompt-input.tsx", location: "packages/elements/src" },
    { path: "queue.tsx", location: "apps/test/app/examples" },
  ],
  code: [{ path: "prompt-input.tsx", location: "packages/elements/src" }],
  docs: [{ path: "README.md", location: "packages/elements" }],
};

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

function HeaderControls() {
  const controller = usePromptInputController();
  return (
    <header className="mb-10">
      <h4 className="mb-4 text-sm">
        Header Controls via{" "}
        <code className="rounded-md bg-gray-100 p-1 font-bold">
          PromptInputProvider
        </code>
      </h4>
      <div className="mb-10 flex gap-2 rounded-md bg-gray-100 p-2">
        <Button
          onClick={() => {
            controller.textInput.clear();
          }}
          type="button"
        >
          clear input
        </Button>
        <Button
          onClick={() => {
            controller.textInput.setInput("Inserted via PromptInputProvider");
          }}
          type="button"
        >
          set input
        </Button>

        <Button
          onClick={() => {
            controller.attachments.clear();
          }}
          type="button"
        >
          clear attachments
        </Button>
      </div>
    </header>
  );
}

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);
  };

  return (
    <PromptInputProvider>
      <HeaderControls />
      <PromptInput globalDrop multiple onSubmit={handleSubmit}>
        <PromptInputHeader>
          <PromptInputHoverCard>
            <PromptInputHoverCardTrigger>
              <PromptInputButton size="icon-sm" variant="outline">
                <AtSignIcon className="text-muted-foreground" size={12} />
              </PromptInputButton>
            </PromptInputHoverCardTrigger>
            <PromptInputHoverCardContent className="w-[400px] p-0">
              <PromptInputCommand>
                <PromptInputCommandInput placeholder="Add files, folders, docs..." />
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
                    {sampleFiles.added.map((file, index) => (
                      <PromptInputCommandItem key={`${file.path}-${index}`}>
                        <GlobeIcon className="text-primary" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {file.path}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {file.location}
                          </span>
                        </div>
                      </PromptInputCommandItem>
                    ))}
                  </PromptInputCommandGroup>
                </PromptInputCommandList>
              </PromptInputCommand>
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
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea ref={textareaRef} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputSpeechButton textareaRef={textareaRef} />
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
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
};

export default Example;
