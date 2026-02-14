"use client";

import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from "@/components/ai-elements/jsx-preview";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

const handleError = (error: Error) => {
  console.log("JSX Parse Error:", error);
};

const fullJsx = `<div className="rounded-lg border bg-card p-6 shadow-sm">
  <div className="flex items-center gap-4 mb-4">
    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
      <span className="text-primary text-xl font-bold">AI</span>
    </div>
    <div>
      <h2 className="text-lg font-semibold">AI-Generated Component</h2>
      <p className="text-sm text-muted-foreground">Rendered from JSX string</p>
    </div>
  </div>
  <div className="space-y-3">
    <p className="text-sm">This component was dynamically rendered from a JSX string. The JSXPreview component supports streaming mode, automatically closing unclosed tags as content arrives.</p>
    <div className="flex gap-2">
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">React</span>
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Streaming</span>
      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Dynamic</span>
    </div>
  </div>
  <div className="mt-4 pt-4 border-t">
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">Generated just now</span>
      <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
        Learn more
      </button>
    </div>
  </div>
</div>`;

const Example = () => {
  const [streamedJsx, setStreamedJsx] = useState(fullJsx);
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateStreaming = useCallback(() => {
    setIsStreaming(true);
    setStreamedJsx("");
    let index = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (index < fullJsx.length) {
        setStreamedJsx(fullJsx.slice(0, index + 15));
        index += 15;
      } else {
        setIsStreaming(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 30);
  }, []);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    []
  );

  return (
    <div className="space-y-4">
      <Button
        disabled={isStreaming}
        onClick={simulateStreaming}
        size="sm"
        variant="outline"
      >
        {isStreaming ? "Streaming..." : "Simulate Streaming"}
      </Button>

      <JSXPreview
        className="min-h-[200px]"
        isStreaming={isStreaming}
        jsx={streamedJsx}
        onError={handleError}
      >
        <JSXPreviewContent />
        <JSXPreviewError className="mt-2" />
      </JSXPreview>
    </div>
  );
};

export default Example;
