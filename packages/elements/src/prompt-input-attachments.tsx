"use client";

import { DropdownMenuItem } from "@repo/shadcn-ui/components/ui/dropdown-menu";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ImageIcon, PaperclipIcon, XIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AttachmentItem = {
  id: string;
  file: File;
  kind: "image" | "file";
  url?: string; // only for images
};

type AttachmentsCtx = {
  items: AttachmentItem[];
  // Alias for DX: same as `items`.
  attachments: AttachmentItem[];
  files: File[];
  addFiles: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: React.RefObject<HTMLInputElement> | null;
};

const AttachmentsContext = createContext<AttachmentsCtx | null>(null);

export function usePromptAttachments() {
  return useContext(AttachmentsContext);
}

// Small DX helper for read-only consumption in apps
export function useAttachments() {
  const ctx = usePromptAttachments();
  return useMemo(() => {
    const items = ctx?.attachments ?? [];
    const hasAttachments = items.length > 0;
    let hasImages = false;
    let hasPDF = false;
    let hasOther = false;
    for (const i of items) {
      const t = i.file?.type || "";
      const name = i.file?.name?.toLowerCase() ?? "";
      const isImage = t.startsWith("image/");
      const isPDF = t === "application/pdf" || name.endsWith(".pdf");
      if (isImage) {
        hasImages = true;
      } else if (isPDF) {
        hasPDF = true;
      } else {
        hasOther = true;
      }
    }
    return {
      items,
      attachments: items,
      hasAttachments,
      hasImages,
      hasPDF,
      hasOther,
    };
  }, [ctx]);
}

export type PromptAttachmentsProviderProps = {
  children?: React.ReactNode;
  name?: string;
  accept?: string; // e.g., "image/*" or leave undefined for any
  multiple?: boolean;
  // When true, accepts drops anywhere on document. Default false (opt-in).
  globalDrop?: boolean;
  // Render a hidden input with given name and keep it in sync for native form posts. Default false.
  syncHiddenInput?: boolean;
  // Minimal constraints
  maxFiles?: number;
  maxFileSize?: number; // bytes
  onError?: (err: {
    code: "max_files" | "max_file_size" | "accept";
    message: string;
  }) => void;
};

export function PromptAttachmentsProvider({
  children,
  name = "attachments",
  accept,
  multiple = true,
  globalDrop = false,
  syncHiddenInput = false,
  maxFiles,
  maxFileSize,
  onError,
}: PromptAttachmentsProviderProps) {
  const [items, setItems] = useState<AttachmentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Find nearest form to scope drag & drop
  useEffect(() => {
    const root = anchorRef.current?.closest("form");
    if (root instanceof HTMLFormElement) {
      formRef.current = root;
    }
  }, []);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const buildId = useCallback(
    (f: File) => `${f.name}-${f.size}-${f.lastModified}`,
    []
  );

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === "") {
        return true;
      }
      // Simple check: if accept includes "image/*", filter to images; otherwise allow.
      if (accept.includes("image/*")) {
        return f.type.startsWith("image/");
      }
      return true;
    },
    [accept]
  );

  const addFiles = useCallback(
    (files: File[] | FileList) => {
      const incoming = Array.from(files);
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        });
        return;
      }
      const withinSize = (f: File) =>
        maxFileSize ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (sized.length === 0 && accepted.length > 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        });
        return;
      }
      setItems((prev) => {
        const existing = new Set(prev.map((i) => i.id));
        const capacity =
          typeof maxFiles === "number"
            ? Math.max(0, maxFiles - prev.length)
            : undefined;
        const capped =
          typeof capacity === "number" ? sized.slice(0, capacity) : sized;
        if (typeof capacity === "number" && sized.length > capacity) {
          onError?.({
            code: "max_files",
            message: "Too many files. Some were not added.",
          });
        }
        const next: AttachmentItem[] = [];
        for (const f of capped) {
          const id = buildId(f);
          if (existing.has(id)) {
            continue;
          }
          if (f.type.startsWith("image/")) {
            next.push({
              id,
              file: f,
              kind: "image",
              url: URL.createObjectURL(f),
            });
          } else {
            next.push({ id, file: f, kind: "file" });
          }
        }
        return prev.concat(next);
      });
    },
    [buildId, matchesAccept, maxFiles, maxFileSize, onError]
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setItems((prev) => {
      for (const i of prev) {
        if (i.url) {
          URL.revokeObjectURL(i.url);
        }
      }
      return [];
    });
  }, []);

  // Keep hidden input in sync for native form submission when enabled
  useEffect(() => {
    if (!syncHiddenInput) {
      return;
    }
    const input = inputRef.current;
    if (!input) {
      return;
    }
    const dt = new DataTransfer();
    for (const i of items) {
      try {
        dt.items.add(i.file);
      } catch {
        /* ignore */
      }
    }
    input.files = dt.files;
  }, [items, syncHiddenInput]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      for (const i of items) {
        if (i.url) {
          URL.revokeObjectURL(i.url);
        }
      }
    };
  }, [items]);

  // Attach drop handlers on nearest form and document (opt-in)
  useEffect(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    };
    form.addEventListener("dragover", onDragOver);
    form.addEventListener("drop", onDrop);
    return () => {
      form.removeEventListener("dragover", onDragOver);
      form.removeEventListener("drop", onDrop);
    };
  }, [addFiles]);

  useEffect(() => {
    if (!globalDrop) {
      return;
    }
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    };
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, [addFiles, globalDrop]);

  const ctx = useMemo<AttachmentsCtx>(
    () => ({
      items,
      attachments: items,
      files: items.map((i) => i.file),
      addFiles,
      remove,
      clear,
      openFileDialog,
      fileInputRef: inputRef,
    }),
    [items, addFiles, remove, clear, openFileDialog]
  );

  return (
    <AttachmentsContext.Provider value={ctx}>
      <span aria-hidden="true" className="hidden" ref={anchorRef} />
      {/* Hidden input to open browser file dialog; named only when syncing for native forms */}
      <input
        accept={accept}
        className="hidden"
        multiple={multiple}
        name={syncHiddenInput ? name : undefined}
        onChange={(e) => {
          if (e.currentTarget.files) {
            addFiles(e.currentTarget.files);
          }
        }}
        ref={inputRef}
        type="file"
      />
      {children}
    </AttachmentsContext.Provider>
  );
}

export type PromptAttachmentsPreviewProps = HTMLAttributes<HTMLDivElement> & {
  // When true, also show non-image files as small badges
  showFiles?: boolean;
};

export function PromptAttachmentsPreview({
  className,
  showFiles = true,
  ...props
}: PromptAttachmentsPreviewProps) {
  const ctx = usePromptAttachments();
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAny = (ctx?.items?.length ?? 0) > 0;

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      setHeight(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      aria-live="polite"
      className={cn(
        "overflow-hidden transition-[height] duration-200 ease-out",
        className
      )}
      style={{ height: hasAny ? height : 0 }}
      {...props}
    >
      <div className="flex flex-wrap gap-2 p-3 pt-3" ref={contentRef}>
        {ctx?.items?.map((att) => (
          <div
            className="group relative h-14 w-14 rounded-md border"
            key={att.id}
          >
            {att.kind === "image" && att.url ? (
              <img
                alt={att.file?.name || "attachment"}
                className="h-full w-full rounded-md object-cover"
                src={att.url}
              />
            ) : (
              showFiles && (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <PaperclipIcon className="size-4" />
                </div>
              )
            )}
            <button
              aria-label="Remove attachment"
              className={cn(
                "-right-1.5 -top-1.5 absolute z-10 inline-flex size-5 items-center justify-center rounded-full",
                "bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              )}
              onClick={() => ctx?.remove(att.id)}
              type="button"
            >
              <XIcon className="size-3 text-primary-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export type PromptInputActionAddAttachmentsProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string;
};

export function PromptInputActionAddAttachments({
  label = "Add photos or files",
  ...props
}: PromptInputActionAddAttachmentsProps) {
  const ctx = usePromptAttachments();
  return (
    <DropdownMenuItem
      {...props}
      onSelect={(e) => {
        e.preventDefault();
        ctx?.openFileDialog();
      }}
    >
      <ImageIcon className="mr-2 size-4" /> {label}
    </DropdownMenuItem>
  );
}
