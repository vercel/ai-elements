import { render, screen } from "@testing-library/react";

import type { AttachmentData } from "../src/attachments";

import { Attachment, AttachmentRemove, Attachments } from "../src/attachments";

const file: AttachmentData = {
  filename: "notes.txt",
  id: "file-1",
  mediaType: "text/plain",
  type: "file",
  url: "data:text/plain;base64,aGVsbG8=",
};

describe("attachmentRemove", () => {
  it("is visible on keyboard focus and on touch screens in the grid variant", () => {
    render(
      <Attachments variant="grid">
        <Attachment data={file} onRemove={vi.fn()}>
          <AttachmentRemove />
        </Attachment>
      </Attachments>
    );

    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass(
      "focus-visible:opacity-100",
      "pointer-coarse:opacity-100"
    );
  });

  it("is visible on keyboard focus and on touch screens in the inline variant", () => {
    render(
      <Attachments variant="inline">
        <Attachment data={file} onRemove={vi.fn()}>
          <AttachmentRemove />
        </Attachment>
      </Attachments>
    );

    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass(
      "focus-visible:opacity-100",
      "pointer-coarse:opacity-100"
    );
  });
});
