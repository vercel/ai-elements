"use client";

import type { PromptInputMessage } from "@repo/elements/prompt-input";
import type { ChangeEventHandler, KeyboardEventHandler } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@repo/elements/conversation";
import {
  Message,
  MessageActions,
  MessageContent,
  MessageQuote,
  MessageReply,
  MessageResponse,
} from "@repo/elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@repo/elements/prompt-input";
import { ReplyIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useId, useRef, useState } from "react";

interface Quote {
  messageId: string;
  text: string;
  from: "user" | "assistant";
}

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  text: string;
  quote?: Quote;
}

const initialMessages: ChatMessage[] = [
  {
    from: "user",
    id: "question",
    text: "What makes a good loading state?",
  },
  {
    from: "assistant",
    id: "answer",
    text: "Keep the user's context visible while work happens in the background.\n\nA good loading state explains **what is happening**, preserves the current layout, and lets the user keep working. For longer tasks, show progress and provide a way to cancel.",
  },
];

const ReplyMessage = ({
  message,
  onReply,
}: {
  message: ChatMessage;
  onReply: (quote: Quote) => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const handleReply = useCallback(
    (text: string) =>
      onReply({ from: message.from, messageId: message.id, text }),
    [message.from, message.id, onReply]
  );

  return (
    <Message from={message.from}>
      {message.quote && (
        <MessageQuote label={`Replying to ${message.quote.from}`}>
          {message.quote.text}
        </MessageQuote>
      )}
      <MessageContent ref={contentRef}>
        <MessageResponse>{message.text}</MessageResponse>
      </MessageContent>
      <MessageActions
        className={message.from === "user" ? "justify-end" : undefined}
      >
        <MessageReply
          aria-label={`Reply to ${message.from}`}
          onReply={handleReply}
          selectionRef={contentRef}
          size="sm"
          text={message.text}
        >
          <ReplyIcon aria-hidden="true" className="size-4" />
          Reply
        </MessageReply>
      </MessageActions>
    </Message>
  );
};

const Example = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);
  const quoteId = useId();
  const hintId = useId();

  const handleReply = useCallback((nextQuote: Quote) => {
    setQuote(nextQuote);
    setAnnouncement(`Quote added. Replying to ${nextQuote.from}.`);
    inputRef.current?.focus();
  }, []);

  const removeQuote = useCallback(() => {
    setQuote(null);
    setAnnouncement("Quote removed.");
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    ({ text }: PromptInputMessage) => {
      if (!text.trim()) {
        return;
      }

      // Local preview. In an app, keep the draft and quote until sending succeeds.
      setMessages((current) => [
        ...current,
        { from: "user", id: nanoid(), quote: quote ?? undefined, text },
      ]);
      setInput("");
      setQuote(null);
      setAnnouncement("Reply added to the conversation.");
      inputRef.current?.focus();
    },
    [quote]
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => setInput(event.currentTarget.value),
    []
  );
  const handleCompositionStart = useCallback(() => {
    composing.current = true;
  }, []);
  const handleCompositionEnd = useCallback(() => {
    composing.current = false;
  }, []);
  const handleInputKeyDown = useCallback<
    KeyboardEventHandler<HTMLTextAreaElement>
  >((event) => {
    // Some IMEs dispatch their confirmation Enter after compositionend.
    if (event.key === "Enter" && event.keyCode === 229) {
      event.preventDefault();
    }
  }, []);
  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLFormElement>>(
    (event) => {
      if (
        event.key !== "Escape" ||
        !quote ||
        event.defaultPrevented ||
        composing.current ||
        event.nativeEvent.isComposing ||
        event.keyCode === 229
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      removeQuote();
    },
    [quote, removeQuote]
  );

  return (
    <div className="flex h-full min-h-96 flex-col gap-4">
      <p className="text-muted-foreground text-sm" id={hintId}>
        Select part of a message, then choose Reply to quote it. Without a
        selection, Reply quotes the whole message.
      </p>
      <Conversation>
        <ConversationContent className="gap-6 p-0">
          {messages.map((message) => (
            <ReplyMessage
              key={message.id}
              message={message}
              onReply={handleReply}
            />
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput
        onCompositionEndCapture={handleCompositionEnd}
        onCompositionStartCapture={handleCompositionStart}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
      >
        {quote && (
          <PromptInputHeader>
            <MessageQuote
              label={`Replying to ${quote.from}`}
              onRemove={removeQuote}
            >
              {quote.text}
            </MessageQuote>
          </PromptInputHeader>
        )}
        <PromptInputTextarea
          aria-describedby={quote ? `${hintId} ${quoteId}` : hintId}
          aria-label="Your reply"
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Write a reply…"
          ref={inputRef}
          value={input}
        />
        <PromptInputFooter>
          <span className="text-muted-foreground text-xs" id={quoteId}>
            {quote
              ? "Esc to remove quote"
              : "Enter to send · Shift+Enter for a new line"}
          </span>
          <PromptInputSubmit aria-label="Send reply" disabled={!input.trim()} />
        </PromptInputFooter>
      </PromptInput>
      <span aria-atomic="true" className="sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
};

export default Example;
