"use client";

import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { nanoid } from "nanoid";
import { Fragment, memo, useCallback, useState } from "react";

interface MessageType {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: MessageType[] = [
  {
    content: "What is React?",
    id: nanoid(),
    role: "user",
  },
  {
    content:
      "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.",
    id: nanoid(),
    role: "assistant",
  },
  {
    content: "How does component state work?",
    id: nanoid(),
    role: "user",
  },
];

interface CheckpointItemProps {
  checkpoint: { messageCount: number; timestamp: Date };
  onRestore: (messageCount: number) => void;
}

const CheckpointItem = memo(
  ({ checkpoint, onRestore }: CheckpointItemProps) => {
    const handleClick = useCallback(
      () => onRestore(checkpoint.messageCount),
      [onRestore, checkpoint.messageCount]
    );
    return (
      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger
          onClick={handleClick}
          tooltip="Restores workspace and chat to this point"
        >
          Restore checkpoint
        </CheckpointTrigger>
      </Checkpoint>
    );
  }
);

CheckpointItem.displayName = "CheckpointItem";

const Example = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [checkpoints] = useState([
    { messageCount: 2, timestamp: new Date(Date.now() - 3_600_000) },
  ]);

  const handleRestore = useCallback((messageCount: number) => {
    setMessages(initialMessages.slice(0, messageCount));
  }, []);

  return (
    <div className="flex size-full flex-col rounded-lg border p-6">
      <Conversation>
        <ConversationContent>
          {messages.map((message, index) => {
            const checkpoint = checkpoints.find(
              (cp) => cp.messageCount === index + 1
            );

            return (
              <Fragment key={message.id}>
                <Message from={message.role}>
                  <MessageContent>
                    <MessageResponse>{message.content}</MessageResponse>
                  </MessageContent>
                </Message>
                {checkpoint && (
                  <CheckpointItem
                    checkpoint={checkpoint}
                    onRestore={handleRestore}
                  />
                )}
              </Fragment>
            );
          })}
        </ConversationContent>
      </Conversation>
    </div>
  );
};

export default Example;
