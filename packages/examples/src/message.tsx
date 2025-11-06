"use client";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@repo/elements/message";
import {
  CopyIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";

const messages: {
  key: string;
  from: "user" | "assistant";
  versions?: { id: string; content: string }[];
  content?: string;
}[] = [
  {
    key: nanoid(),
    from: "user",
    content: "Can you help me with React hooks?",
  },
  {
    key: nanoid(),
    from: "assistant",
    versions: [
      {
        id: nanoid(),
        content: `React hooks are functions that let you use state and other React features in functional components e.g.

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\``,
      },
      {
        id: nanoid(),
        content: "Yes, which hooks would you like to know more about?",
      },
    ],
  },
];

const Example = () => {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [disliked, setDisliked] = useState<Record<string, boolean>>({});

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRetry = () => {
    console.log("Retrying...");
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        // Message with branches
        if (message.versions && message.versions.length > 1) {
          return (
            <MessageBranch defaultBranch={0} key={message.key}>
              <MessageBranchContent>
                {message.versions.map((version) => (
                  <Message from={message.from} key={version.id}>
                    <MessageContent>
                      <MessageResponse>{version.content}</MessageResponse>
                    </MessageContent>
                  </Message>
                ))}
              </MessageBranchContent>
              {message.from === "assistant" && (
                <div className="flex items-center gap-4">
                  <MessageBranchSelector from={message.from}>
                    <MessageBranchPrevious />
                    <MessageBranchPage />
                    <MessageBranchNext />
                  </MessageBranchSelector>
                  <MessageActions>
                    <MessageAction
                      label="Retry"
                      onClick={handleRetry}
                      tooltip="Regenerate response"
                    >
                      <RefreshCcwIcon className="size-4" />
                    </MessageAction>
                    <MessageAction
                      label="Like"
                      onClick={() =>
                        setLiked((prev) => ({
                          ...prev,
                          [message.key]: !prev[message.key],
                        }))
                      }
                      tooltip="Like this response"
                    >
                      <ThumbsUpIcon
                        className="size-4"
                        fill={liked[message.key] ? "currentColor" : "none"}
                      />
                    </MessageAction>
                    <MessageAction
                      label="Dislike"
                      onClick={() =>
                        setDisliked((prev) => ({
                          ...prev,
                          [message.key]: !prev[message.key],
                        }))
                      }
                      tooltip="Dislike this response"
                    >
                      <ThumbsDownIcon
                        className="size-4"
                        fill={disliked[message.key] ? "currentColor" : "none"}
                      />
                    </MessageAction>
                    <MessageAction
                      label="Copy"
                      onClick={() =>
                        handleCopy(
                          message.versions?.find((v) => v.id)?.content || ""
                        )
                      }
                      tooltip="Copy to clipboard"
                    >
                      <CopyIcon className="size-4" />
                    </MessageAction>
                  </MessageActions>
                </div>
              )}
            </MessageBranch>
          );
        }

        // Message with single version
        const singleVersion = message.versions?.[0];
        const content = singleVersion?.content || message.content || "";

        return (
          <div key={message.key}>
            <Message from={message.from}>
              <MessageContent>
                {message.from === "assistant" ? (
                  <MessageResponse>{content}</MessageResponse>
                ) : (
                  content
                )}
              </MessageContent>
            </Message>
            {message.from === "assistant" && message.versions && (
              <MessageActions>
                <MessageAction
                  label="Retry"
                  onClick={handleRetry}
                  tooltip="Regenerate response"
                >
                  <RefreshCcwIcon className="size-4" />
                </MessageAction>
                <MessageAction
                  label="Like"
                  onClick={() =>
                    setLiked((prev) => ({
                      ...prev,
                      [message.key]: !prev[message.key],
                    }))
                  }
                  tooltip="Like this response"
                >
                  <ThumbsUpIcon
                    className="size-4"
                    fill={liked[message.key] ? "currentColor" : "none"}
                  />
                </MessageAction>
                <MessageAction
                  label="Dislike"
                  onClick={() =>
                    setDisliked((prev) => ({
                      ...prev,
                      [message.key]: !prev[message.key],
                    }))
                  }
                  tooltip="Dislike this response"
                >
                  <ThumbsDownIcon
                    className="size-4"
                    fill={disliked[message.key] ? "currentColor" : "none"}
                  />
                </MessageAction>
                <MessageAction
                  label="Copy"
                  onClick={() => handleCopy(content)}
                  tooltip="Copy to clipboard"
                >
                  <CopyIcon className="size-4" />
                </MessageAction>
              </MessageActions>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Example;
