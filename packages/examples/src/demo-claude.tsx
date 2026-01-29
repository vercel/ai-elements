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
  PromptInputSubmit,
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
  ArrowUpIcon,
  CameraIcon,
  CheckIcon,
  FileIcon,
  ImageIcon,
  PlusIcon,
  ScreenShareIcon,
  Settings2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { categorizeMessageParts, getMessageVersions } from "./demo-chat-data";
import { useDemoChat } from "./demo-chat-shared";

const models = [
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
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
];

const Example = () => {
  const [model, setModel] = useState(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState("");

  const { messages, sendMessage, status } = useDemoChat("demo-claude");
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
    <div className="relative flex size-full flex-col divide-y overflow-hidden bg-[#faf9f5] dark:bg-background">
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
                        <Message
                          className="flex-row-reverse"
                          from="user"
                          key={`${message.id}-v${i}`}
                        >
                          <MessageContent className="bg-[#f0eee6] text-foreground dark:bg-muted">
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
              <Message
                className={message.role === "user" ? "flex-row-reverse" : ""}
                from={message.role}
                key={message.id}
              >
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
                        "group-[.is-user]:bg-[#f0eee6] group-[.is-user]:text-foreground dark:group-[.is-user]:bg-muted",
                        "group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:font-serif group-[.is-assistant]:text-foreground",
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
          className="divide-y-0 overflow-hidden rounded-md bg-card"
          onSubmit={handleSubmit}
        >
          <PromptInputTextarea
            className="md:text-base"
            onChange={(event) => setText(event.target.value)}
            placeholder="Reply to Claude..."
            value={text}
          />
          <PromptInputFooter>
            <PromptInputTools>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PromptInputButton variant="outline">
                    <PlusIcon size={16} />
                    <span className="sr-only">Add attachment</span>
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
              <PromptInputButton variant="outline">
                <Settings2Icon size={16} />
                <span className="sr-only">Settings</span>
              </PromptInputButton>
            </PromptInputTools>
            <div className="flex items-center gap-2">
              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="font-serif">
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
                <ModelSelectorContent className="font-serif">
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    <ModelSelectorGroup heading="Anthropic">
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
              <PromptInputSubmit
                className="bg-[#c96442]"
                disabled={!text.trim() || status === "streaming"}
                status={status}
              >
                <ArrowUpIcon size={16} />
              </PromptInputSubmit>
            </div>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default Example;
