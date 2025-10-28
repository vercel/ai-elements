"use client";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/elements/prompt-input";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemContent,
  QueueItemDescription,
  QueueItemIndicator,
  QueueSection,
  QueueSectionContent,
  type QueueTodo,
} from "@repo/elements/queue";
import { GlobeIcon, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

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
  const [todos, setTodos] = useState(sampleTodos);

  const handleRemoveTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stop = () => {
    console.log("Stopping request...");

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setStatus("ready");
  };

  const handleSubmit = (message: PromptInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === "streaming" || status === "submitted") {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    timeoutRef.current = setTimeout(() => {
      setStatus("ready");
      timeoutRef.current = null;
    }, STREAMING_TIMEOUT);
  };

  return (
    <div className="flex size-full flex-col justify-end">
      <Queue className="mx-auto max-h-[150px] w-[95%] overflow-y-auto rounded-b-none border-input border-b-0">
        {todos.length > 0 && (
          <QueueSection>
            <QueueSectionContent>
              <div>
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
              </div>
            </QueueSectionContent>
          </QueueSection>
        )}
      </Queue>
      <PromptInput globalDrop multiple onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea
            onChange={(e) => setText(e.target.value)}
            ref={textareaRef}
            value={text}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputSpeechButton
              onTranscriptionChange={setText}
              textareaRef={textareaRef}
            />
            <PromptInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputModelSelect onValueChange={setModel} value={model}>
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((modelOption) => (
                  <PromptInputModelSelectItem
                    key={modelOption.id}
                    value={modelOption.id}
                  >
                    {modelOption.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default Example;
