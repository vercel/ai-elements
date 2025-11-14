import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from "@repo/elements/open-in-chat";
import { ExternalLinkIcon } from "lucide-react";

type OpenInChatProps = {
  query: string;
};

export const OpenInChat = ({ query }: OpenInChatProps) => (
  <OpenIn query={query}>
    <OpenInTrigger asChild>
      <button
        className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        type="button"
      >
        <ExternalLinkIcon className="size-4" />
        Open in chat
      </button>
    </OpenInTrigger>
    <OpenInContent align="start" side="top">
      <OpenInv0 />
      <OpenInSeparator />
      <OpenInChatGPT />
      <OpenInClaude />
      <OpenInT3 />
      <OpenInScira />
      <OpenInCursor />
    </OpenInContent>
  </OpenIn>
);
