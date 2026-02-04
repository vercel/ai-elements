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
    avatar: "https://github.com/haydenbleasel.png",
    content: "Can you explain what the flat variant does?",
    from: "user",
    key: nanoid(),
    name: "Hayden Bleasel",
  },
  {
    avatar: "https://github.com/anthropics.png",
    content:
      "The flat variant provides a minimalist design for messages. User messages appear with subtle secondary colors and borders, while assistant messages display full-width without background padding. This creates a cleaner, more modern conversation interface similar to ChatGPT and other contemporary AI assistants.",
    from: "assistant",
    key: nanoid(),
    name: "Claude",
  },
  {
    avatar: "https://github.com/haydenbleasel.png",
    content:
      "That looks much cleaner! I like how it matches modern AI interfaces.",
    from: "user",
    key: nanoid(),
    name: "Hayden Bleasel",
  },
  {
    avatar: "https://github.com/anthropics.png",
    content:
      "Exactly! The flat variant is perfect when you want a more streamlined appearance that puts focus on the conversation content rather than visual containers. It works especially well in full-width layouts and professional applications.",
    from: "assistant",
    key: nanoid(),
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
