import { memo, useState } from "react";
import { ScrollArea } from "@repo/shadcn-ui/components/ui/scroll-area";
import { Trash2, Paperclip, ChevronRight, ArrowUp } from "lucide-react";
import { cn } from "@repo/shadcn-ui/lib/utils";

export type MessagePart = { type: string; text?: string; url?: string; filename?: string; mediaType?: string };
export type Message = { id: string; parts: MessagePart[] };
export type TodoItem = { id: string; title: string; description?: string; status?: 'pending' | 'completed' };


interface MessageListProps {
  items: Message[] | TodoItem[];
  type: 'message' | 'todo';
  onRemove: (id: string) => void;
  onSendNow?: (id: string) => void;
}

function MessageList({ items, type, onRemove, onSendNow }: MessageListProps) {
  return (
    <ScrollArea className="mt-2 -mb-1">
      <div className="max-h-40 pr-4">
        <ul>
          {type === 'message'
            ? (items as Message[]).map((msg) => {
                const summary = (() => {
                  const textParts = msg.parts.filter((p) => 'type' in p && p.type === 'text');
                  const text = textParts.map((p) => p.text).join(' ').trim();
                  if (text) return text;
                  return '(queued message)'; // (file only message)
                })();
                return (
                  <li key={msg.id} className="group flex flex-col gap-1 py-1 px-3 text-sm text-muted-foreground rounded-md hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="mt-0.5 inline-block size-2.5 rounded-full border border-muted-foreground/50"></span>
                      <span className="line-clamp-1 break-words grow">{summary}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="invisible group-hover:visible rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(msg.id);
                          }}
                          aria-label="Remove from queue"
                          title="Remove from queue"
                        >
                          <Trash2 size={12} />
                        </button>
                        <button
                          type="button"
                          className="invisible group-hover:visible rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onSendNow) onSendNow(msg.id);
                          }}
                          aria-label="Send now"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </div>
                    </div>
                    {/* Media/file previews */}
                    {msg.parts.some((p) => p.type === 'file' && p.url) && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.parts.filter((p) => p.type === 'file' && p.url).map((file, i) => {
                          if (file.mediaType && file.mediaType.startsWith('image/') && file.url) {
                            return (
                              <img
                                key={i}
                                src={file.url}
                                alt={file.filename || 'attachment'}
                                className="h-8 w-8 object-cover rounded border"
                              />
                            );
                          }
                          // Other file types: show icon and filename
                          return (
                            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs border">
                              <Paperclip size={12} />
                              <span className="truncate max-w-[100px]">{file.filename || 'file'}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })
            : (items as TodoItem[]).map((item) => {
                const isCompleted = item.status === 'completed';
                return (
                  <li key={item.id} className="group flex flex-col gap-1 py-1 px-3 text-sm rounded-md hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`mt-0.5 inline-block size-2.5 rounded-full border ${isCompleted ? 'border-muted-foreground/20 bg-muted-foreground/10' : 'border-muted-foreground/50'}`}></span>
                      <span className={`line-clamp-1 break-words grow font-medium ${isCompleted ? 'line-through text-muted-foreground/50' : 'text-muted-foreground'}`}>{item.title}</span>
                      <button
                        type="button"
                        className="invisible group-hover:visible rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                        onClick={() => onRemove(item.id)}
                        aria-label="Remove todo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {item.description && (
                      <div className={`ml-6 text-xs ${isCompleted ? 'line-through text-muted-foreground/40' : 'text-muted-foreground'}`}>{item.description}</div>
                    )}
                  </li>
                );
              })}
        </ul>
      </div>
    </ScrollArea>
  );
}

export interface TaskQueuePanelProps {
  messages: Message[];
  todos: TodoItem[];
  onRemoveQueue?: (id: string) => void;
  onRemoveTodo?: (id: string) => void;
  onSendNow?: (id: string) => void;
}

// Reusable collapsible panel for both queue and todo
function CollapsiblePanel({
  label,
  count,
  isOpen,
  onToggle,
  children,
  icon
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted"
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          <span
            className={cn('transition-transform', isOpen ? ' rotate-90' : ' rotate-0')}
          >
            <ChevronRight size={14} />
          </span>
          {icon}
          <span>{count} {label}</span>
        </span>
      </button>
      {isOpen && children}
    </div>
  );
}

export const TaskQueuePanel = memo(function TaskQueuePanel({ messages, todos, onRemoveQueue, onRemoveTodo, onSendNow }: TaskQueuePanelProps) {
  const [queueOpen, setQueueOpen] = useState(true);
  const [todoOpen, setTodoOpen] = useState(true);

  if (messages.length === 0 && todos.length === 0) return null;
  
  return (
    <div className="rounded-t-xl border border-border border-b-0 bg-background px-3 pt-2 pb-2 shadow-xs flex flex-col gap-2">
      <CollapsiblePanel
        label="Queued"
        count={messages?.length ?? 0}
        isOpen={queueOpen}
        onToggle={() => setQueueOpen((v) => !v)}
        icon={null}
      >
        <MessageList items={messages ?? []} type="message" onRemove={onRemoveQueue || (() => {})} onSendNow={onSendNow} />
      </CollapsiblePanel>
      <CollapsiblePanel
        label="Todo"
        count={todos?.length ?? 0}
        isOpen={todoOpen}
        onToggle={() => setTodoOpen((v) => !v)}
      >
        <MessageList items={todos ?? []} type="todo" onRemove={onRemoveTodo || (() => {})}/>
      </CollapsiblePanel>
    </div>
  );
});
