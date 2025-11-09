"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyMarkdownProps = {
  text: string;
};

export const CopyMarkdown = ({ text }: CopyMarkdownProps) => {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    setLoading(true);

    try {
      await navigator.clipboard.writeText(text);
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
