import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInItem,
  OpenInLabel,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from '../src/open-in-chat';

describe('OpenIn', () => {
  it('renders children', () => {
    render(
      <OpenIn defaultOpen query="test query">
        <OpenInTrigger />
        <OpenInContent>Content</OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('OpenInTrigger', () => {
  it('renders default trigger', () => {
    render(
      <OpenIn defaultOpen query="test">
        <OpenInTrigger />
        <OpenInContent />
      </OpenIn>
    );
    expect(screen.getByText('Open in chat')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <OpenIn defaultOpen query="test">
        <OpenInTrigger>
          <button>Custom trigger</button>
        </OpenInTrigger>
        <OpenInContent />
      </OpenIn>
    );
    expect(screen.getByText('Custom trigger')).toBeInTheDocument();
  });
});

describe('OpenInContent', () => {
  it('renders content', () => {
    render(
      <OpenIn defaultOpen query="test">
        <OpenInContent>Menu content</OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Menu content')).toBeInTheDocument();
  });
});

describe('OpenInItem', () => {
  it('renders menu item', () => {
    render(
      <OpenIn defaultOpen query="test">
        <OpenInContent>
          <OpenInItem>Item</OpenInItem>
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});

describe('OpenInLabel', () => {
  it('renders label', () => {
    render(
      <OpenIn defaultOpen query="test">
        <OpenInContent>
          <OpenInLabel>Label</OpenInLabel>
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Label')).toBeInTheDocument();
  });
});

describe('OpenInSeparator', () => {
  it('renders separator', () => {
    render(
      <OpenIn defaultOpen query="test">
        <OpenInContent>
          <OpenInSeparator />
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

describe('OpenInChatGPT', () => {
  it('renders ChatGPT link', () => {
    render(
      <OpenIn defaultOpen query="test query">
        <OpenInContent>
          <OpenInChatGPT />
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Open in ChatGPT')).toBeInTheDocument();
    const link = screen.getByRole('menuitem', { name: /ChatGPT/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('chatgpt.com'));
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('OpenInClaude', () => {
  it('renders Claude link', () => {
    render(
      <OpenIn defaultOpen query="test query">
        <OpenInContent>
          <OpenInClaude />
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Open in Claude')).toBeInTheDocument();
    const link = screen.getByRole('menuitem', { name: /Claude/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('claude.ai'));
  });
});

describe('OpenInT3', () => {
  it('renders T3 link', () => {
    render(
      <OpenIn defaultOpen query="test query">
        <OpenInContent>
          <OpenInT3 />
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Open in T3 Chat')).toBeInTheDocument();
    const link = screen.getByRole('menuitem', { name: /T3/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('t3.chat'));
  });
});

describe('OpenInScira', () => {
  it('renders Scira link', () => {
    render(
      <OpenIn defaultOpen query="test query">
        <OpenInContent>
          <OpenInScira />
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Open in Scira')).toBeInTheDocument();
    const link = screen.getByRole('menuitem', { name: /Scira/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('scira.ai'));
  });
});

describe('OpenInv0', () => {
  it('renders V0 link', () => {
    render(
      <OpenIn defaultOpen query="test query">
        <OpenInContent>
          <OpenInv0 />
        </OpenInContent>
      </OpenIn>
    );
    expect(screen.getByText('Open in v0')).toBeInTheDocument();
    const link = screen.getByRole('menuitem', { name: /v0/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('v0.app'));
  });
});