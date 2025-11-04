"use client";

import { useChat } from "@ai-sdk/react";
import { StaticChatTransport } from "@loremllm/transport";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@repo/elements/conversation";
import { Message, MessageAvatar, MessageContent } from "@repo/elements/message";
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
  PromptInputSubmit,
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
  ArrowUpIcon,
  CameraIcon,
  FileIcon,
  ImageIcon,
  PlusIcon,
  ScreenShareIcon,
  Settings2Icon,
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
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku" },
];

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [text, setText] = useState<string>("");

  const { messages, sendMessage, status } = useChat({
    id: "demo-claude",
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
    initialMessages: [],
    onFinish: ({ messages }) => {
      // When the last message is the first demo message, send the last demo message
      const lastUserMessageText = getLastUserMessageText(messages);
      if (lastUserMessageText === userMessageTexts[0]) {
        sendMessage({ text: userMessageTexts[userMessageTexts.length - 1] });
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
    <div className="relative flex size-full flex-col divide-y overflow-hidden bg-[#faf9f5] dark:bg-background">
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
                        "group-[.is-user]:bg-[#f0eee6] group-[.is-user]:text-foreground dark:group-[.is-user]:bg-muted",
                        "group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:font-serif group-[.is-assistant]:text-foreground"
                      )}
                      key={`${message.id}-text-${i}`}
                    >
                      <div className="flex gap-2">
                        {message.role === "user" && (
                          <MessageAvatar
                            className="size-7"
                            name="User"
                            src="https://github.com/haydenbleasel.png"
                          />
                        )}
                        <div className="mt-1 w-full">
                          <Response>{textPart.text}</Response>
                        </div>
                      </div>
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
              <PromptInputModelSelect onValueChange={setModel} value={model}>
                <PromptInputModelSelectTrigger className="font-serif">
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent className="font-serif">
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
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
