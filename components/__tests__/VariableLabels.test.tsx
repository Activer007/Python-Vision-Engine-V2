import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VariableLabels } from '../VariableLabels';

describe('VariableLabels Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<VariableLabels setConsole={mockSetConsole} />);

    // Check initial console message
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('Level 1: 变量标签墙'));

    // Check labels exist
    expect(screen.getByText('score')).toBeInTheDocument();
    expect(screen.getByText('names_list')).toBeInTheDocument();
    expect(screen.getByText('df_data')).toBeInTheDocument();

    // Check blocks exist (by their object type text)
    expect(screen.getByText('number Object')).toBeInTheDocument();
    expect(screen.getByText('list Object')).toBeInTheDocument();
    expect(screen.getByText('dataframe Object')).toBeInTheDocument();
  });

  it('handles label selection', () => {
    render(<VariableLabels setConsole={mockSetConsole} />);

    const scoreLabel = screen.getByText('score');

    // Initially not selected (check class or style if possible, or just click)
    fireEvent.click(scoreLabel);

    // After click, it should visually indicate selection (implementation details dependent,
    // but we can check if it stays in the document and potentially changes style class)
    // The component applies specific classes on selection: 'bg-pve-amber text-slate-900'
    expect(scoreLabel).toHaveClass('bg-pve-amber');
  });

  it('successfully assigns a label to the correct data block', () => {
    render(<VariableLabels setConsole={mockSetConsole} />);

    // 1. Select 'score' (number)
    fireEvent.click(screen.getByText('score'));

    // 2. Click the number block (98)
    // The number block displays '98'
    const numberBlockContent = screen.getByText('98');
    // We need to click the container, likely the parent of the content or the content itself if it bubbles
    fireEvent.click(numberBlockContent);

    // 3. Check for success message
    expect(mockSetConsole).toHaveBeenCalledWith(
      expect.stringContaining("✅ 成功! 变量 'score' 现在指向了内存中的 number 数据")
    );

    // 4. Label should disappear from the wall (button is gone)
    expect(screen.queryByRole('button', { name: 'score' })).not.toBeInTheDocument();

    // 5. Label should appear on the block
    // The component renders assigned label: <div ...><Tag /> {assignedLabel?.name}</div>
    // We can search for 'score' again, it should be present but in a different location (inside the block).
    expect(screen.getByText('score')).toBeInTheDocument();
  });

  it('shows error when assigning label to wrong data block', () => {
    render(<VariableLabels setConsole={mockSetConsole} />);
    vi.useFakeTimers();

    // 1. Select 'score' (number)
    fireEvent.click(screen.getByText('score'));

    // 2. Click the list block (contains "A", "B")
    const listBlockLabel = screen.getByText('list Object'); // Clicking the text "list Object"
    fireEvent.click(listBlockLabel);

    // 3. Check for error message
    expect(mockSetConsole).toHaveBeenCalledWith(
      expect.stringContaining("⚠️ 错误! 变量名 'score' 期望的是 number 类型")
    );

    // 4. Label should still be in the wall
    // Since it failed, it shouldn't be removed
    const scoreButton = screen.getByRole('button', { name: 'score' });
    expect(scoreButton).toBeInTheDocument();

    // 5. Error state clears after timeout
    act(() => {
      vi.runAllTimers();
    });

    vi.useRealTimers();
  });

  it('handles multiple assignments correctly', () => {
    render(<VariableLabels setConsole={mockSetConsole} />);

    // Assign score -> 98
    fireEvent.click(screen.getByText('score'));
    fireEvent.click(screen.getByText('98'));
    expect(screen.queryByRole('button', { name: 'score' })).not.toBeInTheDocument();

    // Assign names_list -> ["A", "B"]
    fireEvent.click(screen.getByText('names_list'));
    fireEvent.click(screen.getByText('list Object'));
    expect(screen.queryByRole('button', { name: 'names_list' })).not.toBeInTheDocument();

    expect(mockSetConsole).toHaveBeenCalledWith(
      expect.stringContaining("✅ 成功! 变量 'names_list' 现在指向了内存中的 list 数据")
    );
  });
});
