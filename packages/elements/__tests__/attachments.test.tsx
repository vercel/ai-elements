import { render, screen } from "@testing-library/react";

import type { AttachmentData } from "../src/attachments";
import { Attachment, AttachmentPreview, Attachments } from "../src/attachments";

const brokenImage: AttachmentData = {
  filename: "photo.png",
  id: "file-1",
  mediaType: "image/png",
  type: "file",
  url: "data:image/png;base64,bm90IGFuIGltYWdl",
};

const validImage: AttachmentData = {
  ...brokenImage,
  url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
};

describe("attachmentPreview", () => {
  it("shows the fallback icon when the image fails to load", async () => {
    render(
      <Attachments>
        <Attachment data={brokenImage}>
          <AttachmentPreview fallbackIcon={<span data-testid="fallback" />} />
        </Attachment>
      </Attachments>
    );

    await expect(screen.findByTestId("fallback")).resolves.toBeInTheDocument();
    expect(screen.queryByAltText("photo.png")).not.toBeInTheDocument();
  });

  it("tries a new url after a failed one", async () => {
    const { rerender } = render(
      <Attachments>
        <Attachment data={brokenImage}>
          <AttachmentPreview fallbackIcon={<span data-testid="fallback" />} />
        </Attachment>
      </Attachments>
    );
    await screen.findByTestId("fallback");

    rerender(
      <Attachments>
        <Attachment data={validImage}>
          <AttachmentPreview fallbackIcon={<span data-testid="fallback" />} />
        </Attachment>
      </Attachments>
    );

    expect(screen.getByAltText("photo.png")).toHaveAttribute(
      "src",
      validImage.url
    );
    expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
  });
});
