"use client";

import { MessageCircleIcon } from "lucide-react";
import { useChatContext } from "@/hooks/geistdocs/use-chat";

type AskAIProps = {
  query: string;
};

export const AskAI = ({ query }: AskAIProps) => {
  const { setIsOpen, setPrompt } = useChatContext();

  return (
    <button
      className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      onClick={() => {
        setPrompt(query);
        setIsOpen(true);
      }}
      type="button"
    >
      <MessageCircleIcon className="size-3.5" />
      <span>Ask AI about this page</span>
    </button>
  );
};
