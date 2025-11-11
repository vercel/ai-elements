import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "../src/prompt-input";

// Mock URL.createObjectURL and URL.revokeObjectURL for tests
beforeEach(() => {
  window.URL.createObjectURL = vi.fn(
    (blob) => `blob:mock-url-${Math.random()}`
  );
  window.URL.revokeObjectURL = vi.fn();

  // Mock fetch for blob URL conversion
  window.fetch = vi.fn((url: string) => {
    if (url.startsWith("blob:")) {
      const blob = new Blob(["test content"], { type: "text/plain" });
      return Promise.resolve({
        blob: () => Promise.resolve(blob),
      } as Response);
    }
    return Promise.reject(new Error("Not a blob URL"));
  });

  // Mock FileReader
  window.FileReader = vi.fn(function (this: FileReader) {
    this.readAsDataURL = vi.fn(function (this: FileReader, blob: Blob) {
      // Simulate async file reading
      setTimeout(() => {
        this.result = "data:text/plain;base64,dGVzdCBjb250ZW50";
        this.onloadend?.(new ProgressEvent("loadend"));
      }, 0);
    });
    this.result = null;
    this.onloadend = null;
    this.onerror = null;
    return this;
  }) as unknown as typeof FileReader;
});

describe("PromptInput", () => {
  it("renders form", () => {
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

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [message] = onSubmit.mock.calls[0];
    expect(message).toHaveProperty("text", "Hello");
    expect(message).toHaveProperty("files");
  });

  it("clears textarea after form submission - #125", async () => {
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
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Verify textarea is cleared after submission
    expect(textarea.value).toBe("");
  });

  it("does not lose user input typed immediately after submission - #125", async () => {
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
    await user.clear(textarea); // Explicitly clear before typing
    await user.type(textarea, "Second message");

    // Verify the second message is still there (not cleared by race condition)
    expect(textarea.value).toBe("Second message");

    // Wait for async submission to complete
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Second message should still be there after async completion
    expect(textarea.value).toBe("Second message");
  });

  it("converts blob URLs to data URLs on submit - #113", async () => {
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
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Verify that the URL was converted from blob: to data:
    const [message] = onSubmit.mock.calls[0];
    expect(message.files).toHaveLength(1);
    expect(message.files[0].url).toMatch(/^data:/);
    expect(message.files[0].url).not.toMatch(/^blob:/);
    expect(message.files[0].filename).toBe("test.txt");
  });

  it("does not clear attachments when onSubmit throws an error - #126", async () => {
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
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Verify that the attachment is still there (not cleared due to error)
    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  it("does not clear attachments when async onSubmit rejects - #126", async () => {
    const onSubmit = vi.fn(() =>
      Promise.reject(new Error("Async submission failed"))
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
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Give some time for the promise rejection to be handled
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that the attachment is still there (not cleared due to rejection)
    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  it("clears attachments when async onSubmit resolves successfully - #126", async () => {
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
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Give some time for the promise resolution to be handled
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that the attachment was cleared after successful async submission
    expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
  });
});

describe("PromptInputBody", () => {
  it("renders body content", () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>Content</PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("PromptInputTextarea", () => {
  it("renders textarea", () => {
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

    expect(onSubmit).toHaveBeenCalled();
  });

  it("does not submit on Shift+Enter", async () => {
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
      key: "Enter",
      bubbles: true,
      cancelable: true,
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

describe("PromptInputTools", () => {
  it("renders tools", () => {
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

describe("PromptInputButton", () => {
  it("renders button", () => {
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
});

describe("PromptInputSubmit", () => {
  it("renders submit button", () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("shows loading icon when submitted", () => {
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

describe("PromptInputActionMenu", () => {
  it("renders action menu", () => {
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

describe("PromptInputSelect", () => {
  it("renders model select", () => {
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

describe("PromptInputProvider", () => {
  it("provides context to children", async () => {
    const onSubmit = vi.fn();
    const { PromptInputProvider, usePromptInputController } = await import(
      "../src/prompt-input"
    );

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
    const { usePromptInputController } = await import("../src/prompt-input");

    const TestComponent = () => {
      usePromptInputController();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();

    spy.mockRestore();
  });

  it("provides initial input value", async () => {
    const {
      PromptInputProvider,
      PromptInput,
      PromptInputBody,
      PromptInputTextarea,
      usePromptInputController,
    } = await import("../src/prompt-input");
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
    const { PromptInputProvider, useProviderAttachments } = await import(
      "../src/prompt-input"
    );

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

describe("File validation", () => {
  it("enforces maxFiles limit", async () => {
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
});

describe("Drag and drop", () => {
  it("renders with globalDrop prop", () => {
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

describe("Paste functionality", () => {
  it("adds files from clipboard", async () => {
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
    }) as any;

    // Mock clipboardData items
    pasteEvent.clipboardData = {
      items: [
        {
          kind: "file",
          getAsFile: () => file,
        },
      ],
    };

    await act(async () => {
      textarea.dispatchEvent(pasteEvent);
    });

    await vi.waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });
  });

  it("handles paste with no files", () => {
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
    }) as any;

    pasteEvent.clipboardData = {
      items: [],
    };

    // Should not throw
    expect(() => textarea.dispatchEvent(pasteEvent)).not.toThrow();
  });
});

describe("PromptInputAttachment", () => {
  it("renders file attachment with icon", () => {
    const onSubmit = vi.fn();
    const file = {
      id: "1",
      type: "file" as const,
      filename: "document.pdf",
      mediaType: "application/pdf",
      url: "blob:test",
    };

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputAttachment data={file} />
        </PromptInputBody>
      </PromptInput>
    );

    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("renders image attachment", () => {
    const onSubmit = vi.fn();
    const file = {
      id: "1",
      type: "file" as const,
      filename: "image.png",
      mediaType: "image/png",
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
            {(attachment) => (
              <PromptInputAttachment data={attachment} key={attachment.id} />
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

  it("removes attachment if backspace key is pressed and textarea is empty", async () => {
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

describe("PromptInputActionAddAttachments", () => {
  it("opens file dialog when clicked", async () => {
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

describe("PromptInputHeader", () => {
  it("renders header content", async () => {
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

describe("PromptInputFooter", () => {
  it("renders footer content", async () => {
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

describe("PromptInputHoverCard", () => {
  it("renders hover card", async () => {
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

describe("PromptInputCommand", () => {
  it("renders command input", async () => {
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
    Element.prototype.scrollIntoView = vi.fn();

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
    const {
      PromptInputCommand,
      PromptInputCommandInput,
      PromptInputCommandList,
      PromptInputCommandEmpty,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    // Mock scrollIntoView for command
    Element.prototype.scrollIntoView = vi.fn();

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
    const {
      PromptInputCommand,
      PromptInputCommandList,
      PromptInputCommandGroup,
      PromptInputCommandItem,
      PromptInputCommandSeparator,
    } = await import("../src/prompt-input");
    const onSubmit = vi.fn();

    // Mock scrollIntoView for command
    Element.prototype.scrollIntoView = vi.fn();

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

describe("PromptInputTab components", () => {
  it("renders tab list", async () => {
    const { PromptInputTabsList, PromptInputTab } = await import(
      "../src/prompt-input"
    );
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

describe("PromptInputSelect components", () => {
  it("renders model select with all subcomponents", () => {
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
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    // Mock hasPointerCapture and releasePointerCapture for select
    Element.prototype.hasPointerCapture = vi.fn(() => false);
    Element.prototype.releasePointerCapture = vi.fn();

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

describe("PromptInputActionMenu subcomponents", () => {
  it("renders action menu content", async () => {
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

describe("Integration tests", () => {
  it("renders complete prompt input with all components", async () => {
    const { PromptInputHeader, PromptInputFooter } = await import(
      "../src/prompt-input"
    );
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
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
