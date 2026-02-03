"use client";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessageSquareIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const messages: {
  key: string;
  content: string;
  role: "user" | "assistant";
}[] = [
  {
    key: nanoid(),
    content: "Hello, how are you?",
    role: "user",
  },
  {
    key: nanoid(),
    content: "I'm good, thank you! How can I assist you today?",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "I'm looking for information about your services.",
    role: "user",
  },
  {
    key: nanoid(),
    content:
      "Sure! We offer a variety of AI solutions. What are you interested in?",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "I'm interested in natural language processing tools.",
    role: "user",
  },
  {
    key: nanoid(),
    content: "Great choice! We have several NLP APIs. Would you like a demo?",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "Yes, a demo would be helpful.",
    role: "user",
  },
  {
    key: nanoid(),
    content: "Alright, I can show you a sentiment analysis example. Ready?",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "Yes, please proceed.",
    role: "user",
  },
  {
    key: nanoid(),
    content: "Here is a sample: 'I love this product!' → Positive sentiment.",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "Impressive! Can it handle multiple languages?",
    role: "user",
  },
  {
    key: nanoid(),
    content: "Absolutely, our models support over 20 languages.",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "How do I get started with the API?",
    role: "user",
  },
  {
    key: nanoid(),
    content: "You can sign up on our website and get an API key instantly.",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "Is there a free trial available?",
    role: "user",
  },
  {
    key: nanoid(),
    content: "Yes, we offer a 14-day free trial with full access.",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "What kind of support do you provide?",
    role: "user",
  },
  {
    key: nanoid(),
    content: "We provide 24/7 chat and email support for all users.",
    role: "assistant",
  },
  {
    key: nanoid(),
    content: "Thank you for the information!",
    role: "user",
  },
  {
    key: nanoid(),
    content: "You're welcome! Let me know if you have any more questions.",
    role: "assistant",
  },
];

const Example = () => {
  const [visibleMessages, setVisibleMessages] = useState<
    {
      key: string;
      content: string;
      role: "user" | "assistant";
    }[]
  >([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < messages.length && messages[currentIndex]) {
        const currentMessage = messages[currentIndex];
        setVisibleMessages((prev) => [
          ...prev,
          {
            key: currentMessage.key,
            content: currentMessage.content,
            role: currentMessage.role,
          },
        ]);
        currentIndex += 1;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Conversation className="relative size-full">
      <ConversationContent>
        {visibleMessages.length === 0 ? (
          <ConversationEmptyState
            description="Messages will appear here as the conversation progresses."
            icon={<MessageSquareIcon className="size-6" />}
            title="Start a conversation"
          />
        ) : (
          visibleMessages.map(({ key, content, role }) => (
            <Message from={role} key={key}>
              <MessageContent>{content}</MessageContent>
            </Message>
          ))
        )}
      </ConversationContent>
      <ConversationDownload messages={visibleMessages} />
      <ConversationScrollButton />
    </Conversation>
  );
};

export default Example;
