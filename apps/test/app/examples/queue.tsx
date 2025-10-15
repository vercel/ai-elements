"use client";

import {
  Queue,
  QueueList,
  QueueMessageItem,
  QueueSection,
  QueueTodoItem,
  type QueueMessage,
  type QueueTodo,
} from "@repo/elements/queue";
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
    parts: [{ type: "text", text: "Can you review my PR?" }],
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
      <QueueSection count={messages.length} label="Queued">
        <QueueList>
          {messages.map((message) => (
            <QueueMessageItem
              key={message.id}
              message={message}
              onRemove={handleRemoveMessage}
              onSendNow={handleSendNow}
            />
          ))}
        </QueueList>
      </QueueSection>
      <QueueSection count={todos.length} label="Todo">
        <QueueList>
          {todos.map((todo) => (
            <QueueTodoItem
              key={todo.id}
              onRemove={handleRemoveTodo}
              todo={todo}
            />
          ))}
        </QueueList>
      </QueueSection>
    </Queue>
  );
};

export default Example;
