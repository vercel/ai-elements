"use client";

import { ScrollArea } from "@repo/shadcn-ui/components/ui/scroll-area";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ArrowUp, ChevronRight, Paperclip, Trash2 } from "lucide-react";
import { createContext, memo, useCallback, useContext, useState } from "react";

type MessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};
type Message = { id: string; parts: MessagePart[] };
type TodoItem = {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
};

type MessageListProps = {
  items: Message[] | TodoItem[];
  type: "message" | "todo";
  onRemove: (id: string) => void;
  onSendNow?: (id: string) => void;
};

type TaskQueueItem =
  | { id: string; type: "message"; parts: MessagePart[] }
  | {
      id: string;
      type: "todo";
      title: string;
      description?: string;
      status: "pending" | "completed";
    };

type TaskQueueContextType = {
  tasks: TaskQueueItem[];
  addTask: (item: TaskQueueItem) => void;
  removeTask: (id: string) => void;
  updateTask: (
    id: string,
    update: Partial<Omit<TaskQueueItem, "type">>
  ) => void;
};

const TaskQueueContext = createContext<TaskQueueContextType | undefined>(
  undefined
);

export const TaskQueueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<TaskQueueItem[]>([]);

  const addTask = useCallback((item: TaskQueueItem) => {
    setTasks((prev) => [...prev, item]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback(
    (id: string, update: Partial<Omit<TaskQueueItem, "type">>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...update } : task))
      );
    },
    []
  );

  return (
    <TaskQueueContext.Provider
      value={{ tasks, addTask, removeTask, updateTask }}
    >
      {children}
    </TaskQueueContext.Provider>
  );
};

export function useTaskQueue() {
  const ctx = useContext(TaskQueueContext);

  if (!ctx) {
    throw new Error("useTaskQueue must be used within a TaskQueueProvider");
  }

  return ctx;
}

const MessageList = ({
  items,
  type,
  onRemove,
  onSendNow,
}: MessageListProps) => (
  <ScrollArea className="-mb-1 mt-2">
    <div className="max-h-40 pr-4">
      <ul>
        {type === "message"
          ? (items as Message[]).map((msg) => {
              const summary = (() => {
                const textParts = msg.parts.filter(
                  (p) => "type" in p && p.type === "text"
                );
                const text = textParts
                  .map((p) => p.text)
                  .join(" ")
                  .trim();
                if (text) {
                  return text;
                }
                return "(queued message)"; // (file only message)
              })();
              return (
                <li
                  className="group flex flex-col gap-1 rounded-md px-3 py-1 text-muted-foreground text-sm transition-colors hover:bg-muted"
                  key={msg.id}
                >
                  <div className="flex items-center gap-2">
                    <span className="mt-0.5 inline-block size-2.5 rounded-full border border-muted-foreground/50" />
                    <span className="line-clamp-1 grow break-words">
                      {summary}
                    </span>
                    <div className="flex gap-1">
                      <button
                        aria-label="Remove from queue"
                        className="invisible rounded p-1 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground group-hover:visible"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemove(msg.id);
                        }}
                        title="Remove from queue"
                        type="button"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        aria-label="Send now"
                        className="invisible rounded p-1 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground group-hover:visible"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSendNow?.(msg.id);
                        }}
                        type="button"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Media/file previews */}
                  {msg.parts.some((p) => p.type === "file" && p.url) && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {msg.parts
                        .filter((p) => p.type === "file" && p.url)
                        .map((file) => {
                          if (
                            file.mediaType?.startsWith("image/") &&
                            file.url
                          ) {
                            return (
                              // biome-ignore lint/performance/noImgElement: "AI Elements is framework agnostic"
                              <img
                                alt={file.filename || "attachment"}
                                className="h-8 w-8 rounded border object-cover"
                                height={32}
                                key={file.url}
                                src={file.url}
                                width={32}
                              />
                            );
                          }
                          // Other file types: show icon and filename
                          return (
                            <span
                              className="flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs"
                              key={file.url}
                            >
                              <Paperclip size={12} />
                              <span className="max-w-[100px] truncate">
                                {file.filename || "file"}
                              </span>
                            </span>
                          );
                        })}
                    </div>
                  )}
                </li>
              );
            })
          : (items as TodoItem[]).map((item) => {
              const isCompleted = item.status === "completed";
              return (
                <li
                  className="group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted"
                  key={item.id}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`mt-0.5 inline-block size-2.5 rounded-full border ${isCompleted ? "border-muted-foreground/20 bg-muted-foreground/10" : "border-muted-foreground/50"}`}
                    />
                    <span
                      className={`line-clamp-1 grow break-words font-medium ${isCompleted ? "text-muted-foreground/50 line-through" : "text-muted-foreground"}`}
                    >
                      {item.title}
                    </span>
                    <button
                      aria-label="Remove todo"
                      className="invisible rounded p-1 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground group-hover:visible"
                      onClick={() => onRemove(item.id)}
                      type="button"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {item.description && (
                    <div
                      className={`ml-6 text-xs ${isCompleted ? "text-muted-foreground/40 line-through" : "text-muted-foreground"}`}
                    >
                      {item.description}
                    </div>
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  </ScrollArea>
);

type TaskQueuePanelProps = {
  messages: Message[];
  todos: TodoItem[];
  onRemoveQueue?: (id: string) => void;
  onRemoveTodo?: (id: string) => void;
  onSendNow?: (id: string) => void;
};

// Reusable collapsible panel for both queue and todo
function CollapsiblePanel({
  label,
  count,
  isOpen,
  onToggle,
  children,
  icon,
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  if (count === 0) {
    return null;
  }

  return (
    <div>
      <button
        className="flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left font-medium text-muted-foreground text-sm hover:bg-muted"
        onClick={onToggle}
        type="button"
      >
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "transition-transform",
              isOpen ? "rotate-90" : "rotate-0"
            )}
          >
            <ChevronRight size={14} />
          </span>
          {icon}
          <span>
            {count} {label}
          </span>
        </span>
      </button>
      {isOpen && children}
    </div>
  );
}

export const TaskQueuePanel = memo(function TaskQueuePanelComponent({
  messages,
  todos,
  onRemoveQueue,
  onRemoveTodo,
  onSendNow,
}: TaskQueuePanelProps) {
  const [queueOpen, setQueueOpen] = useState(true);
  const [todoOpen, setTodoOpen] = useState(true);

  if (messages.length === 0 && todos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-t-xl border border-border border-b-0 bg-background px-3 pt-2 pb-2 shadow-xs">
      <CollapsiblePanel
        count={messages?.length ?? 0}
        icon={null}
        isOpen={queueOpen}
        label="Queued"
        onToggle={() => setQueueOpen((v) => !v)}
      >
        <MessageList
          items={messages ?? []}
          onRemove={onRemoveQueue ?? (() => {})}
          onSendNow={onSendNow}
          type="message"
        />
      </CollapsiblePanel>
      <CollapsiblePanel
        count={todos?.length ?? 0}
        isOpen={todoOpen}
        label="Todo"
        onToggle={() => setTodoOpen((v) => !v)}
      >
        <MessageList
          items={todos ?? []}
          onRemove={onRemoveTodo ?? (() => {})}
          type="todo"
        />
      </CollapsiblePanel>
    </div>
  );
});
