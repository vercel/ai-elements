"use client";

import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@repo/elements/checkpoint";
import { CodeBlock } from "@repo/elements/code-block";
import { Conversation, ConversationContent } from "@repo/elements/conversation";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@repo/elements/file-tree";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@repo/elements/message";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@repo/elements/plan";
import {
  PromptInput,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@repo/elements/prompt-input";
import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@repo/elements/queue";
import {
  Task,
  TaskContent,
  TaskItemFile,
  TaskTrigger,
} from "@repo/elements/task";
import { Terminal, TerminalContent } from "@repo/elements/terminal";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { CheckCircle2Icon, ListTodoIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import type { BundledLanguage } from "shiki";

// Types
interface MockFile {
  path: string;
  name: string;
  language: BundledLanguage;
  content: string;
}

interface MessageType {
  key: string;
  from: "user" | "assistant";
  content: string;
}

interface TaskItem {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
}

// Mock file contents
const mockFiles: MockFile[] = [
  {
    path: "src/app.tsx",
    name: "app.tsx",
    language: "tsx",
    content: `import { useState } from "react";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { validateForm } from "./utils/helpers";

export function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validation = validateForm({ name, email });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    console.log("Form submitted:", { name, email });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Form</h1>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.map((error) => (
        <p key={error} className="text-red-500">{error}</p>
      ))}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}`,
  },
  {
    path: "src/components/button.tsx",
    name: "button.tsx",
    language: "tsx",
    content: `import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-colors focus-visible:outline-none focus-visible:ring-2",
          variant === "primary" && "bg-blue-500 text-white hover:bg-blue-600",
          variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
          variant === "ghost" && "hover:bg-gray-100",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4",
          size === "lg" && "h-12 px-6 text-lg",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";`,
  },
  {
    path: "src/components/input.tsx",
    name: "input.tsx",
    language: "tsx",
    content: `import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../utils/helpers";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
          "focus-visible:outline-none focus-visible:ring-2",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";`,
  },
  {
    path: "src/utils/helpers.ts",
    name: "helpers.ts",
    language: "typescript",
    content: `export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface FormData {
  name: string;
  email: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateForm(data: FormData): ValidationResult {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push("Name is required");
  }

  if (!data.email.trim()) {
    errors.push("Email is required");
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`,
  },
  {
    path: "package.json",
    name: "package.json",
    language: "json",
    content: `{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}`,
  },
  {
    path: "README.md",
    name: "README.md",
    language: "markdown",
    content: `# My App

A simple React application with form validation.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Contact form with validation
- Reusable Button and Input components
- TypeScript support
`,
  },
];

// Mock tasks
const initialTasks: TaskItem[] = [
  { id: "1", title: "Refactor Button component", status: "completed" },
  { id: "2", title: "Add form validation", status: "in_progress" },
  { id: "3", title: "Write unit tests", status: "pending" },
];

// Mock chat messages
const mockMessages: MessageType[] = [
  {
    key: nanoid(),
    from: "user",
    content: "Can you help me add email validation to the form?",
  },
  {
    key: nanoid(),
    from: "assistant",
    content: `I can help you add email validation. Looking at your code in \`src/utils/helpers.ts\`, I see you already have a \`validateForm\` function.

Here's what I'll do:

1. Add an \`isValidEmail\` helper function
2. Update \`validateForm\` to check email format
3. Show validation errors in the UI

The email validation uses a regex pattern to check for valid email format. The form will now show "Invalid email format" if the user enters an incorrectly formatted email address.`,
  },
];

// Mock terminal output
const mockTerminalLines = [
  "\x1b[32m✓\x1b[0m Building application...",
  "\x1b[36m  src/app.tsx\x1b[0m → \x1b[33mdist/app.js\x1b[0m",
  "\x1b[36m  src/components/button.tsx\x1b[0m → \x1b[33mdist/button.js\x1b[0m",
  "\x1b[36m  src/components/input.tsx\x1b[0m → \x1b[33mdist/input.js\x1b[0m",
  "\x1b[36m  src/utils/helpers.ts\x1b[0m → \x1b[33mdist/helpers.js\x1b[0m",
  "",
  "\x1b[32m✓\x1b[0m Build completed in \x1b[33m1.2s\x1b[0m",
  "",
  "\x1b[34mRunning tests...\x1b[0m",
  "",
  " \x1b[32m✓\x1b[0m validateForm › returns errors for empty fields",
  " \x1b[32m✓\x1b[0m validateForm › returns error for invalid email",
  " \x1b[32m✓\x1b[0m validateForm › passes for valid input",
  " \x1b[32m✓\x1b[0m Button › renders with correct variant",
  " \x1b[32m✓\x1b[0m Input › shows error state",
  "",
  "\x1b[32mAll tests passed!\x1b[0m (5/5)",
];

const Example = () => {
  // File tree state
  const [selectedPath, setSelectedPath] = useState<string>("src/app.tsx");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["src", "src/components", "src/utils"])
  );

  // Code editor state
  const [currentFile, setCurrentFile] = useState<MockFile>(mockFiles[0]);

  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [isTerminalStreaming, setIsTerminalStreaming] =
    useState<boolean>(false);

  // Chat state
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatText, setChatText] = useState<string>("");
  const [status, setStatus] = useState<"ready" | "streaming" | "submitted">(
    "ready"
  );

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  // Checkpoint state
  const [showCheckpoint, setShowCheckpoint] = useState<boolean>(false);

  // Find file by path
  const findFileByPath = (path: string): MockFile | undefined => {
    return mockFiles.find((f) => f.path === path);
  };

  // Handle file selection
  const handleFileSelect = (path: string) => {
    setSelectedPath(path);
    const file = findFileByPath(path);
    if (file) {
      setCurrentFile(file);
    }
  };

  // Stream message content word by word
  const streamContent = useCallback(
    async (messageKey: string, content: string) => {
      const words = content.split(" ");
      let currentContent = "";

      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? " " : "") + words[i];
        const finalContent = currentContent;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.key === messageKey ? { ...msg, content: finalContent } : msg
          )
        );

        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 40 + 20)
        );
      }
    },
    []
  );

  // Stream message
  const streamMessage = useCallback(
    async (message: MessageType) => {
      if (message.from === "user") {
        setMessages((prev) => [...prev, message]);
        return;
      }

      // Add empty assistant message
      const newMessage = { ...message, content: "" };
      setMessages((prev) => [...prev, newMessage]);

      setStatus("streaming");
      await streamContent(message.key, message.content);
      setStatus("ready");
    },
    [streamContent]
  );

  // Stream terminal output line by line
  const streamTerminal = useCallback(async () => {
    setIsTerminalStreaming(true);
    let output = "";

    for (const line of mockTerminalLines) {
      output += line + "\n";
      setTerminalOutput(output);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsTerminalStreaming(false);
  }, []);

  // Animation sequence on mount
  useEffect(() => {
    const runAnimation = async () => {
      // Wait a bit before starting
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stream first message (user)
      await streamMessage(mockMessages[0]);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Stream second message (assistant)
      await streamMessage(mockMessages[1]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update task status
      setTasks((prev) =>
        prev.map((task) =>
          task.id === "2" ? { ...task, status: "completed" as const } : task
        )
      );

      // Stream terminal output
      await streamTerminal();

      // Show checkpoint
      await new Promise((resolve) => setTimeout(resolve, 300));
      setShowCheckpoint(true);
    };

    runAnimation();
  }, [streamMessage, streamTerminal]);

  // Handle chat submit
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return;

    const userMessage: MessageType = {
      key: nanoid(),
      from: "user",
      content: message.text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatText("");
    setStatus("submitted");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: MessageType = {
        key: nanoid(),
        from: "assistant",
        content:
          "I'll look into that for you. Let me analyze the codebase and suggest some improvements.",
      };
      streamMessage(assistantMessage);
    }, 500);
  };

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  return (
    <div className="flex h-full w-full bg-background">
      {/* Left Sidebar - File Tree */}
      <div className="flex w-64 flex-col border-r">
        <div className="flex-1 overflow-auto p-1">
          <FileTree
            className="border-none"
            expanded={expandedPaths}
            onExpandedChange={setExpandedPaths}
            onSelect={handleFileSelect}
            selectedPath={selectedPath}
          >
            <FileTreeFolder name="src" path="src">
              <FileTreeFolder name="components" path="src/components">
                <FileTreeFile
                  name="button.tsx"
                  path="src/components/button.tsx"
                />
                <FileTreeFile
                  name="input.tsx"
                  path="src/components/input.tsx"
                />
              </FileTreeFolder>
              <FileTreeFolder name="utils" path="src/utils">
                <FileTreeFile name="helpers.ts" path="src/utils/helpers.ts" />
              </FileTreeFolder>
              <FileTreeFile name="app.tsx" path="src/app.tsx" />
            </FileTreeFolder>
            <FileTreeFile name="package.json" path="package.json" />
            <FileTreeFile name="README.md" path="README.md" />
          </FileTree>
        </div>
      </div>

      {/* Center Panel - Code + Terminal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Code Block */}
        <CodeBlock
          className="rounded-none border-0"
          code={currentFile.content}
          language={currentFile.language}
          showLineNumbers
        />

        <Terminal
          className="h-64 rounded-none border-0"
          isStreaming={isTerminalStreaming}
          output={terminalOutput}
        >
          <TerminalContent className="max-h-full" />
        </Terminal>
      </div>

      {/* Right Sidebar - AI Chat */}
      <div className="flex w-80 flex-col border-l">
        {/* Plan Section */}
        <div className="border-b p-3">
          <Plan defaultOpen>
            <PlanHeader>
              <div>
                <PlanTitle>Implementation Plan</PlanTitle>
                <PlanDescription>Adding form validation</PlanDescription>
              </div>
              <PlanAction>
                <PlanTrigger />
              </PlanAction>
            </PlanHeader>
            <PlanContent className="pt-0">
              <Task defaultOpen>
                <TaskTrigger title="Search for validation patterns" />
                <TaskContent>
                  <TaskItemFile>src/utils/helpers.ts</TaskItemFile>
                  <TaskItemFile>src/app.tsx</TaskItemFile>
                </TaskContent>
              </Task>
            </PlanContent>
          </Plan>
        </div>

        {/* Task Queue */}
        <div className="border-b p-3">
          <Queue>
            <QueueSection defaultOpen>
              <QueueSectionTrigger>
                <QueueSectionLabel
                  count={pendingTasks.length}
                  icon={<ListTodoIcon className="size-4" />}
                  label="Pending"
                />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <QueueList>
                  {pendingTasks.map((task) => (
                    <QueueItem key={task.id}>
                      <div className="flex items-center gap-2">
                        <QueueItemIndicator />
                        <QueueItemContent>{task.title}</QueueItemContent>
                      </div>
                    </QueueItem>
                  ))}
                </QueueList>
              </QueueSectionContent>
            </QueueSection>
            <QueueSection defaultOpen={false}>
              <QueueSectionTrigger>
                <QueueSectionLabel
                  count={completedTasks.length}
                  icon={<CheckCircle2Icon className="size-4" />}
                  label="Completed"
                />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <QueueList>
                  {completedTasks.map((task) => (
                    <QueueItem key={task.id}>
                      <div className="flex items-center gap-2">
                        <QueueItemIndicator completed />
                        <QueueItemContent completed>
                          {task.title}
                        </QueueItemContent>
                      </div>
                    </QueueItem>
                  ))}
                </QueueList>
              </QueueSectionContent>
            </QueueSection>
          </Queue>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Conversation className="flex-1">
            <ConversationContent className="gap-4 p-3">
              {messages.map((message) => (
                <Message from={message.from} key={message.key}>
                  <MessageContent
                    className={cn(
                      message.from === "user"
                        ? "rounded-lg bg-secondary px-3 py-2"
                        : ""
                    )}
                  >
                    {message.from === "assistant" ? (
                      <MessageResponse>{message.content}</MessageResponse>
                    ) : (
                      message.content
                    )}
                  </MessageContent>
                </Message>
              ))}
              {showCheckpoint && (
                <Checkpoint>
                  <CheckpointIcon />
                  <CheckpointTrigger tooltip="Restore to this checkpoint">
                    Checkpoint saved
                  </CheckpointTrigger>
                </Checkpoint>
              )}
            </ConversationContent>
          </Conversation>

          {/* Chat Input */}
          <div className="border-t p-3">
            <PromptInput className="rounded-lg border" onSubmit={handleSubmit}>
              <PromptInputTextarea
                className="min-h-10"
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Ask about the code..."
                value={chatText}
              />
              <PromptInputFooter className="justify-end p-2">
                <PromptInputSubmit
                  disabled={status !== "ready" || !chatText.trim()}
                  status={status === "streaming" ? "streaming" : undefined}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;
