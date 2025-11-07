"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const cache = new Map<string, string>();

type CopyMarkdownProps = {
  markdownUrl: string;
};

export const CopyMarkdown = ({ markdownUrl }: CopyMarkdownProps) => {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) {
      navigator.clipboard.writeText(cached);
      return;
    }

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);

            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Button
      className="shadow-none"
      disabled={isLoading}
      onClick={onClick}
      size="sm"
      type="button"
      variant="outline"
    >
      {checked ? <Check /> : <Copy />}
      Copy Markdown
    </Button>
  );
};
