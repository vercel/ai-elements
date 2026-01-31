"use client";

import { Conversation, ConversationContent } from "@repo/elements/conversation";
import { Message, MessageContent } from "@repo/elements/message";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@repo/elements/prompt-input";
import { Suggestion, Suggestions } from "@repo/elements/suggestion";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@repo/elements/web-preview";
import { Spinner } from "@repo/shadcn-ui/components/ui/spinner";
import { nanoid } from "nanoid";
import { useState } from "react";

interface Chat {
  id: string;
  demo: string;
}

const mockChatHistory = [
  {
    id: "1",
    type: "user" as const,
    content: "Build me an agent skills website with a modern dark theme",
  },
  {
    id: "2",
    type: "assistant" as const,
    content:
      "I'll create a sleek agent skills website with a dark theme. The design will feature a clean layout showcasing various AI agent capabilities with smooth animations.",
  },
  {
    id: "3",
    type: "user" as const,
    content: "Add a hero section with a catchy tagline about AI skills",
  },
  {
    id: "4",
    type: "assistant" as const,
    content:
      "Done! I've added a hero section with the tagline 'Supercharge your AI agents with powerful skills'. The section includes a gradient background and animated elements.",
  },
  {
    id: "5",
    type: "user" as const,
    content:
      "Can you add a grid of skill cards showing different capabilities?",
  },
  {
    id: "6",
    type: "assistant" as const,
    content:
      "I've added a skills grid featuring cards for Web Search, Code Execution, File Management, API Integration, and more. Each card has an icon and description. Check the preview!",
  },
];

const mockChat: Chat = {
  id: "mock-chat-1",
  demo: "https://skills.sh/",
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState<Chat | null>(mockChat);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] =
    useState<
      Array<{
        id: string;
        type: "user" | "assistant";
        content: string;
      }>
    >(mockChatHistory);

  const handleSendMessage = async (promptMessage: PromptInputMessage) => {
    const hasText = Boolean(promptMessage.text);
    const hasAttachments = Boolean(promptMessage.files?.length);

    if (!(hasText || hasAttachments) || isLoading) {
      return;
    }

    const userMessage = promptMessage.text?.trim() || "Sent with attachments";
    setMessage("");
    setIsLoading(true);

    setChatHistory((prev) => [
      ...prev,
      { id: nanoid(), type: "user", content: userMessage },
    ]);

    try {
      const response = await fetch("/api/v0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: currentChat?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const chat: Chat = await response.json();
      setCurrentChat(chat);

      setChatHistory((prev) => [
        ...prev,
        {
          id: nanoid(),
          type: "assistant",
          content: "Generated new app preview. Check the preview panel!",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          id: nanoid(),
          type: "assistant",
          content:
            "Sorry, there was an error creating your app. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex size-full divide-x">
      {/* Chat Panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {chatHistory.length === 0 ? (
            <div className="mt-8 text-center font-semibold">
              <p className="mt-4 text-3xl">What can we build together?</p>
            </div>
          ) : (
            <>
              <Conversation>
                <ConversationContent>
                  {chatHistory.map((msg) => (
                    <Message from={msg.type} key={msg.id}>
                      <MessageContent>{msg.content}</MessageContent>
                    </Message>
                  ))}
                </ConversationContent>
              </Conversation>
              {isLoading && (
                <Message from="assistant">
                  <MessageContent>
                    <p className="flex items-center gap-2">
                      <Spinner />
                      Creating your app...
                    </p>
                  </MessageContent>
                </Message>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          {!currentChat && (
            <Suggestions>
              <Suggestion
                onClick={() =>
                  setMessage("Create a responsive navbar with Tailwind CSS")
                }
                suggestion="Create a responsive navbar with Tailwind CSS"
              />
              <Suggestion
                onClick={() => setMessage("Build a todo app with React")}
                suggestion="Build a todo app with React"
              />
              <Suggestion
                onClick={() =>
                  setMessage("Make a landing page for a coffee shop")
                }
                suggestion="Make a landing page for a coffee shop"
              />
            </Suggestions>
          )}
          <div className="flex gap-2">
            <PromptInput
              className="relative mx-auto w-full max-w-2xl"
              onSubmit={handleSendMessage}
            >
              <PromptInputTextarea
                className="min-h-[60px] pr-12"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <PromptInputSubmit
                className="absolute right-1 bottom-1"
                disabled={!message}
                status={isLoading ? "streaming" : "ready"}
              />
            </PromptInput>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex flex-1 flex-col">
        <WebPreview className="rounded-none border-0">
          <WebPreviewNavigation>
            <WebPreviewUrl
              placeholder="Your app here..."
              value={currentChat?.demo}
            />
          </WebPreviewNavigation>
          <WebPreviewBody src={currentChat?.demo} />
        </WebPreview>
      </div>
    </div>
  );
}
