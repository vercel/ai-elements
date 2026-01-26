"use client";

import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
} from "@/components/ai-elements/attachments";
import { nanoid } from "nanoid";
import { useState } from "react";

const initialAttachments = [
  {
    id: nanoid(),
    type: "file" as const,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    mediaType: "image/jpeg",
    filename: "mountain-landscape.jpg",
  },
  {
    id: nanoid(),
    type: "file" as const,
    url: "",
    mediaType: "application/pdf",
    filename: "quarterly-report.pdf",
  },
  {
    id: nanoid(),
    type: "source-document" as const,
    title: "React Documentation",
    url: "https://react.dev",
    mediaType: "text/html",
  },
  {
    id: nanoid(),
    type: "file" as const,
    url: "",
    mediaType: "audio/mp3",
    filename: "podcast-episode.mp3",
  },
];

const Example = () => {
  const [attachments, setAttachments] = useState(initialAttachments);

  const handleRemove = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Attachments variant="inline">
        {attachments.map((attachment) => {
          const mediaCategory = getMediaCategory(attachment);
          const label = getAttachmentLabel(attachment);

          return (
            <AttachmentHoverCard key={attachment.id}>
              <AttachmentHoverCardTrigger asChild>
                <Attachment
                  data={attachment}
                  onRemove={() => handleRemove(attachment.id)}
                >
                  <div className="relative size-5 shrink-0">
                    <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
                      <AttachmentPreview />
                    </div>
                    <AttachmentRemove className="absolute inset-0" />
                  </div>
                  <AttachmentInfo />
                </Attachment>
              </AttachmentHoverCardTrigger>
              <AttachmentHoverCardContent>
                <div className="space-y-3">
                  {mediaCategory === "image" &&
                    attachment.type === "file" &&
                    attachment.url && (
                      <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
                        <img
                          alt={label}
                          className="max-h-full max-w-full object-contain"
                          height={384}
                          src={attachment.url}
                          width={320}
                        />
                      </div>
                    )}
                  <div className="space-y-1 px-0.5">
                    <h4 className="font-semibold text-sm leading-none">
                      {label}
                    </h4>
                    {attachment.mediaType && (
                      <p className="font-mono text-muted-foreground text-xs">
                        {attachment.mediaType}
                      </p>
                    )}
                  </div>
                </div>
              </AttachmentHoverCardContent>
            </AttachmentHoverCard>
          );
        })}
      </Attachments>
    </div>
  );
};

export default Example;
