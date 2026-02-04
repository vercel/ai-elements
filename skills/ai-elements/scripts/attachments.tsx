"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import { nanoid } from "nanoid";
import { memo, useCallback, useState } from "react";

const initialAttachments = [
  {
    filename: "mountain-landscape.jpg",
    id: nanoid(),
    mediaType: "image/jpeg",
    type: "file" as const,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  },
  {
    filename: "ocean-sunset.jpg",
    id: nanoid(),
    mediaType: "image/jpeg",
    type: "file" as const,
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
  },
  {
    filename: "document.pdf",
    id: nanoid(),
    mediaType: "application/pdf",
    type: "file" as const,
    url: "",
  },
  {
    filename: "video.mp4",
    id: nanoid(),
    mediaType: "video/mp4",
    type: "file" as const,
    url: "",
  },
];

interface AttachmentItemProps {
  attachment: (typeof initialAttachments)[0];
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment data={attachment} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

const Example = () => {
  const [attachments, setAttachments] = useState(initialAttachments);

  const handleRemove = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <div className="flex items-center justify-center p-8">
      <Attachments variant="grid">
        {attachments.map((attachment) => (
          <AttachmentItem
            attachment={attachment}
            key={attachment.id}
            onRemove={handleRemove}
          />
        ))}
      </Attachments>
    </div>
  );
};

export default Example;
