"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext } from "react";

type TranscriptionSegment = TranscriptionResult["segments"][number];

type TranscriptionContextValue = {
  segments: TranscriptionSegment[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onSeek?: (time: number) => void;
};

const TranscriptionContext = createContext<TranscriptionContextValue | null>(
  null
);

const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) {
    throw new Error(
      "Transcription components must be used within Transcription"
    );
  }
  return context;
};

export type TranscriptionProps = Omit<ComponentProps<"div">, "children"> & {
  segments: TranscriptionSegment[];
  currentTime?: number;
  onSeek?: (time: number) => void;
  children: (segment: TranscriptionSegment, index: number) => ReactNode;
};

export const Transcription = ({
  segments,
  currentTime: externalCurrentTime,
  onSeek,
  className,
  children,
  ...props
}: TranscriptionProps) => {
  const [currentTime, setCurrentTime] = useControllableState({
    prop: externalCurrentTime,
    defaultProp: 0,
    onChange: onSeek,
  });

  return (
    <TranscriptionContext.Provider
      value={{
        segments,
        currentTime,
        onTimeUpdate: setCurrentTime,
        onSeek,
      }}
    >
      <div
        className={cn(
          "flex flex-wrap gap-1 text-sm leading-relaxed",
          className
        )}
        data-slot="transcription"
        {...props}
      >
        {segments
          .filter((segment) => segment.text.trim())
          .map((segment, index) => children(segment, index))}
      </div>
    </TranscriptionContext.Provider>
  );
};

export type TranscriptionSegmentProps = ComponentProps<"button"> & {
  segment: TranscriptionSegment;
  index: number;
};

export const TranscriptionSegment = ({
  segment,
  index,
  className,
  onClick,
  ...props
}: TranscriptionSegmentProps) => {
  const { currentTime, onSeek } = useTranscription();

  const isActive =
    currentTime >= segment.startSecond && currentTime < segment.endSecond;
  const isPast = currentTime >= segment.endSecond;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onSeek) {
      onSeek(segment.startSecond);
    }
    onClick?.(event);
  };

  return (
    <button
      className={cn(
        "inline text-left",
        isActive && "text-primary",
        isPast && "text-muted-foreground",
        !(isActive || isPast) && "text-muted-foreground/60",
        onSeek && "cursor-pointer hover:text-foreground",
        !onSeek && "cursor-default",
        className
      )}
      data-active={isActive}
      data-index={index}
      data-slot="transcription-segment"
      onClick={handleClick}
      type="button"
      {...props}
    >
      {segment.text}
    </button>
  );
};
