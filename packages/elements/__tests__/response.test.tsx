import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Response } from '../src/response';

describe('Response', () => {
  it('renders markdown content', () => {
    render(<Response>Plain text</Response>);
    expect(screen.getByText('Plain text')).toBeInTheDocument();
  });

  it('renders markdown with formatting', () => {
    render(<Response>**Bold** text</Response>);
    expect(screen.getByText(/Bold/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Response className="custom-class">Text</Response>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders children as markdown', () => {
    render(<Response># Heading</Response>);
    expect(screen.getByText('Heading')).toBeInTheDocument();
  });
});