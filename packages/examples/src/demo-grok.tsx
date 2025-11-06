"use client";

import { useChat } from "@ai-sdk/react";
import { StaticChatTransport } from "@loremllm/transport";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@repo/elements/conversation";
import { Message, MessageContent } from "@repo/elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@repo/elements/reasoning";
import { Response } from "@repo/elements/response";
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
import type { ToolUIPart } from "ai";
import {
  AudioWaveformIcon,
  CameraIcon,
  ChevronDownIcon,
  FileIcon,
  ImageIcon,
  LightbulbIcon,
  PaperclipIcon,
  ScreenShareIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getLastUserMessageText,
  mockMessages,
  mockResponses,
  userMessageTexts,
} from "./demo-chat-data";

const models = [
  { id: "grok-3", name: "Grok-3" },
  { id: "grok-2-1212", name: "Grok-2-1212" },
];

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

  const { messages, sendMessage } = useChat({
    id: "demo-grok",
    transport: new StaticChatTransport({
      chunkDelayMs: [20, 50],
      async *mockResponse({ messages }) {
        const lastUserMessageText = getLastUserMessageText(messages);

        // If we already have a mock response for the user message:
        const assistantParts = mockMessages.get(lastUserMessageText);
        if (assistantParts) {
          for (const part of assistantParts) yield part;
          return;
        }

        // Default response for user messages that aren't structurally defined
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];

        if (Math.random() > 0.5) {
          yield {
            type: "reasoning",
            text: "Let me think about this question carefully. I need to provide a comprehensive and helpful response that addresses the user's needs while being clear and concise.",
          };
        }

        yield {
          type: "text",
          text: randomResponse,
        };
      },
    }),
    onFinish: ({ messages }) => {
      // When finishing a message, send the next message in the list if it exists
      const lastUserMessageText = getLastUserMessageText(messages);
      const lastUserMessageTextIndex = userMessageTexts.indexOf(lastUserMessageText);
      const nextMessageTextIndex = lastUserMessageTextIndex !== -1 ? lastUserMessageTextIndex + 1 : null;
      if (nextMessageTextIndex !== null && userMessageTexts[nextMessageTextIndex]) {
        sendMessage({ text: userMessageTexts[nextMessageTextIndex] });
      }
    },
  });

  // Initialize with first user message
  useEffect(() => {
    if (messages.length === 0 && userMessageTexts.length > 0) {
      sendMessage({ text: userMessageTexts[0] });
    }
  }, [messages.length, sendMessage, userMessageTexts]);

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
            const sources = message.parts.filter(
              (p) => p.type === "source-url"
            );
            const reasoningParts = message.parts.filter(
              (p) => p.type === "reasoning"
            );
            const toolParts = message.parts.filter((p) =>
              p.type.startsWith("tool-")
            );
            const textParts = message.parts.filter((p) => p.type === "text");

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
                  {toolParts.map((toolPart, i) => {
                    if (toolPart.type.startsWith("tool-")) {
                      const tool = toolPart as ToolUIPart;
                      return (
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
                      );
                    }
                    return null;
                  })}
                  {reasoningParts.map((reasoningPart, i) => (
                    <Reasoning
                      isStreaming={reasoningPart.state === "streaming"}
                      key={`${message.id}-reasoning-${i}`}
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>{reasoningPart.text}</ReasoningContent>
                    </Reasoning>
                  ))}
                  {textParts.map((textPart, i) => (
                    <MessageContent
                      className={cn(
                        "group-[.is-user]:rounded-[24px] group-[.is-user]:rounded-br-sm group-[.is-user]:border group-[.is-user]:bg-background group-[.is-user]:text-foreground",
                        "group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:text-foreground"
                      )}
                      key={`${message.id}-text-${i}`}
                    >
                      <Response>{textPart.text}</Response>
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
                  onClick={() => setUseWebSearch(!useWebSearch)}
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
              <PromptInputModelSelect onValueChange={setModel} value={model}>
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
              <PromptInputButton
                className="rounded-full bg-foreground font-medium text-background"
                onClick={() => setUseMicrophone(!useMicrophone)}
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
