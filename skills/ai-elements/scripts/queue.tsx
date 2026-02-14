"use client";

import type { QueueMessage, QueueTodo } from "@/components/ai-elements/queue";

import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemImage,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/ai-elements/queue";
import { ArrowUp, Trash2 } from "lucide-react";
import { memo, useCallback, useState } from "react";

const sampleMessages: QueueMessage[] = [
  {
    id: "msg-1",
    parts: [{ text: "How do I set up the project?", type: "text" }],
  },
  {
    id: "msg-2",
    parts: [{ text: "What is the roadmap for Q4?", type: "text" }],
  },
  {
    id: "msg-3",
    parts: [
      { text: "Update the default logo to this png.", type: "text" },
      {
        filename: "setup-guide.png",
        mediaType: "image/png",
        type: "file",
        url: "https://github.com/haydenbleasel.png",
      },
    ],
  },
  {
    id: "msg-4",
    parts: [{ text: "Please generate a changelog.", type: "text" }],
  },
  {
    id: "msg-5",
    parts: [{ text: "Add dark mode support.", type: "text" }],
  },
  {
    id: "msg-6",
    parts: [{ text: "Optimize database queries.", type: "text" }],
  },
  {
    id: "msg-7",
    parts: [{ text: "Set up CI/CD pipeline.", type: "text" }],
  },
];

const sampleTodos: QueueTodo[] = [
  {
    description: "Complete the README and API docs",
    id: "todo-1",
    status: "completed",
    title: "Write project documentation",
  },
  {
    id: "todo-2",
    status: "pending",
    title: "Implement authentication",
  },
  {
    description: "Resolve crash on settings page",
    id: "todo-3",
    status: "pending",
    title: "Fix bug #42",
  },
  {
    description: "Unify queue and todo state management",
    id: "todo-4",
    status: "pending",
    title: "Refactor queue logic",
  },
  {
    description: "Increase test coverage for hooks",
    id: "todo-5",
    status: "pending",
    title: "Add unit tests",
  },
];

interface MessageActionsProps {
  messageId: string;
  onRemove: (e: React.MouseEvent, id: string) => void;
  onSend: (e: React.MouseEvent, id: string) => void;
}

const MessageActions = memo(
  ({ messageId, onRemove, onSend }: MessageActionsProps) => {
    const handleRemove = useCallback(
      (e: React.MouseEvent) => onRemove(e, messageId),
      [onRemove, messageId]
    );
    const handleSend = useCallback(
      (e: React.MouseEvent) => onSend(e, messageId),
      [onSend, messageId]
    );
    return (
      <QueueItemActions>
        <QueueItemAction
          aria-label="Remove from queue"
          onClick={handleRemove}
          title="Remove from queue"
        >
          <Trash2 size={12} />
        </QueueItemAction>
        <QueueItemAction aria-label="Send now" onClick={handleSend}>
          <ArrowUp size={14} />
        </QueueItemAction>
      </QueueItemActions>
    );
  }
);

MessageActions.displayName = "MessageActions";

interface TodoItemProps {
  todo: QueueTodo;
  onRemove: (id: string) => void;
}

const TodoItem = memo(({ todo, onRemove }: TodoItemProps) => {
  const isCompleted = todo.status === "completed";
  const handleRemove = useCallback(
    () => onRemove(todo.id),
    [onRemove, todo.id]
  );

  return (
    <QueueItem key={todo.id}>
      <div className="flex items-center gap-2">
        <QueueItemIndicator completed={isCompleted} />
        <QueueItemContent completed={isCompleted}>
          {todo.title}
        </QueueItemContent>
        <QueueItemActions>
          <QueueItemAction aria-label="Remove todo" onClick={handleRemove}>
            <Trash2 size={12} />
          </QueueItemAction>
        </QueueItemActions>
      </div>
      {todo.description && (
        <QueueItemDescription completed={isCompleted}>
          {todo.description}
        </QueueItemDescription>
      )}
    </QueueItem>
  );
});

TodoItem.displayName = "TodoItem";

const Example = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [todos, setTodos] = useState(sampleTodos);

  const handleRemoveMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const handleRemoveTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const handleSendNow = useCallback((id: string) => {
    console.log("Send now:", id);
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const handleMessageRemove = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      handleRemoveMessage(id);
    },
    [handleRemoveMessage]
  );

  const handleMessageSend = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      handleSendNow(id);
    },
    [handleSendNow]
  );

  if (messages.length === 0 && todos.length === 0) {
    return null;
  }

  return (
    <Queue>
      {messages.length > 0 && (
        <QueueSection>
          <QueueSectionTrigger>
            <QueueSectionLabel count={messages.length} label="Queued" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              {messages.map((message) => {
                const summary = (() => {
                  const textParts = message.parts.filter(
                    (p) => p.type === "text"
                  );
                  const text = textParts
                    .map((p) => p.text)
                    .join(" ")
                    .trim();
                  return text || "(queued message)";
                })();

                const hasFiles = message.parts.some(
                  (p) => p.type === "file" && p.url
                );

                return (
                  <QueueItem key={message.id}>
                    <div className="flex items-center gap-2">
                      <QueueItemIndicator />
                      <QueueItemContent>{summary}</QueueItemContent>
                      <MessageActions
                        messageId={message.id}
                        onRemove={handleMessageRemove}
                        onSend={handleMessageSend}
                      />
                    </div>
                    {hasFiles && (
                      <QueueItemAttachment>
                        {message.parts
                          .filter((p) => p.type === "file" && p.url)
                          .map((file) => {
                            if (
                              file.mediaType?.startsWith("image/") &&
                              file.url
                            ) {
                              return (
                                <QueueItemImage
                                  alt={file.filename || "attachment"}
                                  key={file.url}
                                  src={file.url}
                                />
                              );
                            }
                            return (
                              <QueueItemFile key={file.url}>
                                {file.filename || "file"}
                              </QueueItemFile>
                            );
                          })}
                      </QueueItemAttachment>
                    )}
                  </QueueItem>
                );
              })}
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      )}
      {todos.length > 0 && (
        <QueueSection>
          <QueueSectionTrigger>
            <QueueSectionLabel count={todos.length} label="Todo" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  onRemove={handleRemoveTodo}
                  todo={todo}
                />
              ))}
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      )}
    </Queue>
  );
};

export default Example;
