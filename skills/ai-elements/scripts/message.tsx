"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
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
  MessageToolbar,
} from "@/components/ai-elements/message";
import {
  CopyIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { memo, useCallback, useState } from "react";

const messages: {
  key: string;
  from: "user" | "assistant";
  versions?: { id: string; content: string }[];
  content?: string;
  attachments?: {
    id: string;
    type: "file";
    url: string;
    mediaType?: string;
    filename?: string;
  }[];
}[] = [
  {
    attachments: [
      {
        filename: "palace-of-fine-arts.jpg",
        id: nanoid(),
        mediaType: "image/jpeg",
        type: "file",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      },
      {
        filename: "react-hooks-guide.pdf",
        id: nanoid(),
        mediaType: "application/pdf",
        type: "file",
        url: "",
      },
    ],
    content: "How do React hooks work and when should I use them?",
    from: "user",
    key: nanoid(),
  },
  {
    from: "assistant",
    key: nanoid(),
    versions: [
      {
        content: `# React Hooks Guide

React hooks are functions that let you "hook into" React state and lifecycle features from function components. Here's what you need to know:

## Core Hooks

### useState
Adds state to functional components:

\`\`\`jsx
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    Count: {count}
  </button>
);
\`\`\`

### useEffect
Handles side effects (data fetching, subscriptions, DOM updates):

\`\`\`jsx
useEffect(() => {
  document.title = \`You clicked \${count} times\`;

  // Cleanup function (optional)
  return () => {
    document.title = 'React App';
  };
}, [count]); // Dependency array
\`\`\`

## When to Use Hooks

- ✅ **Function components** - Hooks only work in function components
- ✅ **Replacing class components** - Modern React favors hooks over classes
- ✅ **Sharing stateful logic** - Create custom hooks to reuse logic
- ❌ **Class components** - Use lifecycle methods instead

## Rules of Hooks

1. Only call hooks at the **top level** (not inside loops, conditions, or nested functions)
2. Only call hooks from **React functions** (components or custom hooks)

Would you like to explore more advanced hooks like \`useCallback\` or \`useMemo\`?`,
        id: nanoid(),
      },
      {
        content: `React hooks are special functions that let you use React features in function components. The most common ones are:

- **useState** - for managing component state
- **useEffect** - for side effects like data fetching
- **useContext** - for consuming context values
- **useRef** - for accessing DOM elements

Here's a simple example:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

Which specific hook would you like to learn more about?`,
        id: nanoid(),
      },
      {
        content: `Absolutely! React hooks are a powerful feature introduced in React 16.8. They solve several problems:

## Key Benefits

1. **Simpler code** - No need for class components
2. **Reusable logic** - Extract stateful logic into custom hooks
3. **Better organization** - Group related code together

## Most Popular Hooks

| Hook | Purpose |
|------|---------|
| useState | Add state to components |
| useEffect | Handle side effects |
| useContext | Access context values |
| useReducer | Complex state logic |
| useCallback | Memoize functions |
| useMemo | Memoize values |

The beauty of hooks is that they let you reuse stateful logic without changing your component hierarchy. Want to dive into a specific hook?`,
        id: nanoid(),
      },
    ],
  },
];

const handleCopy = (content: string) => {
  navigator.clipboard.writeText(content);
};

const handleRetry = () => {
  console.log("Retrying...");
};

interface LikeActionProps {
  messageKey: string;
  isLiked: boolean;
  onToggle: (key: string) => void;
}

const LikeAction = memo(
  ({ messageKey, isLiked, onToggle }: LikeActionProps) => {
    const handleClick = useCallback(
      () => onToggle(messageKey),
      [messageKey, onToggle]
    );
    return (
      <MessageAction
        label="Like"
        onClick={handleClick}
        tooltip="Like this response"
      >
        <ThumbsUpIcon
          className="size-4"
          fill={isLiked ? "currentColor" : "none"}
        />
      </MessageAction>
    );
  }
);

LikeAction.displayName = "LikeAction";

interface DislikeActionProps {
  messageKey: string;
  isDisliked: boolean;
  onToggle: (key: string) => void;
}

const DislikeAction = memo(
  ({ messageKey, isDisliked, onToggle }: DislikeActionProps) => {
    const handleClick = useCallback(
      () => onToggle(messageKey),
      [messageKey, onToggle]
    );
    return (
      <MessageAction
        label="Dislike"
        onClick={handleClick}
        tooltip="Dislike this response"
      >
        <ThumbsDownIcon
          className="size-4"
          fill={isDisliked ? "currentColor" : "none"}
        />
      </MessageAction>
    );
  }
);

DislikeAction.displayName = "DislikeAction";

interface CopyActionProps {
  content: string;
}

const CopyAction = memo(({ content }: CopyActionProps) => {
  const handleClick = useCallback(() => handleCopy(content), [content]);
  return (
    <MessageAction
      label="Copy"
      onClick={handleClick}
      tooltip="Copy to clipboard"
    >
      <CopyIcon className="size-4" />
    </MessageAction>
  );
});

CopyAction.displayName = "CopyAction";

const Example = () => {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [disliked, setDisliked] = useState<Record<string, boolean>>({});

  const handleToggleLike = useCallback((key: string) => {
    setLiked((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleDislike = useCallback((key: string) => {
    setDisliked((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Demo component with complex rendering logic */}
      {messages.map((message) => (
        <Message from={message.from} key={message.key}>
          {message.versions?.length && message.versions.length > 1 ? (
            <MessageBranch defaultBranch={0} key={message.key}>
              <MessageBranchContent>
                {message.versions?.map((version) => (
                  <MessageContent key={version.id}>
                    <MessageResponse>{version.content}</MessageResponse>
                  </MessageContent>
                ))}
              </MessageBranchContent>
              {message.from === "assistant" && (
                <MessageToolbar>
                  <MessageBranchSelector>
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
                    <LikeAction
                      isLiked={liked[message.key] ?? false}
                      messageKey={message.key}
                      onToggle={handleToggleLike}
                    />
                    <DislikeAction
                      isDisliked={disliked[message.key] ?? false}
                      messageKey={message.key}
                      onToggle={handleToggleDislike}
                    />
                    <CopyAction
                      content={
                        message.versions?.find((v) => v.id)?.content || ""
                      }
                    />
                  </MessageActions>
                </MessageToolbar>
              )}
            </MessageBranch>
          ) : (
            <div key={message.key}>
              {message.attachments && message.attachments.length > 0 && (
                <Attachments className="mb-2" variant="grid">
                  {message.attachments.map((attachment) => (
                    <Attachment data={attachment} key={attachment.id}>
                      <AttachmentPreview />
                      <AttachmentRemove />
                    </Attachment>
                  ))}
                </Attachments>
              )}
              <MessageContent>
                {message.from === "assistant" ? (
                  <MessageResponse>{message.content}</MessageResponse>
                ) : (
                  message.content
                )}
              </MessageContent>
              {message.from === "assistant" && message.versions && (
                <MessageActions>
                  <MessageAction
                    label="Retry"
                    onClick={handleRetry}
                    tooltip="Regenerate response"
                  >
                    <RefreshCcwIcon className="size-4" />
                  </MessageAction>
                  <LikeAction
                    isLiked={liked[message.key] ?? false}
                    messageKey={message.key}
                    onToggle={handleToggleLike}
                  />
                  <DislikeAction
                    isDisliked={disliked[message.key] ?? false}
                    messageKey={message.key}
                    onToggle={handleToggleDislike}
                  />
                  <CopyAction content={message.content || ""} />
                </MessageActions>
              )}
            </div>
          )}
        </Message>
      ))}
    </div>
  );
};

export default Example;
