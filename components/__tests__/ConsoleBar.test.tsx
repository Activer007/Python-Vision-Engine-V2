import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConsoleBar } from '../ConsoleBar';

describe('ConsoleBar', () => {
  it('renders the message correctly', () => {
    const testMessage = 'Test message';
    render(<ConsoleBar message={testMessage} />);

    // Check if the message is rendered (with HTML support)
    const messageElement = screen.getByText(testMessage);
    expect(messageElement).toBeInTheDocument();
  });

  it('renders default message when empty', () => {
    render(<ConsoleBar message="" />);

    // Check for default ready message
    const defaultElement = screen.getByText(/系统就绪/i);
    expect(defaultElement).toBeInTheDocument();
  });

  it('renders HTML content safely', () => {
    const htmlMessage = 'Test <span class="text-pve-blue">highlighted</span> message';
    render(<ConsoleBar message={htmlMessage} />);

    const highlightedText = screen.getByText('highlighted');
    expect(highlightedText).toBeInTheDocument();
    expect(highlightedText).toHaveClass('text-pve-blue');
  });
});
