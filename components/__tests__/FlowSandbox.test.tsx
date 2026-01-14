import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlowSandbox } from '../FlowSandbox';

describe('FlowSandbox Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with default IF mode', () => {
    render(<FlowSandbox setConsole={mockSetConsole} />);

    // Check title
    expect(screen.getByText(/Level 3: 流程控制沙盒/)).toBeInTheDocument();

    // Check console
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('If/Else 分叉口'));

    // Check default IF content
    expect(screen.getByText('if score > 60:')).toBeInTheDocument();
  });

  it('toggles condition in IF mode', () => {
    render(<FlowSandbox setConsole={mockSetConsole} />);

    // Default true
    const toggleBtn = screen.getByRole('button', { name: /Condition: true/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    // Should be false
    expect(screen.getByRole('button', { name: /Condition: false/i })).toBeInTheDocument();
  });

  it('runs IF animation correctly', () => {
    render(<FlowSandbox setConsole={mockSetConsole} />);

    // Click play button (it has a play icon, but we can find it by being the button next to condition toggle)
    // Or finding the button that contains the SVG
    // The button has a Play icon.
    // Let's use getByRole button that is not the condition toggle
    const buttons = screen.getAllByRole('button');
    // buttons[0] is mode IF
    // buttons[1] is mode FOR
    // buttons[2] is Condition
    // buttons[3] is Play
    const playBtn = buttons[3];

    fireEvent.click(playBtn);

    // Check console for animation start
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('判定为 True'));

    // Animation runs for 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Animation state should reset (though not easily visible in DOM props, logic is covered)
  });

  it('switches to FOR mode', () => {
    render(<FlowSandbox setConsole={mockSetConsole} />);

    const forBtn = screen.getByRole('button', { name: 'For Loop' });
    fireEvent.click(forBtn);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('For 循环传送带'));

    // Check FOR content
    expect(screen.getByText(/for i in data_list/)).toBeInTheDocument();
    expect(screen.getByText('Start Loop')).toBeInTheDocument();
  });

  it('runs Loop animation correctly', () => {
    render(<FlowSandbox setConsole={mockSetConsole} />);

    // Switch to FOR
    const forBtn = screen.getByRole('button', { name: 'For Loop' });
    fireEvent.click(forBtn);

    const startBtn = screen.getByRole('button', { name: 'Start Loop' });
    fireEvent.click(startBtn);

    // Loop logic:
    // Items: 10, 20, 30, 40, 50 (length 5)
    // Interval 1000ms

    // 1st iteration (0ms immediate?) No, logic is setInterval so first tick is after 1000ms?
    // Looking at code:
    /*
      const runLoopAnimation = () => {
        if (animating) return;
        setAnimating(true);
        let current = 0;

        const interval = setInterval(() => {
            setLoopIndex(current);
            setConsole(`循环第 ${current + 1} 次...`);
            current++;
            if (current >= loopItems.length) {
                clearInterval(interval);
                setTimeout(() => { ... }, 1000);
            }
        }, 1000);
      };
    */
    // setInterval runs after delay. So first tick is at 1000ms.

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('循环第 1 次'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('循环第 2 次'));

    // Fast forward to end (Total 5 items)
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('循环第 5 次'));

    // Finish timeout (additional 1000ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('循环结束'));
  });
});
