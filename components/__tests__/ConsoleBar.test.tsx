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

  it('sanitizes malicious scripts (XSS protection)', () => {
    const xssAttempt = 'Safe text <script>alert("XSS")</script> <img src="x" onerror="alert(1)">';
    render(<ConsoleBar message={xssAttempt} />);

    // Script tags should be removed
    const scriptTag = document.querySelector('script');
    expect(scriptTag).not.toBeInTheDocument();

    // onerror handler should be removed
    const imgWithOnError = document.querySelector('img[onerror]');
    expect(imgWithOnError).not.toBeInTheDocument();

    // Safe text should still be present
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });

  it('removes dangerous attributes but keeps safe ones', () => {
    const message = 'Click <a href="https://example.com" onclick="alert(1)">here</a>';
    render(<ConsoleBar message={message} />);

    const link = screen.getByRole('link', { name: 'here' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).not.toHaveAttribute('onclick');
  });

  it('blocks data attributes', () => {
    const message = 'Text <span data-test="value">with data attribute</span>';
    render(<ConsoleBar message={message} />);

    const span = screen.getByText('with data attribute');
    expect(span).toBeInTheDocument();
    expect(span).not.toHaveAttribute('data-test');
  });
});
