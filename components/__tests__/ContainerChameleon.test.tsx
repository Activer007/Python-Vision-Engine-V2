import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContainerChameleon } from '../ContainerChameleon';

describe('ContainerChameleon Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default LIST mode', () => {
    render(<ContainerChameleon setConsole={mockSetConsole} />);

    // Check header
    expect(screen.getByText(/Level 3: 容器变形记/)).toBeInTheDocument();

    // Check default console message (LIST)
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('列表 (List)'));

    // Check bracket text for LIST
    expect(screen.getByText('[0]')).toBeInTheDocument();

    // Check list visualization (index: 0, etc.)
    expect(screen.getByText('index: 0')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('switches to TUPLE mode correctly', () => {
    render(<ContainerChameleon setConsole={mockSetConsole} />);

    const tupleBtn = screen.getByRole('button', { name: /Tuple/ });
    fireEvent.click(tupleBtn);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('元组 (Tuple)'));

    // Check TUPLE specific element
    expect(screen.getByText('Immutable')).toBeInTheDocument();
  });

  it('switches to DICT mode correctly', () => {
    render(<ContainerChameleon setConsole={mockSetConsole} />);

    const dictBtn = screen.getByRole('button', { name: /Dict/ });
    fireEvent.click(dictBtn);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('字典 (Dict)'));

    // Check DICT keys
    expect(screen.getByText('"0_key"')).toBeInTheDocument();
  });

  it('switches to SERIES mode correctly', () => {
    render(<ContainerChameleon setConsole={mockSetConsole} />);

    const seriesBtn = screen.getByRole('button', { name: /Series/ });
    fireEvent.click(seriesBtn);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('Series'));

    // Check Series visual
    expect(screen.getByText('Index (Axis 0)')).toBeInTheDocument();
    expect(screen.getByText('dtype: int64')).toBeInTheDocument();
  });

  it('switches to DATAFRAME mode correctly', () => {
    render(<ContainerChameleon setConsole={mockSetConsole} />);

    const dfBtn = screen.getByRole('button', { name: /DataFrame/ });
    fireEvent.click(dfBtn);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('DataFrame'));

    // Check DataFrame visual
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Column Axis (Series)')).toBeInTheDocument();
  });

  it('toggles highlight when clicking the bracket/accessor', () => {
    render(<ContainerChameleon setConsole={mockSetConsole} />);
    vi.useFakeTimers();

    // In LIST mode, text is '[0]'
    const bracketSpan = screen.getByText('[0]');

    // Initial class shouldn't have scale-150 (it has hover effects but let's check basic presence)
    expect(bracketSpan).toBeInTheDocument();

    fireEvent.click(bracketSpan);

    // After click, it should have highlight classes
    expect(bracketSpan).toHaveClass('scale-150');

    // Wait for timeout
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should remove highlight
    expect(bracketSpan).not.toHaveClass('scale-150');

    vi.useRealTimers();
  });
});

import { act } from 'react';
