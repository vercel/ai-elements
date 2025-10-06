import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '../src/conversation';

describe('Conversation', () => {
  it('renders children', () => {
    render(
      <Conversation>
        <ConversationContent>Messages</ConversationContent>
      </Conversation>
    );
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Conversation className="custom">
        <div>Content</div>
      </Conversation>
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has role log', () => {
    const { container } = render(
      <Conversation>
        <div>Content</div>
      </Conversation>
    );
    expect(container.firstChild).toHaveAttribute('role', 'log');
  });
});

describe('ConversationContent', () => {
  it('renders content', () => {
    render(
      <Conversation>
        <ConversationContent>Content</ConversationContent>
      </Conversation>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('ConversationEmptyState', () => {
  it('renders default empty state', () => {
    render(<ConversationEmptyState />);
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
    expect(screen.getByText('Start a conversation to see messages here')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(
      <ConversationEmptyState
        description="Custom description"
        title="Custom title"
      />
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<ConversationEmptyState icon={<span>Icon</span>} />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <ConversationEmptyState>
        <div>Custom content</div>
      </ConversationEmptyState>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});