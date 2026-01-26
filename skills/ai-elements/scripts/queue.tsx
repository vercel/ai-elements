"use client";

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
  type QueueMessage,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
  type QueueTodo,
} from "@/components/ai-elements/queue";
import { ArrowUp, Trash2 } from "lucide-react";
import { useState } from "react";

const sampleMessages: QueueMessage[] = [
  {
    id: "msg-1",
    parts: [{ type: "text", text: "How do I set up the project?" }],
  },
  {
    id: "msg-2",
    parts: [{ type: "text", text: "What is the roadmap for Q4?" }],
  },
  {
    id: "msg-3",
    parts: [
      { type: "text", text: "Update the default logo to this png." },
      {
        type: "file",
        url: "https://github.com/haydenbleasel.png",
        filename: "setup-guide.png",
        mediaType: "image/png",
      },
    ],
  },
  {
    id: "msg-4",
    parts: [{ type: "text", text: "Please generate a changelog." }],
  },
  {
    id: "msg-5",
    parts: [{ type: "text", text: "Add dark mode support." }],
  },
  {
    id: "msg-6",
    parts: [{ type: "text", text: "Optimize database queries." }],
  },
  {
    id: "msg-7",
    parts: [{ type: "text", text: "Set up CI/CD pipeline." }],
  },
];

const sampleTodos: QueueTodo[] = [
  {
    id: "todo-1",
    title: "Write project documentation",
    description: "Complete the README and API docs",
    status: "completed",
  },
  {
    id: "todo-2",
    title: "Implement authentication",
    status: "pending",
  },
  {
    id: "todo-3",
    title: "Fix bug #42",
    description: "Resolve crash on settings page",
    status: "pending",
  },
  {
    id: "todo-4",
    title: "Refactor queue logic",
    description: "Unify queue and todo state management",
    status: "pending",
  },
  {
    id: "todo-5",
    title: "Add unit tests",
    description: "Increase test coverage for hooks",
    status: "pending",
  },
];

const Example = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [todos, setTodos] = useState(sampleTodos);

  const handleRemoveMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleRemoveTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleSendNow = (id: string) => {
    console.log("Send now:", id);
    handleRemoveMessage(id);
  };

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
                      <QueueItemActions>
                        <QueueItemAction
                          aria-label="Remove from queue"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveMessage(message.id);
                          }}
                          title="Remove from queue"
                        >
                          <Trash2 size={12} />
                        </QueueItemAction>
                        <QueueItemAction
                          aria-label="Send now"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSendNow(message.id);
                          }}
                        >
                          <ArrowUp size={14} />
                        </QueueItemAction>
                      </QueueItemActions>
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
              {todos.map((todo) => {
                const isCompleted = todo.status === "completed";

                return (
                  <QueueItem key={todo.id}>
                    <div className="flex items-center gap-2">
                      <QueueItemIndicator completed={isCompleted} />
                      <QueueItemContent completed={isCompleted}>
                        {todo.title}
                      </QueueItemContent>
                      <QueueItemActions>
                        <QueueItemAction
                          aria-label="Remove todo"
                          onClick={() => handleRemoveTodo(todo.id)}
                        >
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
              })}
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      )}
    </Queue>
  );
};

export default Example;
