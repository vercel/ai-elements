import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '../src/reasoning';

describe('Reasoning', () => {
  it('renders children', () => {
    render(<Reasoning>Content</Reasoning>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('starts open by default', () => {
    render(
      <Reasoning>
        <ReasoningTrigger />
        <ReasoningContent>Reasoning content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.getByText('Reasoning content')).toBeVisible();
  });

  it('can start closed', () => {
    render(
      <Reasoning defaultOpen={false}>
        <ReasoningTrigger />
        <ReasoningContent>Hidden content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.queryByText('Hidden content')).not.toBeVisible();
  });

  it('calls onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Reasoning defaultOpen={false} onOpenChange={onOpenChange}>
        <ReasoningTrigger />
        <ReasoningContent>Content</ReasoningContent>
      </Reasoning>
    );

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalled();
  });
});

describe('ReasoningTrigger', () => {
  it('renders default thinking message when streaming', () => {
    render(
      <Reasoning isStreaming>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('renders duration message when not streaming', () => {
    render(
      <Reasoning duration={5} isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText('Thought for 5 seconds')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <Reasoning>
        <ReasoningTrigger>Custom trigger</ReasoningTrigger>
      </Reasoning>
    );
    expect(screen.getByText('Custom trigger')).toBeInTheDocument();
  });

  it('has brain icon', () => {
    const { container } = render(
      <Reasoning>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('ReasoningContent', () => {
  it('renders reasoning text', () => {
    render(
      <Reasoning>
        <ReasoningContent>The reasoning process</ReasoningContent>
      </Reasoning>
    );
    expect(screen.getByText('The reasoning process')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Reasoning>
        <ReasoningContent className="custom">Content</ReasoningContent>
      </Reasoning>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});