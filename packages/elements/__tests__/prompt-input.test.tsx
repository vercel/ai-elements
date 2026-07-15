// oxlint-disable eslint-plugin-jest(max-expects), eslint-plugin-react-perf(jsx-no-new-function-as-prop)
import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";

import type { AttachmentData } from "../src/attachments";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "../src/attachments";
import type { PromptInputSuggestionSelectDetails } from "../src/prompt-input";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputSuggestionContent,
  PromptInputSuggestionItem,
  PromptInputSuggestions,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
  usePromptInputReferencedSources,
  usePromptInputSuggestions,
} from "../src/prompt-input";

const DATA_PREFIX_REGEX = /^data:/;
const BLOB_PREFIX_REGEX = /^blob:/;
const SUBMIT_REGEX = /submit/i;
const PROMPT_INPUT_SUGGESTION_TRIGGERS = [
  { trigger: "@" },
  { trigger: "/" },
] as const;

const MENTION_SUGGESTIONS = ["Ada", "Alan"] as const;
const COMMAND_SUGGESTIONS = ["clear", "summarize"] as const;

const preventArrowDown = (
  event: React.KeyboardEvent<HTMLTextAreaElement>
): void => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
  }
};

interface FilteredSuggestionMenuProps {
  clearIsActionOnly?: boolean;
  onClear?: (details: PromptInputSuggestionSelectDetails) => void;
}

const FilteredSuggestionMenu = ({
  clearIsActionOnly = false,
  onClear,
}: FilteredSuggestionMenuProps) => {
  const { match } = usePromptInputSuggestions();
  const suggestions =
    match?.trigger === "@" ? MENTION_SUGGESTIONS : COMMAND_SUGGESTIONS;
  const query = match?.query.toLowerCase() ?? "";
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query)
  );

  return (
    <PromptInputSuggestionContent aria-label="Prompt suggestions">
      <output data-testid="suggestion-query">
        {match ? `${match.trigger}:${match.query}` : ""}
      </output>
      {filteredSuggestions.map((suggestion) => (
        <PromptInputSuggestionItem
          key={suggestion}
          onSelect={suggestion === "clear" ? onClear : undefined}
          replaceWith={
            suggestion === "clear" && clearIsActionOnly ? false : undefined
          }
          value={suggestion}
        >
          {suggestion}
        </PromptInputSuggestionItem>
      ))}
    </PromptInputSuggestionContent>
  );
};

const MidStringSuggestionMenu = () => (
  <PromptInputSuggestionContent aria-label="Mention suggestions">
    <PromptInputSuggestionItem replaceWith="@Ada" value="Ada">
      Ada
    </PromptInputSuggestionItem>
  </PromptInputSuggestionContent>
);

const PromptInputProviderValue = () => {
  const controller = usePromptInputController();
  return (
    <output data-testid="provider-value">{controller.textInput.value}</output>
  );
};

const PromptInputSuggestionState = () => {
  const { activeValue, match, open } = usePromptInputSuggestions();
  const openState = open ? "open" : "closed";
  return (
    <output data-testid="suggestion-state">
      {`${openState}:${match?.query ?? "none"}:${activeValue ?? "none"}`}
    </output>
  );
};

const ConditionalSuggestionTextarea = ({
  onSubmit,
}: {
  onSubmit: () => void;
}) => {
  const [showTextarea, setShowTextarea] = React.useState(true);

  return (
    <>
      <button onClick={() => setShowTextarea(false)} type="button">
        Hide textarea
      </button>
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            {showTextarea ? <PromptInputTextarea /> : null}
            <PromptInputSuggestionState />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    </>
  );
};

// Backwards-compatibility aliases for tests (these components were moved to attachment.tsx)
const PromptInputAttachment = ({
  data,
  onRemove,
}: {
  data: AttachmentData;
  onRemove?: () => void;
}) => (
  <Attachment data={data} onRemove={onRemove}>
    <AttachmentPreview />
    <AttachmentInfo />
    <AttachmentRemove label="Remove attachment" />
  </Attachment>
);

const PromptInputAttachments = ({
  children,
}: {
  children: (
    attachment: AttachmentData,
    onRemove: () => void
  ) => React.ReactNode;
}) => {
  const attachments = usePromptInputAttachments();
  if (!attachments.files.length) {
    return null;
  }
  return (
    <Attachments variant="inline">
      {attachments.files.map((file) => (
        <React.Fragment key={file.id}>
          {children(file, () => attachments.remove(file.id))}
        </React.Fragment>
      ))}
    </Attachments>
  );
};

const PromptInputReferencedSource = ({
  data,
  onRemove,
}: {
  data: AttachmentData;
  onRemove?: () => void;
}) => (
  <Attachment data={data} onRemove={onRemove}>
    <AttachmentPreview />
    <AttachmentInfo />
    <AttachmentRemove label="Remove referenced source" />
  </Attachment>
);

const PromptInputReferencedSources = ({
  children,
}: {
  children: (source: AttachmentData, onRemove: () => void) => React.ReactNode;
}) => {
  const referencedSources = usePromptInputReferencedSources();
  if (!referencedSources.sources.length) {
    return null;
  }
  return (
    <Attachments variant="inline">
      {referencedSources.sources.map((source) => (
        <React.Fragment key={source.id}>
          {children(source, () => referencedSources.remove(source.id))}
        </React.Fragment>
      ))}
    </Attachments>
  );
};

// Setup function for prompt input tests
const setupPromptInputTests = () => {
  vi.spyOn(window.URL, "createObjectURL").mockImplementation(
    (_blob) => `blob:mock-url-${Math.random()}`
  );
  vi.spyOn(window.URL, "revokeObjectURL").mockImplementation(vi.fn());

  // Mock fetch for blob URL conversion - Promise.resolve/reject required for mock return values
  // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
  vi.spyOn(window, "fetch").mockImplementation((url) => {
    if (typeof url === "string" && url.startsWith("blob:")) {
      const blob = new Blob(["test content"], { type: "text/plain" });
      // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
      return Promise.resolve({
        // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
        blob: () => Promise.resolve(blob),
      } as Response);
    }
    // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
    return Promise.reject(new Error("Not a blob URL"));
  });

  // Mock FileReader
  // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc)
  window.FileReader = vi.fn(function FileReader(this: FileReader) {
    // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc), eslint-plugin-jest(prefer-spy-on)
    this.readAsDataURL = vi.fn(function readAsDataURL(
      this: FileReader,
      _blob: Blob
    ) {
      // Simulate async file reading
      setTimeout(() => {
        // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc)
        this.result = "data:text/plain;base64,dGVzdCBjb250ZW50";
        // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc)
        this.onloadend?.(new ProgressEvent("loadend"));
      }, 0);
    });
    // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc)
    this.result = null;
    // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc)
    this.onloadend = null;
    // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc), eslint-plugin-unicorn(prefer-add-event-listener)
    this.onerror = null;
    // oxlint-disable-next-line eslint-plugin-react(no-this-in-sfc)
    return this;
  }) as unknown as typeof FileReader;
};

const setupScreenshotCaptureMock = () => {
  if (!navigator.mediaDevices) {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {},
      writable: true,
    });
  }

  if (!("getDisplayMedia" in navigator.mediaDevices)) {
    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
      configurable: true,
      value: vi.fn(),
      writable: true,
    });
  }

  const stopTrack = vi.fn();
  const stream = {
    getTracks: () => [{ stop: stopTrack }],
  } as unknown as MediaStream;

  const getDisplayMedia = vi
    .spyOn(navigator.mediaDevices, "getDisplayMedia")
    .mockResolvedValue(stream);

  const originalCreateElement = document.createElement.bind(document);
  const video = originalCreateElement("video");
  const canvas = originalCreateElement("canvas");
  const drawImage = vi.fn();
  const play = vi.spyOn(video, "play").mockResolvedValue();
  const pause = vi.spyOn(video, "pause").mockImplementation(vi.fn());

  Object.defineProperty(video, "videoWidth", {
    configurable: true,
    value: 1280,
  });
  Object.defineProperty(video, "videoHeight", {
    configurable: true,
    value: 720,
  });

  let srcObject: unknown = null;
  Object.defineProperty(video, "srcObject", {
    configurable: true,
    get: () => srcObject,
    set: (value) => {
      srcObject = value;
      if (value) {
        setTimeout(() => {
          video.onloadedmetadata?.(new Event("loadedmetadata"));
        }, 0);
      }
    },
  });

  vi.spyOn(canvas, "getContext").mockReturnValue({
    drawImage,
  } as unknown as CanvasRenderingContext2D);
  // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-callbacks)
  const toBlob = vi.spyOn(canvas, "toBlob").mockImplementation((callback) => {
    // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-callbacks)
    callback?.(new Blob(["mock-screenshot"], { type: "image/png" }));
  });

  vi.spyOn(document, "createElement").mockImplementation(((tagName: string) => {
    if (tagName === "video") {
      return video;
    }
    if (tagName === "canvas") {
      return canvas;
    }
    return originalCreateElement(tagName as keyof HTMLElementTagNameMap);
  }) as typeof document.createElement);

  return { getDisplayMedia, pause, play, stopTrack, toBlob };
};

describe("promptInput", () => {
  it("renders form", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("calls onSubmit with message", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "Hello");

    // Ensure textarea has the value before submitting
    expect(textarea.value).toBe("Hello");

    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledOnce();
    const [[message]] = onSubmit.mock.calls;
    expect(message).toHaveProperty("text", "Hello");
    expect(message).toHaveProperty("files");
  });

  it("clears textarea after form submission - #125", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "Hello");

    // Verify textarea has value before submit
    expect(textarea.value).toBe("Hello");

    // Submit the form
    await user.keyboard("{Enter}");

    // Wait for async submission
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Verify textarea is cleared after submission
    expect(textarea.value).toBe("");
  });

  it("does not lose user input typed immediately after submission - #125", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;

    // Type and submit first message
    await user.clear(textarea);
    await user.type(textarea, "First message");
    await user.keyboard("{Enter}");

    // Textarea should be cleared immediately after Enter (before async completes)
    expect(textarea.value).toBe("");

    // Immediately type a second message (without waiting for async completion)
    // Explicitly clear before typing
    await user.clear(textarea);
    await user.type(textarea, "Second message");

    // Verify the second message is still there (not cleared by race condition)
    expect(textarea.value).toBe("Second message");

    // Wait for async submission to complete
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Second message should still be there after async completion
    expect(textarea.value).toBe("Second message");
  });

  it("converts blob URLs to data URLs on submit - #113", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    // Create a mock file
    const fileContent = "test file content";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const file = new File([blob], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <input
            data-testid="add-file-btn"
            onClick={() => attachments.add([file])}
            type="button"
          />
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a file (which creates a blob URL)
    const addFileBtn = screen.getByTestId("add-file-btn");
    await user.click(addFileBtn);

    // Verify file was added with blob URL
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    // Type a message and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "describe file");
    await user.keyboard("{Enter}");

    // Wait for async submission to complete
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Verify that the URL was converted from blob: to data:
    const [[message]] = onSubmit.mock.calls;
    expect(message.files).toHaveLength(1);
    expect(message.files[0].url).toMatch(DATA_PREFIX_REGEX);
    expect(message.files[0].url).not.toMatch(BLOB_PREFIX_REGEX);
    expect(message.files[0].filename).toBe("test.txt");
  });

  it("does not clear attachments when onSubmit throws an error - #126", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn(() => {
      throw new Error("Submission failed");
    });
    const user = userEvent.setup();

    // Create a mock file
    const fileContent = "test file content";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const file = new File([blob], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <input
            data-testid="add-file-btn"
            onClick={() => attachments.add([file])}
            type="button"
          />
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a file
    const addFileBtn = screen.getByTestId("add-file-btn");
    await user.click(addFileBtn);

    // Verify file was added
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    // Type a message and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for async submission to complete
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Verify that the attachment is still there (not cleared due to error)
    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  it("does not clear attachments when async onSubmit rejects - #126", async () => {
    setupPromptInputTests();
    // Mock needs to return rejected promise to simulate async failure
    const onSubmit = vi.fn(
      // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
      () => Promise.reject(new Error("Async submission failed"))
    );
    const user = userEvent.setup();

    // Create a mock file
    const fileContent = "test file content";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const file = new File([blob], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <input
            data-testid="add-file-btn"
            onClick={() => attachments.add([file])}
            type="button"
          />
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a file
    const addFileBtn = screen.getByTestId("add-file-btn");
    await user.click(addFileBtn);

    // Verify file was added
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    // Type a message and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for async submission to be attempted
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Give some time for the promise rejection to be handled
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Verify that the attachment is still there (not cleared due to rejection)
    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  it("clears attachments when async onSubmit resolves successfully - #126", async () => {
    setupPromptInputTests();
    // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
    const onSubmit = vi.fn(() => Promise.resolve());
    const user = userEvent.setup();

    // Create a mock file
    const fileContent = "test file content";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const file = new File([blob], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <input
            data-testid="add-file-btn"
            onClick={() => attachments.add([file])}
            type="button"
          />
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a file
    const addFileBtn = screen.getByTestId("add-file-btn");
    await user.click(addFileBtn);

    // Verify file was added
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    // Type a message and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for async submission to complete successfully
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Give some time for the promise resolution to be handled
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Verify that the attachment was cleared after successful async submission
    expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
  });
});

describe("promptInputBody", () => {
  it("renders body content", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>Content</PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("promptInputTextarea", () => {
  it("renders textarea", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    expect(
      screen.getByPlaceholderText("What would you like to know?")
    ).toBeInTheDocument();
  });

  it("submits on Enter key", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "Test");
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ text: "Test" }),
      expect.anything()
    );
  });

  it("does not submit on Shift+Enter", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "Line 1");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    await user.type(textarea, "Line 2");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit on Enter during IME composition - #21", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;

    // Simulate IME composition (e.g., typing Japanese)
    textarea.focus();

    // Create a KeyboardEvent with isComposing = true
    const enterKeyDuringComposition = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
    });

    // Mock isComposing to true (simulates IME composition in progress)
    Object.defineProperty(enterKeyDuringComposition, "isComposing", {
      value: true,
      writable: false,
    });

    textarea.dispatchEvent(enterKeyDuringComposition);

    // Should not submit during IME composition
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("uses custom placeholder", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Custom placeholder" />
        </PromptInputBody>
      </PromptInput>
    );
    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });
});

describe("promptInputSuggestions", () => {
  it("matches and filters @ mentions and / commands from the active query", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "Ask @ad");

    const mentionListbox = await screen.findByRole("listbox");
    expect(mentionListbox).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-query")).toHaveTextContent("@:ad");
    expect(screen.getByRole("option", { name: "Ada" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Alan" })
    ).not.toBeInTheDocument();

    await user.clear(textarea);
    await user.type(textarea, "Please /sum");

    const commandListbox = await screen.findByRole("listbox");
    expect(commandListbox).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-query")).toHaveTextContent("/:sum");
    expect(
      screen.getByRole("option", { name: "summarize" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "clear" })
    ).not.toBeInTheDocument();
  });

  it("does not activate mentions inside email addresses or commands inside URLs", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "user@example.com");

    expect(textarea).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.clear(textarea);
    await user.type(textarea, "https://example.com/docs");

    expect(textarea).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigates options with active-descendant and selects before submitting", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "@");

    const ada = await screen.findByRole("option", { name: "Ada" });
    const alan = screen.getByRole("option", { name: "Alan" });
    await vi.waitFor(() => {
      expect(textarea).toHaveAttribute("aria-activedescendant", ada.id);
    });

    await user.keyboard("{ArrowUp}");

    expect(textarea).toHaveAttribute("aria-activedescendant", alan.id);
    expect(alan).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");

    await vi.waitFor(() => {
      expect(textarea).toHaveValue("@Alan ");
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps an escaped match dismissed until a new trigger context starts", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "@a");
    const initialListbox = await screen.findByRole("listbox");
    expect(initialListbox).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(textarea).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.type(textarea, "d");
    expect(textarea).toHaveAttribute("aria-expanded", "false");

    await user.type(textarea, " @");
    const nextListbox = await screen.findByRole("listbox");
    expect(nextListbox).toBeInTheDocument();
    expect(textarea).toHaveAttribute("aria-expanded", "true");
  });

  it("preserves the suffix and textarea focus when a mid-string item is clicked", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea defaultValue="Ask @ad about this" />
            <MidStringSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(7, 7);
    fireEvent.select(textarea);

    const option = await screen.findByRole("option", { name: "Ada" });
    await user.click(option);

    expect(textarea).toHaveValue("Ask @Ada about this");
    expect(document.activeElement).toBe(textarea);
  });

  it("runs action-only items without replacing the active query", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu clearIsActionOnly onClear={onClear} />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "/cl");
    await user.click(await screen.findByRole("option", { name: "clear" }));

    expect(textarea).toHaveValue("/cl");
    expect(onClear).toHaveBeenCalledWith(
      expect.objectContaining({
        match: expect.objectContaining({ query: "cl", trigger: "/" }),
        value: "clear",
      })
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("updates PromptInputProvider state when a suggestion replaces text", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInputProvider>
        <PromptInputProviderValue />
        <PromptInput onSubmit={onSubmit}>
          <PromptInputBody>
            <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
              <PromptInputTextarea />
              <FilteredSuggestionMenu />
            </PromptInputSuggestions>
          </PromptInputBody>
        </PromptInput>
      </PromptInputProvider>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "@ad");
    await user.keyboard("{Enter}");

    await vi.waitFor(() => {
      expect(textarea).toHaveValue("@Ada ");
      expect(screen.getByTestId("provider-value").textContent).toBe("@Ada ");
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("waits for IME composition to end before opening suggestions", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    const onCompositionEnd = vi.fn();
    const onCompositionStart = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea
              onChange={onChange}
              onCompositionEnd={onCompositionEnd}
              onCompositionStart={onCompositionStart}
            />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    textarea.focus();
    fireEvent.compositionStart(textarea);
    fireEvent.input(textarea, { target: { value: "@a" } });

    expect(onCompositionStart).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.compositionEnd(textarea);

    expect(onCompositionEnd).toHaveBeenCalledOnce();
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
  });

  it("runs external key handlers before internal suggestion navigation", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onSelect = vi.fn();
    const onKeyDown = vi.fn(preventArrowDown);
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea onKeyDown={onKeyDown} onSelect={onSelect} />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "@");
    const ada = await screen.findByRole("option", { name: "Ada" });
    await vi.waitFor(() => {
      expect(textarea).toHaveAttribute("aria-activedescendant", ada.id);
    });
    onKeyDown.mockClear();

    await user.keyboard("{ArrowDown}");

    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalled();
    expect(textarea).toHaveAttribute("aria-activedescendant", ada.id);
  });

  it("exposes the textarea as a combobox while suggestions are enabled", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByRole("combobox");
    expect(textarea).toHaveAttribute("aria-autocomplete", "list");
    expect(textarea).toHaveAttribute("data-slot", "input-group-control");
  });

  it("keeps the same match open when the caret moves inside the textarea", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "@a");
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();

    await user.pointer({ keys: "[MouseLeft>]", target: textarea });
    textarea.setSelectionRange(1, 1);
    fireEvent.select(textarea);
    await user.pointer({ keys: "[/MouseLeft]", target: textarea });

    expect(textarea).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-query")).toHaveTextContent("@:");
  });

  it("keeps a consumer-provided option id in sync with active-descendant", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <PromptInputSuggestionContent aria-label="Mention suggestions">
              <PromptInputSuggestionItem id="custom-option-id" value="Ada">
                Ada
              </PromptInputSuggestionItem>
            </PromptInputSuggestionContent>
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "@");
    const option = await screen.findByRole("option", { name: "Ada" });

    await vi.waitFor(() => {
      expect(textarea).toHaveAttribute("aria-activedescendant", option.id);
    });
    expect(option).toHaveAttribute("id", "custom-option-id");
  });

  it("scrolls the keyboard-selected option into view", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const scrollIntoView = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(vi.fn());
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <FilteredSuggestionMenu />
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    await user.type(textarea, "@");
    const alan = await screen.findByRole("option", { name: "Alan" });
    scrollIntoView.mockClear();

    await user.keyboard("{ArrowDown}");

    expect(alan).toHaveAttribute("aria-selected", "true");
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("resets suggestions when a conditional textarea unmounts", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ConditionalSuggestionTextarea onSubmit={onSubmit} />);

    const textarea = screen.getByRole("combobox");
    await user.type(textarea, "@a");
    expect(screen.getByTestId("suggestion-state")).toHaveTextContent(
      "open:a:none"
    );

    await user.click(screen.getByRole("button", { name: "Hide textarea" }));

    await vi.waitFor(() => {
      expect(screen.getByTestId("suggestion-state")).toHaveTextContent(
        "closed:none:none"
      );
    });
  });

  it("keeps a stable active item id while its value changes", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <PromptInputSuggestionState />
            <PromptInputSuggestionContent aria-label="Mention suggestions">
              <PromptInputSuggestionItem id="stable-option" value="Ada">
                Ada
              </PromptInputSuggestionItem>
            </PromptInputSuggestionContent>
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByRole("combobox");
    await user.type(textarea, "@");
    const option = await screen.findByRole("option", { name: "Ada" });
    await vi.waitFor(() => {
      expect(textarea).toHaveAttribute("aria-activedescendant", option.id);
      expect(screen.getByTestId("suggestion-state")).toHaveTextContent(
        "open::Ada"
      );
    });

    rerender(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <PromptInputSuggestionState />
            <PromptInputSuggestionContent aria-label="Mention suggestions">
              <PromptInputSuggestionItem id="stable-option" value="Grace">
                Grace
              </PromptInputSuggestionItem>
            </PromptInputSuggestionContent>
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    await vi.waitFor(() => {
      expect(textarea).toHaveAttribute(
        "aria-activedescendant",
        "stable-option"
      );
      expect(screen.getByTestId("suggestion-state")).toHaveTextContent(
        "open::Grace"
      );
    });
    expect(screen.getByRole("option", { name: "Grace" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("lets onSelect replacement override the default insertion", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onSelect = vi.fn((details: PromptInputSuggestionSelectDetails) => {
      details.replace("@Grace ");
    });
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSuggestions triggers={PROMPT_INPUT_SUGGESTION_TRIGGERS}>
            <PromptInputTextarea />
            <PromptInputSuggestionContent aria-label="Mention suggestions">
              <PromptInputSuggestionItem onSelect={onSelect} value="Ada">
                Ada
              </PromptInputSuggestionItem>
            </PromptInputSuggestionContent>
          </PromptInputSuggestions>
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByRole("combobox");
    await user.type(textarea, "@a");
    await user.keyboard("{Enter}");

    await vi.waitFor(() => {
      expect(textarea).toHaveValue("@Grace ");
    });
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("promptInputTools", () => {
  it("renders tools", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTools>Tools</PromptInputTools>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });
});

describe("promptInputButton", () => {
  it("renders button", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputButton>Action</PromptInputButton>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders button with string tooltip", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputButton tooltip="Search the web">Search</PromptInputButton>
        </PromptInputBody>
      </PromptInput>
    );

    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toBeInTheDocument();

    await user.hover(button);

    await vi.waitFor(() => {
      // Check tooltip content element (not the hidden screen reader span)
      const tooltipContent = document.querySelector(
        '[data-slot="tooltip-content"]'
      );
      expect(tooltipContent).toBeTruthy();
      expect(tooltipContent?.textContent).toContain("Search the web");
    });
  });

  it("renders button with object tooltip containing shortcut", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputButton
            tooltip={{ content: "Open Search", shortcut: "⌘K", side: "bottom" }}
          >
            Search
          </PromptInputButton>
        </PromptInputBody>
      </PromptInput>
    );

    const button = screen.getByRole("button", { name: "Search" });
    await user.hover(button);

    await vi.waitFor(() => {
      // Check tooltip content element (not the hidden screen reader span)
      const tooltipContent = document.querySelector(
        '[data-slot="tooltip-content"]'
      );
      expect(tooltipContent).toBeTruthy();
      expect(tooltipContent?.textContent).toContain("Open Search");
      expect(tooltipContent?.textContent).toContain("⌘K");
    });
  });

  it("does not render tooltip when prop is not provided", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputButton>Action</PromptInputButton>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

describe("promptInputSubmit", () => {
  it("renders submit button", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );
    const button = screen.getByRole("button", { name: SUBMIT_REGEX });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("shows loading icon when submitted", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit status="submitted" />
        </PromptInputBody>
      </PromptInput>
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows stop icon when streaming", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit status="streaming" />
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("promptInputActionMenu", () => {
  it("renders action menu", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionMenuItem>Item</PromptInputActionMenuItem>
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("promptInputSelect", () => {
  it("renders model select", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSelect>
            <PromptInputSelectTrigger>
              <PromptInputSelectValue placeholder="Select model" />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              <PromptInputSelectItem value="gpt-4">GPT-4</PromptInputSelectItem>
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText("Select model")).toBeInTheDocument();
  });
});

describe("promptInputProvider", () => {
  it("provides context to children", async () => {
    setupPromptInputTests();
    const _onSubmit = vi.fn();
    const { PromptInputProvider, usePromptInputController } =
      await import("../src/prompt-input");

    const TestComponent = () => {
      const controller = usePromptInputController();
      return (
        <div>
          <span data-testid="input-value">{controller.textInput.value}</span>
          <button
            onClick={() => controller.textInput.setInput("test")}
            type="button"
          >
            Set Input
          </button>
        </div>
      );
    };

    render(
      <PromptInputProvider>
        <TestComponent />
      </PromptInputProvider>
    );

    expect(screen.getByTestId("input-value")).toHaveTextContent("");
  });

  it("throws error when usePromptInputController used outside provider", async () => {
    setupPromptInputTests();
    const { usePromptInputController } = await import("../src/prompt-input");

    const TestComponent = () => {
      usePromptInputController();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(vi.fn());

    expect(() => render(<TestComponent />)).toThrow(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    );

    spy.mockRestore();
  });

  it("provides initial input value", async () => {
    setupPromptInputTests();
    const { PromptInputProvider, usePromptInputController } =
      await import("../src/prompt-input");
    const onSubmit = vi.fn();

    const TestComponent = () => {
      const controller = usePromptInputController();
      return <div data-testid="value">{controller.textInput.value}</div>;
    };

    render(
      <PromptInputProvider initialInput="Hello world">
        <TestComponent />
        <PromptInput onSubmit={onSubmit}>
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
        </PromptInput>
      </PromptInputProvider>
    );

    expect(screen.getByTestId("value")).toHaveTextContent("Hello world");
  });

  it("manages attachments globally", async () => {
    setupPromptInputTests();
    const { PromptInputProvider, useProviderAttachments } =
      await import("../src/prompt-input");

    const file = new File(["test"], "test.txt", { type: "text/plain" });

    const TestComponent = () => {
      const attachments = useProviderAttachments();
      return (
        <div>
          <button onClick={() => attachments.add([file])} type="button">
            Add File
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </div>
      );
    };

    const user = userEvent.setup();
    render(
      <PromptInputProvider>
        <TestComponent />
      </PromptInputProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("0");

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });
});

describe("file validation", () => {
  it("enforces maxFiles limit", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const file1 = new File(["test1"], "test1.txt", { type: "text/plain" });
    const file2 = new File(["test2"], "test2.txt", { type: "text/plain" });
    const file3 = new File(["test3"], "test3.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-files"
            onClick={() => attachments.add([file1, file2, file3])}
            type="button"
          >
            Add Files
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput maxFiles={2} onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-files"));

    // Only 2 files should be added
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(onError).toHaveBeenCalledWith({
      code: "max_files",
      message: expect.any(String),
    });
  });

  it("enforces maxFileSize limit", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    // Create a large file (mocked with size property)
    const largeFile = new File(["x".repeat(2000)], "large.txt", {
      type: "text/plain",
    });
    Object.defineProperty(largeFile, "size", { value: 2000 });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-file"
            onClick={() => attachments.add([largeFile])}
            type="button"
          >
            Add File
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput maxFileSize={1000} onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-file"));

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(onError).toHaveBeenCalledWith({
      code: "max_file_size",
      message: expect.any(String),
    });
  });

  it("enforces accept image filter", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const textFile = new File(["test"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-file"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add File
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="image/*" onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-file"));

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });
  });

  it("allows image files when accept is image/*", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-file"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add File
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="image/*" onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-file"));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("enforces accept video/* filter", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const textFile = new File(["test"], "test.txt", { type: "text/plain" });
    const videoFile = new File(["video"], "test.mp4", { type: "video/mp4" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <button
            data-testid="add-video"
            onClick={() => attachments.add([videoFile])}
            type="button"
          >
            Add Video
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="video/*" onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });

    await user.click(screen.getByTestId("add-video"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("enforces accept audio/* filter", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });
    const audioFile = new File(["audio"], "test.mp3", { type: "audio/mpeg" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-image"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add Image
          </button>
          <button
            data-testid="add-audio"
            onClick={() => attachments.add([audioFile])}
            type="button"
          >
            Add Audio
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="audio/*" onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-image"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });

    await user.click(screen.getByTestId("add-audio"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("enforces accept with exact MIME type", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const pngFile = new File(["image"], "test.png", { type: "image/png" });
    const jpegFile = new File(["image"], "test.jpg", { type: "image/jpeg" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-png"
            onClick={() => attachments.add([pngFile])}
            type="button"
          >
            Add PNG
          </button>
          <button
            data-testid="add-jpeg"
            onClick={() => attachments.add([jpegFile])}
            type="button"
          >
            Add JPEG
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="image/png" onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-png"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-jpeg"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });
  });

  it("allows exact MIME type match for application/pdf", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const pdfFile = new File(["pdf"], "doc.pdf", {
      type: "application/pdf",
    });
    const textFile = new File(["text"], "doc.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-pdf"
            onClick={() => attachments.add([pdfFile])}
            type="button"
          >
            Add PDF
          </button>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput
        accept="application/pdf"
        onError={onError}
        onSubmit={onSubmit}
      >
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-pdf"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });
  });

  // oxlint-disable-next-line eslint-plugin-jest(max-expects)
  it("accepts multiple comma-separated patterns with wildcards", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });
    const videoFile = new File(["video"], "test.mp4", { type: "video/mp4" });
    const audioFile = new File(["audio"], "test.mp3", { type: "audio/mpeg" });
    const textFile = new File(["text"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-image"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add Image
          </button>
          <button
            data-testid="add-video"
            onClick={() => attachments.add([videoFile])}
            type="button"
          >
            Add Video
          </button>
          <button
            data-testid="add-audio"
            onClick={() => attachments.add([audioFile])}
            type="button"
          >
            Add Audio
          </button>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput
        accept="image/*, video/*"
        onError={onError}
        onSubmit={onSubmit}
      >
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-image"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-video"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");

    await user.click(screen.getByTestId("add-audio"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(onError).toHaveBeenCalledTimes(2);
  });

  // oxlint-disable-next-line eslint-plugin-jest(max-expects)
  it("accepts multiple comma-separated exact MIME types", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const pngFile = new File(["image"], "test.png", { type: "image/png" });
    const jpegFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
    const pdfFile = new File(["pdf"], "doc.pdf", {
      type: "application/pdf",
    });
    const textFile = new File(["text"], "doc.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-png"
            onClick={() => attachments.add([pngFile])}
            type="button"
          >
            Add PNG
          </button>
          <button
            data-testid="add-jpeg"
            onClick={() => attachments.add([jpegFile])}
            type="button"
          >
            Add JPEG
          </button>
          <button
            data-testid="add-pdf"
            onClick={() => attachments.add([pdfFile])}
            type="button"
          >
            Add PDF
          </button>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput
        accept="image/png, application/pdf"
        onError={onError}
        onSubmit={onSubmit}
      >
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-png"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-pdf"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");

    await user.click(screen.getByTestId("add-jpeg"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(onError).toHaveBeenCalledTimes(2);
  });

  it("accepts mixed wildcard and exact MIME type patterns", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const pngFile = new File(["image"], "test.png", { type: "image/png" });
    const jpegFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
    const pdfFile = new File(["pdf"], "doc.pdf", {
      type: "application/pdf",
    });
    const docxFile = new File(["docx"], "doc.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-png"
            onClick={() => attachments.add([pngFile])}
            type="button"
          >
            Add PNG
          </button>
          <button
            data-testid="add-jpeg"
            onClick={() => attachments.add([jpegFile])}
            type="button"
          >
            Add JPEG
          </button>
          <button
            data-testid="add-pdf"
            onClick={() => attachments.add([pdfFile])}
            type="button"
          >
            Add PDF
          </button>
          <button
            data-testid="add-docx"
            onClick={() => attachments.add([docxFile])}
            type="button"
          >
            Add DOCX
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput
        accept="image/*, application/pdf"
        onError={onError}
        onSubmit={onSubmit}
      >
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-png"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-jpeg"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");

    await user.click(screen.getByTestId("add-pdf"));
    expect(screen.getByTestId("count")).toHaveTextContent("3");

    await user.click(screen.getByTestId("add-docx"));
    expect(screen.getByTestId("count")).toHaveTextContent("3");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });
  });

  it("handles accept with extra whitespace in patterns", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });
    const pdfFile = new File(["pdf"], "doc.pdf", {
      type: "application/pdf",
    });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-image"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add Image
          </button>
          <button
            data-testid="add-pdf"
            onClick={() => attachments.add([pdfFile])}
            type="button"
          >
            Add PDF
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="  image/*  ,  application/pdf  " onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-image"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-pdf"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("accepts all files when accept is empty string", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });
    const textFile = new File(["text"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-image"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add Image
          </button>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="" onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-image"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("accepts all files when accept is only whitespace", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });
    const textFile = new File(["text"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-image"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add Image
          </button>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="   " onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-image"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("filters out empty patterns from comma-separated list", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const imageFile = new File(["image"], "test.png", { type: "image/png" });
    const textFile = new File(["text"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-image"
            onClick={() => attachments.add([imageFile])}
            type="button"
          >
            Add Image
          </button>
          <button
            data-testid="add-text"
            onClick={() => attachments.add([textFile])}
            type="button"
          >
            Add Text
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInput accept="image/*,  ,  " onError={onError} onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-image"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByTestId("add-text"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(onError).toHaveBeenCalledWith({
      code: "accept",
      message: expect.any(String),
    });
  });

  it("enforces maxFiles limit when using PromptInputProvider", async () => {
    setupPromptInputTests();
    const { PromptInputProvider } = await import("../src/prompt-input");

    const onSubmit = vi.fn();
    const onError = vi.fn();
    const user = userEvent.setup();

    const file1 = new File(["test1"], "test1.txt", { type: "text/plain" });
    const file2 = new File(["test2"], "test2.txt", { type: "text/plain" });
    const file3 = new File(["test3"], "test3.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-files"
            onClick={() => attachments.add([file1, file2, file3])}
            type="button"
          >
            Add Files
          </button>
          <div data-testid="count">{attachments.files.length}</div>
        </>
      );
    };

    render(
      <PromptInputProvider>
        <PromptInput maxFiles={2} onError={onError} onSubmit={onSubmit}>
          <PromptInputBody>
            <AttachmentConsumer />
            <PromptInputTextarea />
          </PromptInputBody>
        </PromptInput>
      </PromptInputProvider>
    );

    await user.click(screen.getByTestId("add-files"));

    // Only 2 files should be added even when using provider
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(onError).toHaveBeenCalledWith({
      code: "max_files",
      message: expect.any(String),
    });
  });
});

describe("drag and drop", () => {
  it("renders with globalDrop prop", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    const { container } = render(
      <PromptInput globalDrop onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("renders without globalDrop prop", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    expect(container.querySelector("form")).toBeInTheDocument();
  });
});

describe("paste functionality", () => {
  it("adds files from clipboard", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return <div data-testid="count">{attachments.files.length}</div>;
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    textarea.focus();

    const file = new File(["image"], "test.png", { type: "image/png" });

    // Create a mock paste event
    const pasteEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
      // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    }) as any;

    // Mock clipboardData items
    pasteEvent.clipboardData = {
      items: [
        {
          getAsFile: () => file,
          kind: "file",
        },
      ],
    };

    await act(() => {
      textarea.dispatchEvent(pasteEvent);
    });

    await vi.waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });
  });

  it("handles paste with no files", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    );
    textarea.focus();

    const pasteEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
      // oxlint-disable-next-line typescript-eslint(no-explicit-any)
    }) as any;
    pasteEvent.clipboardData = { items: [] };

    // Should not throw
    expect(() => textarea.dispatchEvent(pasteEvent)).not.toThrow();
  });
});

describe("promptInputAttachment", () => {
  it("renders file attachment with icon", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const file = {
      filename: "document.pdf",
      id: "1",
      mediaType: "application/pdf",
      type: "file" as const,
      url: "blob:test",
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <Attachments variant="inline">
            <PromptInputAttachment data={file} />
          </Attachments>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("renders image attachment", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const file = {
      filename: "image.png",
      id: "1",
      mediaType: "image/png",
      type: "file" as const,
      url: "blob:test",
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputAttachment data={file} />
        </PromptInputBody>
      </PromptInput>
    );

    const img = screen.getByAltText("image.png");
    expect(img).toBeInTheDocument();
  });

  it("removes attachment when remove button clicked", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const file = new File(["test"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            data-testid="add-file"
            onClick={() => attachments.add([file])}
            type="button"
          >
            Add
          </button>
          <PromptInputAttachments>
            {(attachment, onRemove) => (
              <PromptInputAttachment
                data={attachment}
                key={attachment.id}
                onRemove={onRemove}
              />
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-file"));
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    const removeButton = screen.getByLabelText("Remove attachment");
    await user.click(removeButton);

    expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
  });

  // oxlint-disable-next-line eslint-plugin-jest(max-expects)
  it("removes attachment if backspace key is pressed and textarea is empty", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const file1 = new File(["test1"], "first.txt", { type: "text/plain" });
    const file2 = new File(["test2"], "second.txt", { type: "text/plain" });
    const file3 = new File(["test3"], "third.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button
            onClick={() => attachments.add([file1, file2, file3])}
            type="button"
          >
            Add Files
          </button>
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;

    await user.click(screen.getByRole("button", { name: "Add Files" }));

    expect(screen.getByText("first.txt")).toBeInTheDocument();
    expect(screen.getByText("second.txt")).toBeInTheDocument();
    expect(screen.getByText("third.txt")).toBeInTheDocument();

    textarea.focus();
    expect(textarea.value).toBe("");

    await user.keyboard("{Backspace}");

    expect(screen.getByText("first.txt")).toBeInTheDocument();
    expect(screen.getByText("second.txt")).toBeInTheDocument();
    expect(screen.queryByText("third.txt")).not.toBeInTheDocument();

    await user.keyboard("{Backspace}");

    expect(screen.getByText("first.txt")).toBeInTheDocument();
    expect(screen.queryByText("second.txt")).not.toBeInTheDocument();

    await user.keyboard("{Backspace}");

    expect(screen.queryByText("first.txt")).not.toBeInTheDocument();
  });

  it("does not remove attachment when backspace key is pressed and textarea has content", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const file = new File(["test"], "test.txt", { type: "text/plain" });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <button onClick={() => attachments.add([file])} type="button">
            Add File
          </button>
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <AttachmentConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;

    await user.click(screen.getByRole("button", { name: "Add File" }));
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    await user.type(textarea, "Some text");
    expect(textarea.value).toBe("Some text");

    await user.keyboard("{Backspace}");

    expect(screen.getByText("test.txt")).toBeInTheDocument();
    expect(textarea.value).toBe("Some tex");
  });
});

describe("promptInputReferencedSource", () => {
  it("renders referenced source with globe icon", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const source = {
      filename: "doc.pdf",
      id: "1",
      mediaType: "application/pdf",
      sourceId: "source-1",
      title: "Test Document",
      type: "source-document" as const,
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <Attachments variant="inline">
            <PromptInputReferencedSource data={source} />
          </Attachments>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Test Document")).toBeInTheDocument();
  });

  it("falls back to filename when title is not provided", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const source = {
      filename: "document.pdf",
      id: "1",
      mediaType: "application/pdf",
      sourceId: "source-1",
      title: "",
      type: "source-document" as const,
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <Attachments variant="inline">
            <PromptInputReferencedSource data={source} />
          </Attachments>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("removes referenced source when remove button clicked", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const ReferencedSourceConsumer = () => {
      const refs = usePromptInputReferencedSources();
      return (
        <>
          <button
            data-testid="add-source"
            onClick={() =>
              refs.add({
                mediaType: "text/plain",
                sourceId: "source-1",
                title: "Test Source",
                type: "source-document",
              })
            }
            type="button"
          >
            Add
          </button>
          <PromptInputReferencedSources>
            {(source, onRemove) => (
              <PromptInputReferencedSource
                data={source}
                key={source.id}
                onRemove={onRemove}
              />
            )}
          </PromptInputReferencedSources>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <ReferencedSourceConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-source"));
    expect(screen.getByText("Test Source")).toBeInTheDocument();

    const removeButton = screen.getByLabelText("Remove referenced source");
    await user.click(removeButton);

    expect(screen.queryByText("Test Source")).not.toBeInTheDocument();
  });
});

describe("promptInputReferencedSources", () => {
  it("renders multiple referenced sources", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const ReferencedSourceConsumer = () => {
      const refs = usePromptInputReferencedSources();
      return (
        <>
          <button
            data-testid="add-sources"
            onClick={() =>
              refs.add([
                {
                  mediaType: "text/plain",
                  sourceId: "s1",
                  title: "Source 1",
                  type: "source-document",
                },
                {
                  mediaType: "text/plain",
                  sourceId: "s2",
                  title: "Source 2",
                  type: "source-document",
                },
              ])
            }
            type="button"
          >
            Add Sources
          </button>
          <PromptInputReferencedSources>
            {(source) => <div key={source.id}>{source.title}</div>}
          </PromptInputReferencedSources>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <ReferencedSourceConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByTestId("add-sources"));

    expect(screen.getByText("Source 1")).toBeInTheDocument();
    expect(screen.getByText("Source 2")).toBeInTheDocument();
  });

  it("does not render when no sources exist", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    const ReferencedSourceConsumer = () => {
      const _refs = usePromptInputReferencedSources();
      return (
        <PromptInputReferencedSources data-testid="sources-container">
          {(source) => <div key={source.id}>{source.title}</div>}
        </PromptInputReferencedSources>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <ReferencedSourceConsumer />
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.queryByTestId("sources-container")).not.toBeInTheDocument();
  });

  it("clears referenced sources after successful form submission", async () => {
    setupPromptInputTests();
    // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
    const onSubmit = vi.fn(() => Promise.resolve());
    const user = userEvent.setup();

    const ReferencedSourceConsumer = () => {
      const refs = usePromptInputReferencedSources();
      return (
        <>
          <button
            data-testid="add-source"
            onClick={() =>
              refs.add({
                mediaType: "text/plain",
                sourceId: "s1",
                title: "Test Source",
                type: "source-document",
              })
            }
            type="button"
          >
            Add Source
          </button>
          <PromptInputReferencedSources>
            {(source) => <div key={source.id}>{source.title}</div>}
          </PromptInputReferencedSources>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <ReferencedSourceConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a referenced source
    await user.click(screen.getByTestId("add-source"));
    expect(screen.getByText("Test Source")).toBeInTheDocument();

    // Type and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for async submission to complete
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Give time for promise resolution
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Verify referenced source was cleared
    expect(screen.queryByText("Test Source")).not.toBeInTheDocument();
  });

  it("does not clear referenced sources when onSubmit throws an error", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn(() => {
      throw new Error("Submission failed");
    });
    const user = userEvent.setup();

    const ReferencedSourceConsumer = () => {
      const refs = usePromptInputReferencedSources();
      return (
        <>
          <button
            data-testid="add-source"
            onClick={() =>
              refs.add({
                mediaType: "text/plain",
                sourceId: "s1",
                title: "Test Source",
                type: "source-document",
              })
            }
            type="button"
          >
            Add Source
          </button>
          <PromptInputReferencedSources>
            {(source) => <div key={source.id}>{source.title}</div>}
          </PromptInputReferencedSources>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <ReferencedSourceConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a referenced source
    await user.click(screen.getByTestId("add-source"));
    expect(screen.getByText("Test Source")).toBeInTheDocument();

    // Type and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for submission attempt
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Verify referenced source was NOT cleared due to error
    expect(screen.getByText("Test Source")).toBeInTheDocument();
  });

  it("does not clear referenced sources when async onSubmit rejects", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn(
      // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
      () => Promise.reject(new Error("Async submission failed"))
    );
    const user = userEvent.setup();

    const ReferencedSourceConsumer = () => {
      const refs = usePromptInputReferencedSources();
      return (
        <>
          <button
            data-testid="add-source"
            onClick={() =>
              refs.add({
                mediaType: "text/plain",
                sourceId: "s1",
                title: "Test Source",
                type: "source-document",
              })
            }
            type="button"
          >
            Add Source
          </button>
          <PromptInputReferencedSources>
            {(source) => <div key={source.id}>{source.title}</div>}
          </PromptInputReferencedSources>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <ReferencedSourceConsumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add a referenced source
    await user.click(screen.getByTestId("add-source"));
    expect(screen.getByText("Test Source")).toBeInTheDocument();

    // Type and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for async submission attempt
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Give time for promise rejection
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Verify referenced source was NOT cleared due to rejection
    expect(screen.getByText("Test Source")).toBeInTheDocument();
  });

  it("clears both attachments and referenced sources after successful submission", async () => {
    setupPromptInputTests();
    // oxlint-disable-next-line eslint-plugin-promise(prefer-await-to-then)
    const onSubmit = vi.fn(() => Promise.resolve());
    const user = userEvent.setup();

    const file = new File(["test"], "test.txt", { type: "text/plain" });

    const Consumer = () => {
      const attachments = usePromptInputAttachments();
      const refs = usePromptInputReferencedSources();
      return (
        <>
          <button
            data-testid="add-file"
            onClick={() => attachments.add([file])}
            type="button"
          >
            Add File
          </button>
          <button
            data-testid="add-source"
            onClick={() =>
              refs.add({
                mediaType: "text/plain",
                sourceId: "s1",
                title: "Test Source",
                type: "source-document",
              })
            }
            type="button"
          >
            Add Source
          </button>
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
          <PromptInputReferencedSources>
            {(source) => <div key={source.id}>{source.title}</div>}
          </PromptInputReferencedSources>
        </>
      );
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <Consumer />
          <PromptInputTextarea />
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );

    // Add both attachment and referenced source
    await user.click(screen.getByTestId("add-file"));
    await user.click(screen.getByTestId("add-source"));
    expect(screen.getByText("test.txt")).toBeInTheDocument();
    expect(screen.getByText("Test Source")).toBeInTheDocument();

    // Type and submit
    const textarea = screen.getByPlaceholderText(
      "What would you like to know?"
    ) as HTMLTextAreaElement;
    await user.type(textarea, "test message");
    await user.keyboard("{Enter}");

    // Wait for async submission
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    // Give time for promise resolution
    // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Verify both were cleared
    expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Source")).not.toBeInTheDocument();
  });
});

describe("promptInputActionAddAttachments", () => {
  it("opens file dialog when clicked", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const addButton = screen.getByText("Add photos or files");
    expect(addButton).toBeInTheDocument();
  });

  it("accepts custom label", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments label="Upload files" />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByText("Upload files")).toBeInTheDocument();
  });
});

describe("promptInputActionAddScreenshot", () => {
  it("captures a screenshot and adds it as attachment", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const { getDisplayMedia, pause, play, stopTrack, toBlob } =
      setupScreenshotCaptureMock();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddScreenshot />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Take screenshot"));

    await vi.waitFor(() => {
      expect(screen.getByText(/^screenshot-.*\.png$/)).toBeInTheDocument();
    });
    expect(getDisplayMedia).toHaveBeenCalledOnce();
    expect(play).toHaveBeenCalledOnce();
    expect(toBlob).toHaveBeenCalledOnce();
    expect(stopTrack).toHaveBeenCalledOnce();
    expect(pause).toHaveBeenCalledOnce();
  });

  it("ignores denied capture permission", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());
    const { getDisplayMedia } = setupScreenshotCaptureMock();
    getDisplayMedia.mockRejectedValue(
      new DOMException("Permission denied", "NotAllowedError")
    );

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => (
              <div key={attachment.id}>{attachment.filename}</div>
            )}
          </PromptInputAttachments>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddScreenshot />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Take screenshot"));

    await vi.waitFor(() => {
      expect(getDisplayMedia).toHaveBeenCalledOnce();
    });
    expect(screen.queryByText(/^screenshot-.*\.png$/)).not.toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
  });
});

describe("promptInputHeader", () => {
  it("renders header content", async () => {
    setupPromptInputTests();
    const { PromptInputHeader } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputHeader>Header content</PromptInputHeader>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    setupPromptInputTests();
    const { PromptInputHeader } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputHeader className="custom-header">
            Header
          </PromptInputHeader>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );

    expect(container.querySelector(".custom-header")).toBeInTheDocument();
  });
});

describe("promptInputFooter", () => {
  it("renders footer content", async () => {
    setupPromptInputTests();
    const { PromptInputFooter } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputFooter>Footer content</PromptInputFooter>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    setupPromptInputTests();
    const { PromptInputFooter } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputFooter className="custom-footer">
            Footer
          </PromptInputFooter>
        </PromptInputBody>
      </PromptInput>
    );

    expect(container.querySelector(".custom-footer")).toBeInTheDocument();
  });
});

describe("promptInputHoverCard", () => {
  it("renders hover card", async () => {
    setupPromptInputTests();
    const {
      PromptInputHoverCard,
      PromptInputHoverCardTrigger,
      PromptInputHoverCardContent,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputHoverCard>
            <PromptInputHoverCardTrigger>
              <span>Hover me</span>
            </PromptInputHoverCardTrigger>
            <PromptInputHoverCardContent>
              Tooltip content
            </PromptInputHoverCardContent>
          </PromptInputHoverCard>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});

describe("promptInputCommand", () => {
  it("renders command input", async () => {
    setupPromptInputTests();
    const {
      PromptInputCommand,
      PromptInputCommandInput,
      PromptInputCommandList,
      PromptInputCommandEmpty,
      PromptInputCommandGroup,
      PromptInputCommandItem,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    // Mock scrollIntoView for command
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(vi.fn());

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputCommand>
            <PromptInputCommandInput placeholder="Search..." />
            <PromptInputCommandList>
              <PromptInputCommandEmpty>No results</PromptInputCommandEmpty>
              <PromptInputCommandGroup heading="Suggestions">
                <PromptInputCommandItem>Item 1</PromptInputCommandItem>
                <PromptInputCommandItem>Item 2</PromptInputCommandItem>
              </PromptInputCommandGroup>
            </PromptInputCommandList>
          </PromptInputCommand>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("shows empty state", async () => {
    setupPromptInputTests();
    const {
      PromptInputCommand,
      PromptInputCommandInput,
      PromptInputCommandList,
      PromptInputCommandEmpty,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    // Mock scrollIntoView for command
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(vi.fn());

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputCommand>
            <PromptInputCommandInput />
            <PromptInputCommandList>
              <PromptInputCommandEmpty>
                No results found
              </PromptInputCommandEmpty>
            </PromptInputCommandList>
          </PromptInputCommand>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders command separator", async () => {
    setupPromptInputTests();
    const {
      PromptInputCommand,
      PromptInputCommandList,
      PromptInputCommandGroup,
      PromptInputCommandItem,
      PromptInputCommandSeparator,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    // Mock scrollIntoView for command
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(vi.fn());

    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputCommand>
            <PromptInputCommandList>
              <PromptInputCommandGroup>
                <PromptInputCommandItem>Item 1</PromptInputCommandItem>
              </PromptInputCommandGroup>
              <PromptInputCommandSeparator />
              <PromptInputCommandGroup>
                <PromptInputCommandItem>Item 2</PromptInputCommandItem>
              </PromptInputCommandGroup>
            </PromptInputCommandList>
          </PromptInputCommand>
        </PromptInputBody>
      </PromptInput>
    );

    expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
  });
});

describe("promptInputTab components", () => {
  it("renders tab list", async () => {
    setupPromptInputTests();
    const { PromptInputTabsList, PromptInputTab } =
      await import("../src/prompt-input");
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTabsList>
            <PromptInputTab>Tab 1</PromptInputTab>
            <PromptInputTab>Tab 2</PromptInputTab>
          </PromptInputTabsList>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
  });

  it("renders tab with label and body", async () => {
    setupPromptInputTests();
    const {
      PromptInputTab,
      PromptInputTabLabel,
      PromptInputTabBody,
      PromptInputTabItem,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTab>
            <PromptInputTabLabel>Commands</PromptInputTabLabel>
            <PromptInputTabBody>
              <PromptInputTabItem>Command 1</PromptInputTabItem>
              <PromptInputTabItem>Command 2</PromptInputTabItem>
            </PromptInputTabBody>
          </PromptInputTab>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Commands")).toBeInTheDocument();
    expect(screen.getByText("Command 1")).toBeInTheDocument();
    expect(screen.getByText("Command 2")).toBeInTheDocument();
  });
});

describe("promptInputSelect components", () => {
  it("renders model select with all subcomponents", () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSelect>
            <PromptInputSelectTrigger>
              <PromptInputSelectValue placeholder="Choose model" />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              <PromptInputSelectItem value="model-1">
                Model 1
              </PromptInputSelectItem>
              <PromptInputSelectItem value="model-2">
                Model 2
              </PromptInputSelectItem>
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("Choose model")).toBeInTheDocument();
  });

  it("opens model select menu", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    // Mock hasPointerCapture and releasePointerCapture for select
    vi.spyOn(Element.prototype, "hasPointerCapture").mockReturnValue(false);
    vi.spyOn(Element.prototype, "releasePointerCapture").mockImplementation();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSelect>
            <PromptInputSelectTrigger>
              <PromptInputSelectValue placeholder="Select" />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              <PromptInputSelectItem value="model-1">
                Model 1
              </PromptInputSelectItem>
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputBody>
      </PromptInput>
    );

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await vi.waitFor(() => {
      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });
  });
});

describe("promptInputActionMenu subcomponents", () => {
  it("renders action menu content", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionMenuItem>Action 1</PromptInputActionMenuItem>
              <PromptInputActionMenuItem>Action 2</PromptInputActionMenuItem>
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputBody>
      </PromptInput>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await vi.waitFor(() => {
      expect(screen.getByText("Action 1")).toBeInTheDocument();
      expect(screen.getByText("Action 2")).toBeInTheDocument();
    });
  });

  it("handles menu item click", async () => {
    setupPromptInputTests();
    const onSubmit = vi.fn();
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionMenuItem onSelect={onAction}>
                Click me
              </PromptInputActionMenuItem>
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputBody>
      </PromptInput>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await vi.waitFor(async () => {
      const menuItem = screen.getByText("Click me");
      expect(menuItem).toBeInTheDocument();
      await user.click(menuItem);
    });

    expect(onAction).toHaveBeenCalled();
  });
});

describe("integration tests", () => {
  it("renders complete prompt input with all components", async () => {
    setupPromptInputTests();
    const { PromptInputHeader, PromptInputFooter } =
      await import("../src/prompt-input");
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputHeader>
            <PromptInputSelect>
              <PromptInputSelectTrigger>
                <PromptInputSelectValue placeholder="Model" />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                <PromptInputSelectItem value="gpt-4">
                  GPT-4
                </PromptInputSelectItem>
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputHeader>
          <PromptInputTextarea />
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionMenuItem>Action</PromptInputActionMenuItem>
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInputBody>
      </PromptInput>
    );

    expect(
      screen.getByPlaceholderText("What would you like to know?")
    ).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: SUBMIT_REGEX })
    ).toBeInTheDocument();
  });
});
