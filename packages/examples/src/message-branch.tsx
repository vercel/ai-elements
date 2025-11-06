"use client";

import {
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
} from "@repo/elements/message";
import { Message, MessageAvatar, MessageContent } from "@repo/elements/message";
import { nanoid } from "nanoid";

const userMessages = [
  {
    id: nanoid(),
    content: "What are the key strategies for optimizing React performance?",
  },
  {
    id: nanoid(),
    content: "How can I improve the performance of my React application?",
  },
  {
    id: nanoid(),
    content: "What performance optimization techniques should I use in React?",
  },
];

const assistantMessages = [
  {
    id: nanoid(),
    content:
      "Here's the first response to your question. This approach focuses on performance optimization.",
  },
  {
    id: nanoid(),
    content:
      "Here's an alternative response. This approach emphasizes code readability and maintainability over pure performance.",
  },
  {
    id: nanoid(),
    content:
      "And here's a third option. This balanced approach considers both performance and maintainability, making it suitable for most use cases.",
  },
];

const Example = () => {
  const handleBranchChange = (branchIndex: number) => {
    console.log("Branch changed to:", branchIndex);
  };

  return (
    <div style={{ height: "300px" }}>
      <MessageBranch defaultBranch={0} onBranchChange={handleBranchChange}>
        <MessageBranchContent>
          {userMessages.map((message) => (
            <Message from="user" key={message.id}>
              <MessageContent>{message.content}</MessageContent>
              <MessageAvatar
                name="Hayden Bleasel"
                src="https://github.com/haydenbleasel.png"
              />
            </Message>
          ))}
        </MessageBranchContent>
        <MessageBranchSelector from="user">
          <MessageBranchPrevious />
          <MessageBranchPage />
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>

      <MessageBranch defaultBranch={0} onBranchChange={handleBranchChange}>
        <MessageBranchContent>
          {assistantMessages.map((message) => (
            <Message from="assistant" key={message.id}>
              <MessageContent>{message.content}</MessageContent>
              <MessageAvatar name="AI" src="https://github.com/openai.png" />
            </Message>
          ))}
        </MessageBranchContent>
        <MessageBranchSelector from="assistant">
          <MessageBranchPrevious />
          <MessageBranchPage />
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageBranch>
    </div>
  );
};

export default Example;
