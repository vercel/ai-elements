"use client";

import { Message, MessageContent } from "@/components/ai-elements/message";
import { nanoid } from "nanoid";

const messages: {
  key: string;
  from: "user" | "assistant";
  content: string;
  avatar: string;
  name: string;
}[] = [
  {
    key: nanoid(),
    from: "user",
    content: "Can you explain what the flat variant does?",
    avatar: "https://github.com/haydenbleasel.png",
    name: "Hayden Bleasel",
  },
  {
    key: nanoid(),
    from: "assistant",
    content:
      "The flat variant provides a minimalist design for messages. User messages appear with subtle secondary colors and borders, while assistant messages display full-width without background padding. This creates a cleaner, more modern conversation interface similar to ChatGPT and other contemporary AI assistants.",
    avatar: "https://github.com/anthropics.png",
    name: "Claude",
  },
  {
    key: nanoid(),
    from: "user",
    content:
      "That looks much cleaner! I like how it matches modern AI interfaces.",
    avatar: "https://github.com/haydenbleasel.png",
    name: "Hayden Bleasel",
  },
  {
    key: nanoid(),
    from: "assistant",
    content:
      "Exactly! The flat variant is perfect when you want a more streamlined appearance that puts focus on the conversation content rather than visual containers. It works especially well in full-width layouts and professional applications.",
    avatar: "https://github.com/anthropics.png",
    name: "Claude",
  },
];

const Example = () => (
  <div className="space-y-2">
    {messages.map(({ content, ...message }) => (
      <Message from={message.from} key={message.key}>
        <MessageContent variant="flat">{content}</MessageContent>
      </Message>
    ))}
  </div>
);

export default Example;
