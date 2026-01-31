"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@repo/elements/conversation";
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@repo/elements/message";
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
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@repo/elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@repo/elements/sources";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@repo/elements/tool";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui/components/ui/dropdown-menu";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  AudioWaveformIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  FileIcon,
  ImageIcon,
  LightbulbIcon,
  PaperclipIcon,
  ScreenShareIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { categorizeMessageParts, getMessageVersions } from "./demo-chat-data";
import { useDemoChat } from "./demo-chat-shared";

const models = [
  {
    id: "grok-3",
    name: "Grok-3",
    chef: "xAI",
    chefSlug: "xai",
    providers: ["xai"],
  },
  {
    id: "grok-2-1212",
    name: "Grok-2-1212",
    chef: "xAI",
    chefSlug: "xai",
    providers: ["xai"],
  },
];

const Example = () => {
  const [model, setModel] = useState(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState("");

  const { messages, sendMessage } = useDemoChat("demo-grok");
  const selectedModelData = models.find((m) => m.id === model);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage({ text: message.text || "Sent with attachments" });
    setText("");
  };

  const handleFileAction = (action: string) => {
    toast.success("File action", {
      description: action,
    });
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden bg-secondary">
      <Conversation>
        <ConversationContent>
          {messages.map((message) => {
            const { sources, reasoning, tools, text } = categorizeMessageParts(message.parts);
            const messageText = text[0]?.text ?? "";

            // Check if user message has alternative versions
            if (message.role === "user") {
              const versions = getMessageVersions(messageText);
              if (versions) {
                return (
                  <MessageBranch defaultBranch={versions.indexOf(messageText)} key={message.id}>
                    <MessageBranchContent>
                      {versions.map((version, i) => (
                        <Message from="user" key={`${message.id}-v${i}`}>
                          <MessageContent className="rounded-[24px] rounded-br-sm border bg-background text-foreground">
                            <MessageResponse>{version}</MessageResponse>
                          </MessageContent>
                        </Message>
                      ))}
                    </MessageBranchContent>
                    <MessageBranchSelector className="ml-auto" from="user">
                      <MessageBranchPrevious />
                      <MessageBranchPage />
                      <MessageBranchNext />
                    </MessageBranchSelector>
                  </MessageBranch>
                );
              }
            }

            return (
              <Message from={message.role} key={message.id}>
                <div>
                  {sources.length > 0 && (
                    <Sources>
                      <SourcesTrigger count={sources.length} />
                      <SourcesContent>
                        {sources.map((source, i) => (
                          <Source
                            href={source.url}
                            key={`${message.id}-source-${i}`}
                            title={source.title || source.url}
                          />
                        ))}
                      </SourcesContent>
                    </Sources>
                  )}
                  {tools.map((tool, i) => (
                    <Tool
                      defaultOpen={
                        tool.state === "output-available" ||
                        tool.state === "output-error"
                      }
                      key={`${message.id}-tool-${i}`}
                    >
                      <ToolHeader state={tool.state} type={tool.type} />
                      <ToolContent>
                        <ToolInput input={tool.input} />
                        <ToolOutput
                          errorText={tool.errorText}
                          output={tool.output}
                        />
                      </ToolContent>
                    </Tool>
                  ))}
                  {reasoning.map((part, i) => (
                    <Reasoning
                      isStreaming={part.state === "streaming"}
                      key={`${message.id}-reasoning-${i}`}
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  ))}
                  {text.map((part, i) => (
                    <MessageContent
                      className={cn(
                        "group-[.is-user]:rounded-[24px] group-[.is-user]:rounded-br-sm group-[.is-user]:border group-[.is-user]:bg-background group-[.is-user]:text-foreground",
                        "group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:text-foreground",
                      )}
                      key={`${message.id}-text-${i}`}
                    >
                      <MessageResponse>{part.text}</MessageResponse>
                    </MessageContent>
                  ))}
                </div>
              </Message>
            );
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 p-4">
        <PromptInput
          className="divide-y-0 rounded-[28px]"
          onSubmit={handleSubmit}
        >
          <PromptInputTextarea
            className="px-5 md:text-base"
            onChange={(event) => setText(event.target.value)}
            placeholder="How can Grok help?"
            value={text}
          />
          <PromptInputFooter className="p-2.5">
            <PromptInputTools>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PromptInputButton
                    className="!rounded-full border text-foreground"
                    variant="outline"
                  >
                    <PaperclipIcon size={16} />
                    <span className="sr-only">Attach</span>
                  </PromptInputButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleFileAction("upload-file")}
                  >
                    <FileIcon className="mr-2" size={16} />
                    Upload file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("upload-photo")}
                  >
                    <ImageIcon className="mr-2" size={16} />
                    Upload photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("take-screenshot")}
                  >
                    <ScreenShareIcon className="mr-2" size={16} />
                    Take screenshot
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("take-photo")}
                  >
                    <CameraIcon className="mr-2" size={16} />
                    Take photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center rounded-full border">
                <PromptInputButton
                  className="!rounded-l-full text-foreground"
                  variant="ghost"
                >
                  <SearchIcon size={16} />
                  <span>DeepSearch</span>
                </PromptInputButton>
                <div className="h-full w-px bg-border" />
                <PromptInputButton
                  className="rounded-r-full"
                  size="icon-sm"
                  variant="ghost"
                >
                  <ChevronDownIcon size={16} />
                </PromptInputButton>
              </div>
              <PromptInputButton
                className="!rounded-full text-foreground"
                variant="outline"
              >
                <LightbulbIcon size={16} />
                <span>Think</span>
              </PromptInputButton>
            </PromptInputTools>
            <div className="flex items-center gap-2">
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
                    <ModelSelectorGroup heading="xAI">
                      {models.map((m) => (
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
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
              <PromptInputButton
                className="rounded-full bg-foreground font-medium text-background"
                variant="default"
              >
                <AudioWaveformIcon size={16} />
                <span className="sr-only">Voice</span>
              </PromptInputButton>
            </div>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default Example;
