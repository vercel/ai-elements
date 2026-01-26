"use client";

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
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
    filename: "quarterly-report-2024.pdf",
  },
  {
    id: nanoid(),
    type: "file" as const,
    url: "",
    mediaType: "video/mp4",
    filename: "product-demo.mp4",
  },
  {
    id: nanoid(),
    type: "source-document" as const,
    title: "API Documentation",
    url: "https://docs.example.com/api",
    mediaType: "text/html",
    filename: "api-reference",
  },
  {
    id: nanoid(),
    type: "file" as const,
    url: "",
    mediaType: "audio/mpeg",
    filename: "meeting-recording.mp3",
  },
];

const Example = () => {
  const [attachments, setAttachments] = useState(initialAttachments);

  const handleRemove = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Attachments className="w-full max-w-md" variant="list">
        {attachments.map((attachment) => (
          <Attachment
            data={attachment}
            key={attachment.id}
            onRemove={() => handleRemove(attachment.id)}
          >
            <AttachmentPreview />
            <AttachmentInfo showMediaType />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </div>
  );
};

export default Example;
