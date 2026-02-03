"use client";

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@repo/elements/attachments";
import { nanoid } from "nanoid";
import { useState } from "react";

const initialAttachments = [
  {
    filename: "mountain-landscape.jpg",
    id: nanoid(),
    mediaType: "image/jpeg",
    type: "file" as const,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
  {
    filename: "quarterly-report-2024.pdf",
    id: nanoid(),
    mediaType: "application/pdf",
    type: "file" as const,
    url: "",
  },
  {
    filename: "product-demo.mp4",
    id: nanoid(),
    mediaType: "video/mp4",
    type: "file" as const,
    url: "",
  },
  {
    filename: "api-reference",
    id: nanoid(),
    mediaType: "text/html",
    title: "API Documentation",
    type: "source-document" as const,
    url: "https://docs.example.com/api",
  },
  {
    filename: "meeting-recording.mp3",
    id: nanoid(),
    mediaType: "audio/mpeg",
    type: "file" as const,
    url: "",
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
