"use client";

import {
  Attachment,
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
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
    mediaType: "image/jpeg",
    filename: "ocean-sunset.jpg",
  },
  {
    id: nanoid(),
    type: "file" as const,
    url: "",
    mediaType: "application/pdf",
    filename: "document.pdf",
  },
  {
    id: nanoid(),
    type: "file" as const,
    url: "",
    mediaType: "video/mp4",
    filename: "video.mp4",
  },
];

const Example = () => {
  const [attachments, setAttachments] = useState(initialAttachments);

  const handleRemove = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Attachments variant="grid">
        {attachments.map((attachment) => (
          <Attachment
            data={attachment}
            key={attachment.id}
            onRemove={() => handleRemove(attachment.id)}
          >
            <AttachmentPreview />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </div>
  );
};

export default Example;
