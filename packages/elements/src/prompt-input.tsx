"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/shadcn-ui/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/shadcn-ui/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@repo/shadcn-ui/components/ui/input-group";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@repo/shadcn-ui/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/shadcn-ui/components/ui/select";
import { Spinner } from "@repo/shadcn-ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ChatStatus, FileUIPart, SourceDocumentUIPart } from "ai";
import {
  CornerDownLeftIcon,
  ImageIcon,
  Monitor,
  PlusIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import type {
  ChangeEventHandler,
  ClipboardEventHandler,
  ComponentProps,
  CompositionEventHandler,
  FormEvent,
  FormEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  PropsWithChildren,
  ReactEventHandler,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================================================
// Helpers
// ============================================================================

const DEFAULT_SUGGESTION_PREFIXES = [" ", "\n", "\t"] as const;

const setRefValue = <T,>(ref: Ref<T> | undefined, value: T | null): void => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

const convertBlobUrlToDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    // FileReader uses callback-based API, wrapping in Promise is necessary
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    return new Promise((resolve) => {
      const reader = new FileReader();
      // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
      reader.onloadend = () => resolve(reader.result as string);
      // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const captureScreenshot = async (): Promise<File | null> => {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getDisplayMedia
  ) {
    return null;
  }

  let stream: MediaStream | null = null;
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;

  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
    });

    video.srcObject = stream;

    // Video element uses callback-based API, wrapping in Promise is necessary
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise<void>((resolve, reject) => {
      // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
      video.onloadedmetadata = () => resolve();
      // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
      video.onerror = () => reject(new Error("Failed to load screen stream"));
    });

    await video.play();

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, width, height);
    // canvas.toBlob uses callback-based API, wrapping in Promise is necessary
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
    if (!blob) {
      return null;
    }

    const timestamp = new Date()
      .toISOString()
      .replaceAll(/[:.]/g, "-")
      .replace("T", "_")
      .replace("Z", "");

    return new File([blob], `screenshot-${timestamp}.png`, {
      lastModified: Date.now(),
      type: "image/png",
    });
  } finally {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
    }
    video.pause();
    video.srcObject = null;
  }
};

// ============================================================================
// Provider Context & Types
// ============================================================================

export interface AttachmentsContext {
  files: (FileUIPart & { id: string })[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export interface TextInputContext {
  value: string;
  setInput: (v: string) => void;
  clear: () => void;
}

export interface PromptInputControllerProps {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  /** INTERNAL: Allows PromptInput to register its file textInput + "open" callback */
  __registerFileInput: (
    ref: RefObject<HTMLInputElement | null>,
    open: () => void
  ) => void;
}

const PromptInputController = createContext<PromptInputControllerProps | null>(
  null
);
const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(
  null
);

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    );
  }
  return ctx;
};

// Optional variants (do NOT throw). Useful for dual-mode components.
const useOptionalPromptInputController = () =>
  useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments()."
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () =>
  useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string;
}>;

/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export const PromptInputProvider = ({
  initialInput: initialTextInput = "",
  children,
}: PromptInputProviderProps) => {
  // ----- textInput state
  const [textInput, setTextInput] = useState(initialTextInput);
  const clearInput = useCallback(() => setTextInput(""), []);

  // ----- attachments state (global when wrapped)
  const [attachmentFiles, setAttachmentFiles] = useState<
    (FileUIPart & { id: string })[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // oxlint-disable-next-line eslint(no-empty-function)
  const openRef = useRef<() => void>(() => {});

  const add = useCallback((files: File[] | FileList) => {
    const incoming = [...files];
    if (incoming.length === 0) {
      return;
    }

    setAttachmentFiles((prev) => [
      ...prev,
      ...incoming.map((file) => ({
        filename: file.name,
        id: nanoid(),
        mediaType: file.type,
        type: "file" as const,
        url: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
      return [];
    });
  }, []);

  // Keep a ref to attachments for cleanup on unmount (avoids stale closure)
  const attachmentsRef = useRef(attachmentFiles);

  useEffect(() => {
    attachmentsRef.current = attachmentFiles;
  }, [attachmentFiles]);

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(
    () => () => {
      for (const f of attachmentsRef.current) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
    },
    []
  );

  const openFileDialog = useCallback(() => {
    openRef.current?.();
  }, []);

  const attachments = useMemo<AttachmentsContext>(
    () => ({
      add,
      clear,
      fileInputRef,
      files: attachmentFiles,
      openFileDialog,
      remove,
    }),
    [attachmentFiles, add, remove, clear, openFileDialog]
  );

  const __registerFileInput = useCallback(
    (ref: RefObject<HTMLInputElement | null>, open: () => void) => {
      fileInputRef.current = ref.current;
      openRef.current = open;
    },
    []
  );

  const controller = useMemo<PromptInputControllerProps>(
    () => ({
      __registerFileInput,
      attachments,
      textInput: {
        clear: clearInput,
        setInput: setTextInput,
        value: textInput,
      },
    }),
    [textInput, clearInput, attachments, __registerFileInput]
  );

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
};

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null);

export const usePromptInputAttachments = () => {
  // Prefer local context (inside PromptInput) as it has validation, fall back to provider
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = local ?? provider;
  if (!context) {
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider"
    );
  }
  return context;
};

// ============================================================================
// Referenced Sources (Local to PromptInput)
// ============================================================================

export interface ReferencedSourcesContext {
  sources: (SourceDocumentUIPart & { id: string })[];
  add: (sources: SourceDocumentUIPart[] | SourceDocumentUIPart) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const LocalReferencedSourcesContext =
  createContext<ReferencedSourcesContext | null>(null);

export const usePromptInputReferencedSources = () => {
  const ctx = useContext(LocalReferencedSourcesContext);
  if (!ctx) {
    throw new Error(
      "usePromptInputReferencedSources must be used within a LocalReferencedSourcesContext.Provider"
    );
  }
  return ctx;
};

// ============================================================================
// Suggestions
// ============================================================================

const SUGGESTION_WHITESPACE_REGEX = /\s/u;
const SUGGESTION_LINE_BREAK_REGEX = /[\r\n]/u;

export interface PromptInputSuggestionRange {
  start: number;
  end: number;
}

export interface PromptInputSuggestionMatch {
  trigger: string;
  query: string;
  range: PromptInputSuggestionRange;
}

export interface PromptInputSuggestionTrigger {
  trigger: string;
  allowSpaces?: boolean;
  allowedPrefixes?: readonly string[] | null;
  maxQueryLength?: number;
  minQueryLength?: number;
  startOfLine?: boolean;
}

export interface PromptInputSuggestionSelectDetails {
  close: () => void;
  match: PromptInputSuggestionMatch;
  replace: (text: string) => void;
  value: string;
}

export interface PromptInputSuggestionsContextValue {
  activeValue: string | null;
  close: () => void;
  match: PromptInputSuggestionMatch | null;
  open: boolean;
  replace: (text: string) => void;
}

export type PromptInputSuggestionsProps = PropsWithChildren<{
  onMatchChange?: (match: PromptInputSuggestionMatch | null) => void;
  onOpenChange?: (open: boolean) => void;
  triggers: readonly PromptInputSuggestionTrigger[];
}>;

interface RegisteredSuggestionItem {
  disabled: boolean;
  element: RefObject<HTMLButtonElement | null>;
  id: string;
  select: () => void;
  value: string;
}

interface SuggestionItemUpdate {
  disabled: boolean;
  value: string;
}

interface PromptInputSuggestionsInternalContext extends PromptInputSuggestionsContextValue {
  activeId: string | null;
  handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  isTextareaTarget: (target: EventTarget | null) => boolean;
  listboxId: string;
  registerItem: (item: RegisteredSuggestionItem) => () => void;
  reset: () => void;
  setActiveId: (id: string) => void;
  setFocused: (focused: boolean) => void;
  setTextarea: (textarea: HTMLTextAreaElement | null) => void;
  updateItem: (id: string, update: SuggestionItemUpdate) => void;
  updateMatch: (
    value: string,
    selectionStart: number | null,
    selectionEnd: number | null
  ) => void;
}

const PromptInputSuggestionsContext =
  createContext<PromptInputSuggestionsInternalContext | null>(null);

const usePromptInputSuggestionsInternal = () =>
  useContext(PromptInputSuggestionsContext);

const usePromptInputSuggestionsContext = () => {
  const context = usePromptInputSuggestionsInternal();
  if (!context) {
    throw new Error(
      "usePromptInputSuggestions must be used within PromptInputSuggestions"
    );
  }
  return context;
};

export const usePromptInputSuggestions =
  (): PromptInputSuggestionsContextValue => usePromptInputSuggestionsContext();

const isSameSuggestionMatch = (
  first: PromptInputSuggestionMatch | null,
  second: PromptInputSuggestionMatch | null
): boolean =>
  first?.trigger === second?.trigger &&
  first?.query === second?.query &&
  first?.range.start === second?.range.start &&
  first?.range.end === second?.range.end;

const findSuggestionMatch = (
  value: string,
  selectionStart: number | null,
  selectionEnd: number | null,
  triggers: readonly PromptInputSuggestionTrigger[]
): PromptInputSuggestionMatch | null => {
  if (
    selectionStart === null ||
    selectionEnd === null ||
    selectionStart !== selectionEnd
  ) {
    return null;
  }

  const valueBeforeCaret = value.slice(0, selectionStart);
  let closestMatch: PromptInputSuggestionMatch | null = null;

  for (const configuration of triggers) {
    const { trigger } = configuration;
    if (trigger.length === 0) {
      continue;
    }

    const triggerIndex = valueBeforeCaret.lastIndexOf(trigger);
    if (triggerIndex === -1) {
      continue;
    }

    const previousCharacter = valueBeforeCaret.at(triggerIndex - 1);
    const isAtStart = triggerIndex === 0;
    const hasAllowedPrefix =
      configuration.allowedPrefixes === null ||
      isAtStart ||
      (previousCharacter !== undefined &&
        (configuration.allowedPrefixes ?? DEFAULT_SUGGESTION_PREFIXES).includes(
          previousCharacter
        ));
    const isAtLineStart = isAtStart || previousCharacter === "\n";

    if (
      (configuration.startOfLine ? !isAtLineStart : !hasAllowedPrefix) ||
      (closestMatch && triggerIndex < closestMatch.range.start)
    ) {
      continue;
    }

    const query = valueBeforeCaret.slice(triggerIndex + trigger.length);
    const containsInvalidWhitespace = configuration.allowSpaces
      ? SUGGESTION_LINE_BREAK_REGEX.test(query)
      : SUGGESTION_WHITESPACE_REGEX.test(query);
    const minQueryLength = configuration.minQueryLength ?? 0;

    if (
      containsInvalidWhitespace ||
      query.length < minQueryLength ||
      (configuration.maxQueryLength !== undefined &&
        query.length > configuration.maxQueryLength)
    ) {
      continue;
    }

    closestMatch = {
      query,
      range: {
        end: selectionStart,
        start: triggerIndex,
      },
      trigger,
    };
  }

  return closestMatch;
};

const sortSuggestionItems = (
  items: RegisteredSuggestionItem[]
): RegisteredSuggestionItem[] =>
  items.sort((first, second) => {
    const firstElement = first.element.current;
    const secondElement = second.element.current;
    if (!(firstElement && secondElement)) {
      return 0;
    }

    const position = firstElement.compareDocumentPosition(secondElement);
    return position === Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

export const PromptInputSuggestions = ({
  children,
  onMatchChange,
  onOpenChange,
  triggers,
}: PromptInputSuggestionsProps) => {
  const listboxId = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const itemsRef = useRef(new Map<string, RegisteredSuggestionItem>());
  const matchRef = useRef<PromptInputSuggestionMatch | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeItem, setActiveItem] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [dismissedMatch, setDismissedMatch] = useState<{
    start: number;
    trigger: string;
  } | null>(null);
  const [focused, setFocused] = useState(false);
  const [match, setMatch] = useState<PromptInputSuggestionMatch | null>(null);
  const activeId = activeItem?.id ?? null;
  const activeValue = activeItem?.value ?? null;

  const activateItem = useCallback((item: RegisteredSuggestionItem) => {
    setActiveItem((currentActiveItem) =>
      currentActiveItem?.id === item.id &&
      currentActiveItem.value === item.value
        ? currentActiveItem
        : { id: item.id, value: item.value }
    );
  }, []);

  const open = Boolean(
    focused &&
    match &&
    !(
      dismissedMatch?.start === match.range.start &&
      dismissedMatch.trigger === match.trigger
    )
  );

  const getEnabledItems = useCallback(
    () =>
      sortSuggestionItems(
        [...itemsRef.current.values()].filter(
          (item) => !item.disabled && item.element.current
        )
      ),
    []
  );

  const reset = useCallback(() => {
    matchRef.current = null;
    setActiveItem(null);
    setDismissedMatch(null);
    setMatch(null);
  }, []);

  const close = useCallback(() => {
    const currentMatch = matchRef.current;
    if (currentMatch) {
      setDismissedMatch({
        start: currentMatch.range.start,
        trigger: currentMatch.trigger,
      });
    }
    setActiveItem(null);
  }, []);

  const isTextareaTarget = useCallback(
    (target: EventTarget | null) => target === textareaRef.current,
    []
  );

  const setTextarea = useCallback(
    (nextTextarea: HTMLTextAreaElement | null) => {
      if (!nextTextarea) {
        textareaRef.current = null;
        formRef.current?.removeEventListener("reset", reset);
        formRef.current = null;
        reset();
        setFocused(false);
        return;
      }

      const nextForm = nextTextarea?.form ?? null;
      if (formRef.current !== nextForm) {
        formRef.current?.removeEventListener("reset", reset);
        nextForm?.addEventListener("reset", reset);
        formRef.current = nextForm;
      }
      textareaRef.current = nextTextarea;
    },
    [reset]
  );

  useEffect(
    () => () => {
      formRef.current?.removeEventListener("reset", reset);
    },
    [reset]
  );

  const updateMatch = useCallback(
    (
      value: string,
      selectionStart: number | null,
      selectionEnd: number | null
    ) => {
      const nextMatch = findSuggestionMatch(
        value,
        selectionStart,
        selectionEnd,
        triggers
      );
      const currentMatch = matchRef.current;

      if (isSameSuggestionMatch(currentMatch, nextMatch)) {
        return;
      }

      const movedToNewContext =
        currentMatch?.trigger !== nextMatch?.trigger ||
        currentMatch?.range.start !== nextMatch?.range.start;
      if (movedToNewContext) {
        setActiveItem(null);
      }

      if (
        !nextMatch ||
        dismissedMatch?.trigger !== nextMatch.trigger ||
        dismissedMatch.start !== nextMatch.range.start
      ) {
        setDismissedMatch(null);
      }

      matchRef.current = nextMatch;
      setMatch(nextMatch);
    },
    [dismissedMatch, triggers]
  );

  const replace = useCallback(
    (replacement: string) => {
      const currentMatch = matchRef.current;
      const target = textareaRef.current;
      if (!(currentMatch && target)) {
        return;
      }

      const nextValue = `${target.value.slice(
        0,
        currentMatch.range.start
      )}${replacement}${target.value.slice(currentMatch.range.end)}`;
      const nextCaret = currentMatch.range.start + replacement.length;
      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
      )?.set;

      reset();
      if (valueSetter) {
        valueSetter.call(target, nextValue);
      } else {
        target.value = nextValue;
      }

      target.focus({ preventScroll: true });
      target.setSelectionRange(nextCaret, nextCaret);
      target.dispatchEvent(new Event("input", { bubbles: true }));
      queueMicrotask(() => target.setSelectionRange(nextCaret, nextCaret));
    },
    [reset]
  );

  const registerItem = useCallback(
    (item: RegisteredSuggestionItem) => {
      itemsRef.current.set(item.id, item);
      setActiveItem((currentActiveItem) => {
        const currentItem = currentActiveItem
          ? itemsRef.current.get(currentActiveItem.id)
          : undefined;
        const nextItem =
          currentItem && !currentItem.disabled
            ? currentItem
            : getEnabledItems().at(0);

        if (!nextItem) {
          return null;
        }

        if (
          currentActiveItem?.id === nextItem.id &&
          currentActiveItem.value === nextItem.value
        ) {
          return currentActiveItem;
        }

        return { id: nextItem.id, value: nextItem.value };
      });

      return () => {
        itemsRef.current.delete(item.id);
        setActiveItem((currentActiveItem) => {
          if (currentActiveItem?.id !== item.id) {
            return currentActiveItem;
          }

          const nextItem = getEnabledItems().at(0);
          return nextItem ? { id: nextItem.id, value: nextItem.value } : null;
        });
      };
    },
    [getEnabledItems]
  );

  const updateItem = useCallback(
    (id: string, update: SuggestionItemUpdate) => {
      const item = itemsRef.current.get(id);
      if (!item) {
        return;
      }

      item.disabled = update.disabled;
      item.value = update.value;
      setActiveItem((currentActiveItem) => {
        if (!currentActiveItem) {
          const nextItem = getEnabledItems().at(0);
          return nextItem ? { id: nextItem.id, value: nextItem.value } : null;
        }

        if (currentActiveItem.id !== id) {
          return currentActiveItem;
        }

        if (update.disabled) {
          const nextItem = getEnabledItems().at(0);
          return nextItem ? { id: nextItem.id, value: nextItem.value } : null;
        }

        return currentActiveItem.value === update.value
          ? currentActiveItem
          : { id, value: update.value };
      });
    },
    [getEnabledItems]
  );

  const setActiveId = useCallback(
    (id: string) => {
      const item = itemsRef.current.get(id);
      if (item && !item.disabled) {
        activateItem(item);
      }
    },
    [activateItem]
  );

  const moveActiveItem = useCallback(
    (direction: 1 | -1): boolean => {
      const items = getEnabledItems();
      if (items.length === 0) {
        return false;
      }

      const currentIndex = items.findIndex((item) => item.id === activeId);
      let nextIndex = (currentIndex + direction + items.length) % items.length;
      if (currentIndex === -1) {
        nextIndex = direction === 1 ? 0 : items.length - 1;
      }
      const nextItem = items[nextIndex];
      if (!nextItem) {
        return false;
      }

      activateItem(nextItem);
      nextItem.element.current?.scrollIntoView?.({ block: "nearest" });
      return true;
    },
    [activateItem, activeId, getEnabledItems]
  );

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      if (!open) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (moveActiveItem(event.key === "ArrowDown" ? 1 : -1)) {
          event.preventDefault();
        }
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        const activeItem = activeId
          ? itemsRef.current.get(activeId)
          : undefined;
        if (activeItem && !activeItem.disabled) {
          event.preventDefault();
          activeItem.select();
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "Tab") {
        close();
      }
    },
    [activeId, close, moveActiveItem, open]
  );

  const handlePopoverOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        close();
      }
    },
    [close]
  );

  const context = useMemo<PromptInputSuggestionsInternalContext>(
    () => ({
      activeId,
      activeValue,
      close,
      handleKeyDown,
      isTextareaTarget,
      listboxId,
      match,
      open,
      registerItem,
      replace,
      reset,
      setActiveId,
      setFocused,
      setTextarea,
      updateItem,
      updateMatch,
    }),
    [
      activeId,
      activeValue,
      close,
      handleKeyDown,
      isTextareaTarget,
      listboxId,
      match,
      open,
      registerItem,
      replace,
      reset,
      setActiveId,
      setTextarea,
      updateItem,
      updateMatch,
    ]
  );

  useEffect(() => onMatchChange?.(match), [match, onMatchChange]);
  useEffect(() => onOpenChange?.(open), [onOpenChange, open]);

  return (
    <PromptInputSuggestionsContext.Provider value={context}>
      <Popover onOpenChange={handlePopoverOpenChange} open={open}>
        {children}
      </Popover>
    </PromptInputSuggestionsContext.Provider>
  );
};

export type PromptInputSuggestionContentProps = ComponentProps<
  typeof PopoverContent
>;

export const PromptInputSuggestionContent = ({
  "aria-label": ariaLabel = "Suggestions",
  align = "start",
  className,
  onCloseAutoFocus,
  onInteractOutside,
  onOpenAutoFocus,
  side = "top",
  sideOffset = 8,
  ...props
}: PromptInputSuggestionContentProps) => {
  const context = usePromptInputSuggestionsContext();
  const { isTextareaTarget } = context;

  const handleCloseAutoFocus = useCallback<
    NonNullable<PromptInputSuggestionContentProps["onCloseAutoFocus"]>
  >(
    (event) => {
      onCloseAutoFocus?.(event);
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
    },
    [onCloseAutoFocus]
  );

  const handleInteractOutside = useCallback<
    NonNullable<PromptInputSuggestionContentProps["onInteractOutside"]>
  >(
    (event) => {
      onInteractOutside?.(event);
      if (isTextareaTarget(event.detail.originalEvent.target)) {
        event.preventDefault();
      }
    },
    [isTextareaTarget, onInteractOutside]
  );

  const handleOpenAutoFocus = useCallback<
    NonNullable<PromptInputSuggestionContentProps["onOpenAutoFocus"]>
  >(
    (event) => {
      onOpenAutoFocus?.(event);
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
    },
    [onOpenAutoFocus]
  );

  return (
    <PopoverContent
      {...props}
      align={align}
      aria-label={ariaLabel}
      className={cn("max-h-72 w-80 overflow-y-auto p-1", className)}
      id={context.listboxId}
      onCloseAutoFocus={handleCloseAutoFocus}
      onInteractOutside={handleInteractOutside}
      onOpenAutoFocus={handleOpenAutoFocus}
      role="listbox"
      side={side}
      sideOffset={sideOffset}
    />
  );
};

export type PromptInputSuggestionItemProps = Omit<
  ComponentProps<"button">,
  "onSelect" | "value"
> & {
  onSelect?: (details: PromptInputSuggestionSelectDetails) => void;
  replaceWith?:
    | string
    | false
    | ((match: PromptInputSuggestionMatch) => string);
  value: string;
};

export const PromptInputSuggestionItem = ({
  children,
  className,
  disabled = false,
  id: idProp,
  onClick,
  onPointerDown,
  onPointerMove,
  onSelect,
  ref,
  replaceWith,
  value,
  ...props
}: PromptInputSuggestionItemProps) => {
  const context = usePromptInputSuggestionsContext();
  const { close, match, registerItem, replace, setActiveId, updateItem } =
    context;

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const disabledRef = useRef(disabled);
  const elementRef = useRef<HTMLButtonElement | null>(null);
  const valueRef = useRef(value);
  const isActive = context.activeId === id;

  const select = useCallback(() => {
    if (!match || disabled) {
      return;
    }

    let didReplace = false;
    const replaceSelection = (replacement: string) => {
      didReplace = true;
      replace(replacement);
    };

    onSelect?.({
      close,
      match,
      replace: replaceSelection,
      value,
    });

    if (replaceWith !== false && !didReplace) {
      const replacement =
        typeof replaceWith === "function"
          ? replaceWith(match)
          : (replaceWith ?? `${match.trigger}${value} `);
      replace(replacement);
    }
    close();
  }, [close, disabled, match, onSelect, replace, replaceWith, value]);

  const selectRef = useRef(select);

  useLayoutEffect(() => {
    selectRef.current = select;
  }, [select]);

  useLayoutEffect(
    () =>
      registerItem({
        disabled: disabledRef.current,
        element: elementRef,
        id,
        select: () => selectRef.current(),
        value: valueRef.current,
      }),
    [id, registerItem]
  );

  useLayoutEffect(() => {
    disabledRef.current = disabled;
    valueRef.current = value;
    updateItem(id, { disabled, value });
  }, [disabled, id, updateItem, value]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        select();
      }
    },
    [onClick, select]
  );

  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      onPointerDown?.(event);
      if (!event.defaultPrevented && !disabled) {
        event.preventDefault();
      }
    },
    [disabled, onPointerDown]
  );

  const handlePointerMove: PointerEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      onPointerMove?.(event);
      if (!event.defaultPrevented && !disabled) {
        setActiveId(id);
      }
    },
    [disabled, id, onPointerMove, setActiveId]
  );

  const handleRef = useCallback(
    (element: HTMLButtonElement | null) => {
      elementRef.current = element;
      setRefValue(ref, element);
    },
    [ref]
  );

  return (
    <button
      {...props}
      aria-selected={isActive}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      data-active={isActive}
      disabled={disabled}
      id={id}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      ref={handleRef}
      role="option"
      tabIndex={-1}
      type="button"
    >
      {children}
    </button>
  );
};

export type PromptInputSuggestionEmptyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputSuggestionEmpty = ({
  className,
  role = "status",
  ...props
}: PromptInputSuggestionEmptyProps) => (
  <div
    {...props}
    className={cn(
      "px-2 py-6 text-center text-muted-foreground text-sm",
      className
    )}
    role={role}
  />
);

export type PromptInputActionAddAttachmentsProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string;
};

export const PromptInputActionAddAttachments = ({
  label = "Add photos or files",
  ...props
}: PromptInputActionAddAttachmentsProps) => {
  const attachments = usePromptInputAttachments();

  const handleSelect = useCallback(
    (e: Event) => {
      e.preventDefault();
      attachments.openFileDialog();
    },
    [attachments]
  );

  return (
    <DropdownMenuItem {...props} onSelect={handleSelect}>
      <ImageIcon className="mr-2 size-4" /> {label}
    </DropdownMenuItem>
  );
};

export type PromptInputActionAddScreenshotProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string;
};

export const PromptInputActionAddScreenshot = ({
  label = "Take screenshot",
  onSelect,
  ...props
}: PromptInputActionAddScreenshotProps) => {
  const attachments = usePromptInputAttachments();

  const handleSelect = useCallback(
    async (event: Event) => {
      onSelect?.(event);
      if (event.defaultPrevented) {
        return;
      }

      try {
        const screenshot = await captureScreenshot();
        if (screenshot) {
          attachments.add([screenshot]);
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "AbortError")
        ) {
          return;
        }
        throw error;
      }
    },
    [onSelect, attachments]
  );

  return (
    <DropdownMenuItem {...props} onSelect={handleSelect}>
      <Monitor className="mr-2 size-4" />
      {label}
    </DropdownMenuItem>
  );
};

export interface PromptInputMessage {
  text: string;
  files: FileUIPart[];
}

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onError"
> & {
  // e.g., "image/*" or leave undefined for any
  accept?: string;
  multiple?: boolean;
  // When true, accepts drops anywhere on document. Default false (opt-in).
  globalDrop?: boolean;
  // Render a hidden input with given name and keep it in sync for native form posts. Default false.
  syncHiddenInput?: boolean;
  // Minimal constraints
  maxFiles?: number;
  // bytes
  maxFileSize?: number;
  onError?: (err: {
    code: "max_files" | "max_file_size" | "accept";
    message: string;
  }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
};

export const PromptInput = ({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  // Try to use a provider controller if present
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  // Refs
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // ----- Local attachments (only used when no provider)
  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const files = usingProvider ? controller.attachments.files : items;

  // ----- Local referenced sources (always local to PromptInput)
  const [referencedSources, setReferencedSources] = useState<
    (SourceDocumentUIPart & { id: string })[]
  >([]);

  // Keep a ref to files for cleanup on unmount (avoids stale closure)
  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const openFileDialogLocal = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === "") {
        return true;
      }

      const patterns = accept
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      return patterns.some((pattern) => {
        if (pattern.endsWith("/*")) {
          // e.g: image/* -> image/
          const prefix = pattern.slice(0, -1);
          return f.type.startsWith(prefix);
        }
        return f.type === pattern;
      });
    },
    [accept]
  );

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = [...fileList];
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        });
        return;
      }
      const withinSize = (f: File) =>
        maxFileSize ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        });
        return;
      }

      setItems((prev) => {
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
        const next: (FileUIPart & { id: string })[] = [];
        for (const file of capped) {
          next.push({
            filename: file.name,
            id: nanoid(),
            mediaType: file.type,
            type: "file",
            url: URL.createObjectURL(file),
          });
        }
        return [...prev, ...next];
      });
    },
    [matchesAccept, maxFiles, maxFileSize, onError]
  );

  const removeLocal = useCallback(
    (id: string) =>
      setItems((prev) => {
        const found = prev.find((file) => file.id === id);
        if (found?.url) {
          URL.revokeObjectURL(found.url);
        }
        return prev.filter((file) => file.id !== id);
      }),
    []
  );

  // Wrapper that validates files before calling provider's add
  const addWithProviderValidation = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = [...fileList];
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        });
        return;
      }
      const withinSize = (f: File) =>
        maxFileSize ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        });
        return;
      }

      const currentCount = files.length;
      const capacity =
        typeof maxFiles === "number"
          ? Math.max(0, maxFiles - currentCount)
          : undefined;
      const capped =
        typeof capacity === "number" ? sized.slice(0, capacity) : sized;
      if (typeof capacity === "number" && sized.length > capacity) {
        onError?.({
          code: "max_files",
          message: "Too many files. Some were not added.",
        });
      }

      if (capped.length > 0) {
        controller?.attachments.add(capped);
      }
    },
    [matchesAccept, maxFileSize, maxFiles, onError, files.length, controller]
  );

  const clearAttachments = useCallback(
    () =>
      usingProvider
        ? controller?.attachments.clear()
        : setItems((prev) => {
            for (const file of prev) {
              if (file.url) {
                URL.revokeObjectURL(file.url);
              }
            }
            return [];
          }),
    [usingProvider, controller]
  );

  const clearReferencedSources = useCallback(
    () => setReferencedSources([]),
    []
  );

  const add = usingProvider ? addWithProviderValidation : addLocal;
  const remove = usingProvider ? controller.attachments.remove : removeLocal;
  const openFileDialog = usingProvider
    ? controller.attachments.openFileDialog
    : openFileDialogLocal;

  const clear = useCallback(() => {
    clearAttachments();
    clearReferencedSources();
  }, [clearAttachments, clearReferencedSources]);

  // Let provider know about our hidden file input so external menus can call openFileDialog()
  useEffect(() => {
    if (!usingProvider) {
      return;
    }
    controller.__registerFileInput(inputRef, () => inputRef.current?.click());
  }, [usingProvider, controller]);

  // Note: File input cannot be programmatically set for security reasons
  // The syncHiddenInput prop is no longer functional
  useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) {
      inputRef.current.value = "";
    }
  }, [files, syncHiddenInput]);

  // Attach drop handlers on nearest form and document (opt-in)
  useEffect(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }
    if (globalDrop) {
      // when global drop is on, let the document-level handler own drops
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
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener("dragover", onDragOver);
    form.addEventListener("drop", onDrop);
    return () => {
      form.removeEventListener("dragover", onDragOver);
      form.removeEventListener("drop", onDrop);
    };
  }, [add, globalDrop]);

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
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, [add, globalDrop]);

  useEffect(
    () => () => {
      if (!usingProvider) {
        for (const f of filesRef.current) {
          if (f.url) {
            URL.revokeObjectURL(f.url);
          }
        }
      }
    },
    [usingProvider]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.currentTarget.files) {
        add(event.currentTarget.files);
      }
      // Reset input value to allow selecting files that were previously removed
      event.currentTarget.value = "";
    },
    [add]
  );

  const attachmentsCtx = useMemo<AttachmentsContext>(
    () => ({
      add,
      clear: clearAttachments,
      fileInputRef: inputRef,
      files: files.map((item) => ({ ...item, id: item.id })),
      openFileDialog,
      remove,
    }),
    [files, add, remove, clearAttachments, openFileDialog]
  );

  const refsCtx = useMemo<ReferencedSourcesContext>(
    () => ({
      add: (incoming: SourceDocumentUIPart[] | SourceDocumentUIPart) => {
        const array = Array.isArray(incoming) ? incoming : [incoming];
        setReferencedSources((prev) => [
          ...prev,
          ...array.map((s) => ({ ...s, id: nanoid() })),
        ]);
      },
      clear: clearReferencedSources,
      remove: (id: string) => {
        setReferencedSources((prev) => prev.filter((s) => s.id !== id));
      },
      sources: referencedSources,
    }),
    [referencedSources, clearReferencedSources]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      const text = usingProvider
        ? controller.textInput.value
        : (() => {
            const formData = new FormData(form);
            return (formData.get("message") as string) || "";
          })();

      // Reset form immediately after capturing text to avoid race condition
      // where user input during async blob conversion would be lost
      if (!usingProvider) {
        form.reset();
      }

      try {
        // Convert blob URLs to data URLs asynchronously
        const convertedFiles: FileUIPart[] = await Promise.all(
          files.map(async ({ id: _id, ...item }) => {
            if (item.url?.startsWith("blob:")) {
              const dataUrl = await convertBlobUrlToDataUrl(item.url);
              // If conversion failed, keep the original blob URL
              return {
                ...item,
                url: dataUrl ?? item.url,
              };
            }
            return item;
          })
        );

        const result = onSubmit({ files: convertedFiles, text }, event);

        // Handle both sync and async onSubmit
        if (result instanceof Promise) {
          try {
            await result;
            clear();
            if (usingProvider) {
              controller.textInput.clear();
            }
          } catch {
            // Don't clear on error - user may want to retry
          }
        } else {
          // Sync function completed without throwing, clear inputs
          clear();
          if (usingProvider) {
            controller.textInput.clear();
          }
        }
      } catch {
        // Don't clear on error - user may want to retry
      }
    },
    [usingProvider, controller, files, onSubmit, clear]
  );

  // Render with or without local provider
  const inner = (
    <>
      <input
        accept={accept}
        aria-label="Upload files"
        className="hidden"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        title="Upload files"
        type="file"
      />
      <form
        className={cn("w-full", className)}
        onSubmit={handleSubmit}
        ref={formRef}
        {...props}
      >
        <InputGroup className="overflow-hidden">{children}</InputGroup>
      </form>
    </>
  );

  const withReferencedSources = (
    <LocalReferencedSourcesContext.Provider value={refsCtx}>
      {inner}
    </LocalReferencedSourcesContext.Provider>
  );

  // Always provide LocalAttachmentsContext so children get validated add function
  return (
    <LocalAttachmentsContext.Provider value={attachmentsCtx}>
      {withReferencedSources}
    </LocalAttachmentsContext.Provider>
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputBody = ({
  className,
  ...props
}: PromptInputBodyProps) => (
  <div className={cn("contents", className)} {...props} />
);

export type PromptInputTextareaProps = ComponentProps<
  typeof InputGroupTextarea
>;

export const PromptInputTextarea = ({
  "aria-activedescendant": ariaActiveDescendant,
  "aria-autocomplete": ariaAutocomplete,
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHasPopup,
  className,
  name = "message",
  onBlur,
  onChange,
  onCompositionEnd,
  onCompositionStart,
  onFocus,
  onKeyDown,
  onPaste,
  onSelect,
  placeholder = "What would you like to know?",
  ref,
  role,
  value,
  ...props
}: PromptInputTextareaProps) => {
  const controller = useOptionalPromptInputController();
  const attachments = usePromptInputAttachments();
  const suggestions = usePromptInputSuggestionsInternal();
  const handleSuggestionKeyDown = suggestions?.handleKeyDown;
  const resetSuggestions = suggestions?.reset;
  const setSuggestionFocused = suggestions?.setFocused;
  const setSuggestionTextarea = suggestions?.setTextarea;
  const updateSuggestionMatch = suggestions?.updateMatch;
  const isComposingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleRef = useCallback(
    (textarea: HTMLTextAreaElement | null) => {
      textareaRef.current = textarea;
      if (textarea) {
        setSuggestionTextarea?.(textarea);
      }
      setRefValue(ref, textarea);
    },
    [ref, setSuggestionTextarea]
  );

  const updateSuggestions = useCallback(
    (textarea: HTMLTextAreaElement) => {
      updateSuggestionMatch?.(
        textarea.value,
        textarea.selectionStart,
        textarea.selectionEnd
      );
    },
    [updateSuggestionMatch]
  );

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      setSuggestionTextarea?.(event.currentTarget);

      // Call the external onKeyDown handler first
      onKeyDown?.(event);

      // If the external handler prevented default, don't run internal logic
      if (event.defaultPrevented) {
        return;
      }

      if (isComposingRef.current || event.nativeEvent.isComposing) {
        return;
      }

      handleSuggestionKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Enter") {
        if (event.shiftKey) {
          return;
        }
        event.preventDefault();

        // Check if the submit button is disabled before submitting
        const { form } = event.currentTarget;
        const submitButton = form?.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement | null;
        if (submitButton?.disabled) {
          return;
        }

        form?.requestSubmit();
      }

      // Remove last attachment when Backspace is pressed and textarea is empty
      if (
        event.key === "Backspace" &&
        event.currentTarget.value === "" &&
        attachments.files.length > 0
      ) {
        event.preventDefault();
        const lastAttachment = attachments.files.at(-1);
        if (lastAttachment) {
          attachments.remove(lastAttachment.id);
        }
      }
    },
    [attachments, handleSuggestionKeyDown, onKeyDown, setSuggestionTextarea]
  );

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onPaste?.(event);
      if (event.defaultPrevented) {
        return;
      }

      const items = event.clipboardData?.items;

      if (!items) {
        return;
      }

      const files: File[] = [];

      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        event.preventDefault();
        attachments.add(files);
      }
    },
    [attachments, onPaste]
  );

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      controller?.textInput.setInput(event.currentTarget.value);
      onChange?.(event);

      const nativeEventIsComposing =
        "isComposing" in event.nativeEvent &&
        event.nativeEvent.isComposing === true;
      if (!(isComposingRef.current || nativeEventIsComposing)) {
        updateSuggestions(event.currentTarget);
      }
    },
    [controller, onChange, updateSuggestions]
  );

  const handleCompositionStart: CompositionEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event) => {
        onCompositionStart?.(event);
        isComposingRef.current = true;
        resetSuggestions?.();
      },
      [onCompositionStart, resetSuggestions]
    );

  const handleCompositionEnd: CompositionEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event) => {
        onCompositionEnd?.(event);
        isComposingRef.current = false;
        updateSuggestions(event.currentTarget);
      },
      [onCompositionEnd, updateSuggestions]
    );

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onFocus?.(event);
      setSuggestionTextarea?.(event.currentTarget);
      setSuggestionFocused?.(true);
      updateSuggestions(event.currentTarget);
    },
    [onFocus, setSuggestionFocused, setSuggestionTextarea, updateSuggestions]
  );

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onBlur?.(event);
      setSuggestionFocused?.(false);
    },
    [onBlur, setSuggestionFocused]
  );

  const handleSelect: ReactEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onSelect?.(event);
      if (!isComposingRef.current) {
        updateSuggestions(event.currentTarget);
      }
    },
    [onSelect, updateSuggestions]
  );

  useEffect(
    () => () => {
      setSuggestionTextarea?.(null);
    },
    [setSuggestionTextarea]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      updateSuggestions(textarea);
    }
  }, [controller?.textInput.value, updateSuggestions, value]);

  const textarea = (
    <InputGroupTextarea
      {...props}
      aria-activedescendant={
        ariaActiveDescendant ??
        (suggestions?.open ? (suggestions.activeId ?? undefined) : undefined)
      }
      aria-autocomplete={ariaAutocomplete ?? (suggestions ? "list" : undefined)}
      aria-controls={
        ariaControls ?? (suggestions ? suggestions.listboxId : undefined)
      }
      aria-expanded={
        ariaExpanded ?? (suggestions ? suggestions.open : undefined)
      }
      aria-haspopup={ariaHasPopup ?? (suggestions ? "listbox" : undefined)}
      className={cn("field-sizing-content max-h-48 min-h-16", className)}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      onCompositionEnd={handleCompositionEnd}
      onCompositionStart={handleCompositionStart}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onSelect={handleSelect}
      placeholder={placeholder}
      ref={handleRef}
      role={role ?? (suggestions ? "combobox" : undefined)}
      value={controller ? controller.textInput.value : value}
    />
  );

  return suggestions ? (
    <PopoverAnchor asChild data-slot="input-group-control">
      {textarea}
    </PopoverAnchor>
  ) : (
    textarea
  );
};

export type PromptInputHeaderProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  "align"
>;

export const PromptInputHeader = ({
  className,
  ...props
}: PromptInputHeaderProps) => (
  <InputGroupAddon
    align="block-end"
    className={cn("order-first flex-wrap gap-1", className)}
    {...props}
  />
);

export type PromptInputFooterProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  "align"
>;

export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon
    align="block-end"
    className={cn("justify-between gap-1", className)}
    {...props}
  />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTools = ({
  className,
  ...props
}: PromptInputToolsProps) => (
  <div
    className={cn("flex min-w-0 items-center gap-1", className)}
    {...props}
  />
);

export type PromptInputButtonTooltip =
  | string
  | {
      content: ReactNode;
      shortcut?: string;
      side?: ComponentProps<typeof TooltipContent>["side"];
    };

export type PromptInputButtonProps = ComponentProps<typeof InputGroupButton> & {
  tooltip?: PromptInputButtonTooltip;
};

export const PromptInputButton = ({
  variant = "ghost",
  className,
  size,
  tooltip,
  ...props
}: PromptInputButtonProps) => {
  const newSize =
    size ?? (Children.count(props.children) > 1 ? "sm" : "icon-sm");

  const button = (
    <InputGroupButton
      className={cn(className)}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  const tooltipContent =
    typeof tooltip === "string" ? tooltip : tooltip.content;
  const shortcut = typeof tooltip === "string" ? undefined : tooltip.shortcut;
  const side = typeof tooltip === "string" ? "top" : (tooltip.side ?? "top");

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={side}>
        {tooltipContent}
        {shortcut && (
          <span className="ml-2 text-muted-foreground">{shortcut}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
);

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export const PromptInputActionMenuTrigger = ({
  className,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger asChild>
    <PromptInputButton className={className} {...props}>
      {children ?? <PlusIcon className="size-4" />}
    </PromptInputButton>
  </DropdownMenuTrigger>
);

export type PromptInputActionMenuContentProps = ComponentProps<
  typeof DropdownMenuContent
>;
export const PromptInputActionMenuContent = ({
  className,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent align="start" className={cn(className)} {...props} />
);

export type PromptInputActionMenuItemProps = ComponentProps<
  typeof DropdownMenuItem
>;
export const PromptInputActionMenuItem = ({
  className,
  ...props
}: PromptInputActionMenuItemProps) => (
  <DropdownMenuItem className={cn(className)} {...props} />
);

// Note: Actions that perform side-effects (like opening a file dialog)
// are provided in opt-in modules (e.g., prompt-input-attachments).

export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
  status?: ChatStatus;
  onStop?: () => void;
};

export const PromptInputSubmit = ({
  className,
  variant = "default",
  size = "icon-sm",
  status,
  onStop,
  onClick,
  children,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === "submitted" || status === "streaming";

  let Icon = <CornerDownLeftIcon className="size-4" />;

  if (status === "submitted") {
    Icon = <Spinner />;
  } else if (status === "streaming") {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === "error") {
    Icon = <XIcon className="size-4" />;
  }

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isGenerating && onStop) {
        e.preventDefault();
        onStop();
        return;
      }
      onClick?.(e);
    },
    [isGenerating, onStop, onClick]
  );

  return (
    <InputGroupButton
      aria-label={isGenerating ? "Stop" : "Submit"}
      className={cn(className)}
      onClick={handleClick}
      size={size}
      type={isGenerating && onStop ? "button" : "submit"}
      variant={variant}
      {...props}
    >
      {children ?? Icon}
    </InputGroupButton>
  );
};

export type PromptInputSelectProps = ComponentProps<typeof Select>;

export const PromptInputSelect = (props: PromptInputSelectProps) => (
  <Select {...props} />
);

export type PromptInputSelectTriggerProps = ComponentProps<
  typeof SelectTrigger
>;

export const PromptInputSelectTrigger = ({
  className,
  ...props
}: PromptInputSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
      className
    )}
    {...props}
  />
);

export type PromptInputSelectContentProps = ComponentProps<
  typeof SelectContent
>;

export const PromptInputSelectContent = ({
  className,
  ...props
}: PromptInputSelectContentProps) => (
  <SelectContent className={cn(className)} {...props} />
);

export type PromptInputSelectItemProps = ComponentProps<typeof SelectItem>;

export const PromptInputSelectItem = ({
  className,
  ...props
}: PromptInputSelectItemProps) => (
  <SelectItem className={cn(className)} {...props} />
);

export type PromptInputSelectValueProps = ComponentProps<typeof SelectValue>;

export const PromptInputSelectValue = ({
  className,
  ...props
}: PromptInputSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
);

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) => (
  <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
);

export type PromptInputHoverCardTriggerProps = ComponentProps<
  typeof HoverCardTrigger
>;

export const PromptInputHoverCardTrigger = (
  props: PromptInputHoverCardTriggerProps
) => <HoverCardTrigger {...props} />;

export type PromptInputHoverCardContentProps = ComponentProps<
  typeof HoverCardContent
>;

export const PromptInputHoverCardContent = ({
  align = "start",
  ...props
}: PromptInputHoverCardContentProps) => (
  <HoverCardContent align={align} {...props} />
);

export type PromptInputTabsListProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabsList = ({
  className,
  ...props
}: PromptInputTabsListProps) => <div className={cn(className)} {...props} />;

export type PromptInputTabProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTab = ({
  className,
  ...props
}: PromptInputTabProps) => <div className={cn(className)} {...props} />;

export type PromptInputTabLabelProps = HTMLAttributes<HTMLHeadingElement>;

export const PromptInputTabLabel = ({
  className,
  ...props
}: PromptInputTabLabelProps) => (
  // Content provided via children in props
  // oxlint-disable-next-line eslint-plugin-jsx-a11y(heading-has-content)
  <h3
    className={cn(
      "mb-2 px-3 font-medium text-muted-foreground text-xs",
      className
    )}
    {...props}
  />
);

export type PromptInputTabBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabBody = ({
  className,
  ...props
}: PromptInputTabBodyProps) => (
  <div className={cn("space-y-1", className)} {...props} />
);

export type PromptInputTabItemProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabItem = ({
  className,
  ...props
}: PromptInputTabItemProps) => (
  <div
    className={cn(
      "flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent",
      className
    )}
    {...props}
  />
);

export type PromptInputCommandProps = ComponentProps<typeof Command>;

export const PromptInputCommand = ({
  className,
  ...props
}: PromptInputCommandProps) => <Command className={cn(className)} {...props} />;

export type PromptInputCommandInputProps = ComponentProps<typeof CommandInput>;

export const PromptInputCommandInput = ({
  className,
  ...props
}: PromptInputCommandInputProps) => (
  <CommandInput className={cn(className)} {...props} />
);

export type PromptInputCommandListProps = ComponentProps<typeof CommandList>;

export const PromptInputCommandList = ({
  className,
  ...props
}: PromptInputCommandListProps) => (
  <CommandList className={cn(className)} {...props} />
);

export type PromptInputCommandEmptyProps = ComponentProps<typeof CommandEmpty>;

export const PromptInputCommandEmpty = ({
  className,
  ...props
}: PromptInputCommandEmptyProps) => (
  <CommandEmpty className={cn(className)} {...props} />
);

export type PromptInputCommandGroupProps = ComponentProps<typeof CommandGroup>;

export const PromptInputCommandGroup = ({
  className,
  ...props
}: PromptInputCommandGroupProps) => (
  <CommandGroup className={cn(className)} {...props} />
);

export type PromptInputCommandItemProps = ComponentProps<typeof CommandItem>;

export const PromptInputCommandItem = ({
  className,
  ...props
}: PromptInputCommandItemProps) => (
  <CommandItem className={cn(className)} {...props} />
);

export type PromptInputCommandSeparatorProps = ComponentProps<
  typeof CommandSeparator
>;

export const PromptInputCommandSeparator = ({
  className,
  ...props
}: PromptInputCommandSeparatorProps) => (
  <CommandSeparator className={cn(className)} {...props} />
);
