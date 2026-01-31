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
import { Suggestion, Suggestions } from "@repo/elements/suggestion";
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
  FileIcon,
  GlobeIcon,
  ImageIcon,
  PaperclipIcon,
  ScreenShareIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { categorizeMessageParts, getMessageVersions, suggestions } from "./demo-chat-data";
import { useDemoChat } from "./demo-chat-shared";

const Example = () => {
  const [text, setText] = useState("");

  const { messages, sendMessage } = useDemoChat("demo-chatgpt");

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

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
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
                          <MessageContent className="rounded-[24px] bg-secondary text-foreground">
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
                        "group-[.is-user]:rounded-[24px] group-[.is-user]:bg-secondary group-[.is-user]:text-foreground",
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
            placeholder="Ask anything"
            value={text}
          />
          <PromptInputFooter className="p-2.5">
            <PromptInputTools>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PromptInputButton
                    className="!rounded-full border font-medium"
                    variant="outline"
                  >
                    <PaperclipIcon size={16} />
                    <span>Attach</span>
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
              <PromptInputButton
                className="rounded-full border font-medium"
                variant="outline"
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputButton
              className="rounded-full font-medium text-foreground"
              variant="secondary"
            >
              <AudioWaveformIcon size={16} />
              <span>Voice</span>
            </PromptInputButton>
          </PromptInputFooter>
        </PromptInput>
        <Suggestions className="px-4">
          {suggestions.map(({ icon: Icon, text, color }) => (
            <Suggestion
              className="font-normal"
              key={text}
              onClick={() => handleSuggestionClick(text)}
              suggestion={text}
            >
              {Icon && <Icon size={16} style={{ color }} />}
              {text}
            </Suggestion>
          ))}
        </Suggestions>
      </div>
    </div>
  );
};

export default Example;
