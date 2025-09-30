import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from '../src/prompt-input';

// Mock URL.createObjectURL and URL.revokeObjectURL for tests
beforeEach(() => {
  global.URL.createObjectURL = vi.fn((blob) => `blob:mock-url-${Math.random()}`);
  global.URL.revokeObjectURL = vi.fn();

  // Mock fetch for blob URL conversion
  global.fetch = vi.fn((url: string) => {
    if (url.startsWith('blob:')) {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      return Promise.resolve({
        blob: () => Promise.resolve(blob),
      } as Response);
    }
    return Promise.reject(new Error('Not a blob URL'));
  });

  // Mock FileReader
  const mockFileReader = {
    readAsDataURL: vi.fn(function(this: FileReader, blob: Blob) {
      // Simulate async file reading
      setTimeout(() => {
        this.result = 'data:text/plain;base64,dGVzdCBjb250ZW50';
        this.onloadend?.(new ProgressEvent('loadend'));
      }, 0);
    }),
    result: null,
    onloadend: null,
    onerror: null,
  } as unknown as FileReader;

  global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;
});

describe('PromptInput', () => {
  it('renders form', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('calls onSubmit with message', async () => {
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

    const textarea = screen.getByPlaceholderText('What would you like to know?') as HTMLTextAreaElement;
    await user.type(textarea, 'Hello');

    // Ensure textarea has the value before submitting
    expect(textarea.value).toBe('Hello');

    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [message] = onSubmit.mock.calls[0];
    expect(message).toHaveProperty('text', 'Hello');
    expect(message).toHaveProperty('files');
  });

  it('converts blob URLs to data URLs on submit - #113', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    // Create a mock file
    const fileContent = 'test file content';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });

    const AttachmentConsumer = () => {
      const attachments = usePromptInputAttachments();
      return (
        <>
          <input
            type="button"
            data-testid="add-file-btn"
            onClick={() => attachments.add([file])}
          />
          <PromptInputAttachments>
            {(attachment) => <div key={attachment.id}>{attachment.filename}</div>}
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
    const addFileBtn = screen.getByTestId('add-file-btn');
    await user.click(addFileBtn);

    // Verify file was added with blob URL
    expect(screen.getByText('test.txt')).toBeInTheDocument();

    // Type a message and submit
    const textarea = screen.getByPlaceholderText('What would you like to know?') as HTMLTextAreaElement;
    await user.type(textarea, 'describe file');
    await user.keyboard('{Enter}');

    // Wait for async submission to complete
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    // Verify that the URL was converted from blob: to data:
    const [message] = onSubmit.mock.calls[0];
    expect(message.files).toHaveLength(1);
    expect(message.files[0].url).toMatch(/^data:/);
    expect(message.files[0].url).not.toMatch(/^blob:/);
    expect(message.files[0].filename).toBe('test.txt');
  });
});

describe('PromptInputBody', () => {
  it('renders body content', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>Content</PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('PromptInputTextarea', () => {
  it('renders textarea', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByPlaceholderText('What would you like to know?')).toBeInTheDocument();
  });

  it('submits on Enter key', async () => {
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

    const textarea = screen.getByPlaceholderText('What would you like to know?');
    await user.type(textarea, 'Test');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalled();
  });

  it('does not submit on Shift+Enter', async () => {
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

    const textarea = screen.getByPlaceholderText('What would you like to know?');
    await user.type(textarea, 'Line 1');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    await user.type(textarea, 'Line 2');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('uses custom placeholder', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Custom placeholder" />
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });
});

describe('PromptInputToolbar', () => {
  it('renders toolbar', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputToolbar>Toolbar content</PromptInputToolbar>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText('Toolbar content')).toBeInTheDocument();
  });
});

describe('PromptInputTools', () => {
  it('renders tools', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>Tools</PromptInputTools>
          </PromptInputToolbar>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });
});

describe('PromptInputButton', () => {
  it('renders button', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputButton>Action</PromptInputButton>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});

describe('PromptInputSubmit', () => {
  it('renders submit button', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit />
        </PromptInputBody>
      </PromptInput>
    );
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('shows loading icon when submitted', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit status="submitted" />
        </PromptInputBody>
      </PromptInput>
    );
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows stop icon when streaming', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputSubmit status="streaming" />
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('PromptInputActionMenu', () => {
  it('renders action menu', () => {
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
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('PromptInputModelSelect', () => {
  it('renders model select', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputModelSelect>
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue placeholder="Select model" />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              <PromptInputModelSelectItem value="gpt-4">GPT-4</PromptInputModelSelectItem>
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
        </PromptInputBody>
      </PromptInput>
    );
    expect(screen.getByText('Select model')).toBeInTheDocument();
  });
});