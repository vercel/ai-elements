"use client";

import { useChat } from "@ai-sdk/react";
import { StaticChatTransport } from "@loremllm/transport";
import { useEffect, useRef } from "react";

import {
  getLastUserMessageText,
  mockMessages,
  mockResponses,
  scriptedUserMessages,
} from "./demo-chat-data";

// Shared transport for all demos
export const demoTransport = new StaticChatTransport({
  chunkDelayMs: [20, 50],
  async *mockResponse({ messages }) {
    const lastUserMessageText = getLastUserMessageText(messages);

    // Check for predefined response
    const assistantParts = mockMessages.get(lastUserMessageText);
    if (assistantParts) {
      for (const part of assistantParts) yield part;
      return;
    }

    // Fallback to random response
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
});

// Hook for demo chat with auto-initialization and scripted flow
export function useDemoChat(chatId: string) {
  const { messages, sendMessage, setMessages, status } = useChat({
    id: chatId,
    transport: demoTransport,
    onFinish: ({ messages }) => {
      // Auto-send next scripted message only if current was part of script
      const lastText = getLastUserMessageText(messages);
      const currentIndex = scriptedUserMessages.indexOf(lastText);

      // Don't auto-continue for non-scripted messages (e.g., suggestions)
      if (currentIndex === -1) return;

      const nextIndex = currentIndex + 1;
      if (nextIndex < scriptedUserMessages.length) {
        sendMessage({ text: scriptedUserMessages[nextIndex] });
      }
    },
  });

  // Track initialization to avoid double-firing in strict mode
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    demoTransport.clearCache(chatId);
    setMessages([]);
    if (scriptedUserMessages.length > 0) {
      sendMessage({ text: scriptedUserMessages[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { messages, sendMessage, status };
}
