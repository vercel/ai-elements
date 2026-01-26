"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@repo/elements/conversation";
import { Message, MessageContent } from "@repo/elements/message";
import { MessageSquareIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const messages: { key: string; value: string; from: "user" | "assistant" }[] = [
  {
    key: nanoid(),
    value: "Hello, how are you?",
    from: "user",
  },
  {
    key: nanoid(),
    value: "I'm good, thank you! How can I assist you today?",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "I'm looking for information about your services.",
    from: "user",
  },
  {
    key: nanoid(),
    value:
      "Sure! We offer a variety of AI solutions. What are you interested in?",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "I'm interested in natural language processing tools.",
    from: "user",
  },
  {
    key: nanoid(),
    value: "Great choice! We have several NLP APIs. Would you like a demo?",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "Yes, a demo would be helpful.",
    from: "user",
  },
  {
    key: nanoid(),
    value: "Alright, I can show you a sentiment analysis example. Ready?",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "Yes, please proceed.",
    from: "user",
  },
  {
    key: nanoid(),
    value: "Here is a sample: 'I love this product!' → Positive sentiment.",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "Impressive! Can it handle multiple languages?",
    from: "user",
  },
  {
    key: nanoid(),
    value: "Absolutely, our models support over 20 languages.",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "How do I get started with the API?",
    from: "user",
  },
  {
    key: nanoid(),
    value: "You can sign up on our website and get an API key instantly.",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "Is there a free trial available?",
    from: "user",
  },
  {
    key: nanoid(),
    value: "Yes, we offer a 14-day free trial with full access.",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "What kind of support do you provide?",
    from: "user",
  },
  {
    key: nanoid(),
    value: "We provide 24/7 chat and email support for all users.",
    from: "assistant",
  },
  {
    key: nanoid(),
    value: "Thank you for the information!",
    from: "user",
  },
  {
    key: nanoid(),
    value: "You're welcome! Let me know if you have any more questions.",
    from: "assistant",
  },
];

const Example = () => {
  const [visibleMessages, setVisibleMessages] = useState<
    {
      key: string;
      value: string;
      from: "user" | "assistant";
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
            value: currentMessage.value,
            from: currentMessage.from,
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
          visibleMessages.map(({ key, value, from }) => (
            <Message from={from} key={key}>
              <MessageContent>{value}</MessageContent>
            </Message>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export default Example;
