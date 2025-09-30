import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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