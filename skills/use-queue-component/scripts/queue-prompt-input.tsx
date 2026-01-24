"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@repo/elements/attachments";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
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
import { useState } from "react";

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
];

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const Example = () => {
  const [todos, setTodos] = useState(sampleTodos);
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const handleRemoveTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleSubmit = (message: PromptInputMessage) => {
    if (status === "streaming" || status === "submitted") {
      setStatus("ready");
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    setTimeout(() => {
      setStatus("streaming");
    }, 200);

    setTimeout(() => {
      setStatus("ready");
    }, 2000);
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
        <PromptInputHeader>
          <PromptInputAttachmentsDisplay />
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e) => setText(e.target.value)}
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
            <PromptInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default Example;
