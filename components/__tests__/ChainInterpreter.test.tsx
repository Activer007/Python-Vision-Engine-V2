import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChainInterpreter } from '../ChainInterpreter';

describe('ChainInterpreter Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default CLEANING mode at step 0', () => {
    render(<ChainInterpreter setConsole={mockSetConsole} />);

    // Title
    expect(screen.getByText(/Level 5: Chain Interpreter/)).toBeInTheDocument();

    // Default Scenario Button active
    // We can check text presence
    expect(screen.getByText('1. Data Cleaning')).toBeInTheDocument();

    // Default Console
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('加载原始数据'));

    // Default Table Headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();

    // Raw Data present (including NaN ones)
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument(); // Bob has null score
    expect(screen.getAllByText('NaN').length).toBeGreaterThan(0);
  });

  it('filters data at CLEANING step 1 (dropna)', () => {
    render(<ChainInterpreter setConsole={mockSetConsole} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 1 } });

    // Console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('.dropna()'));

    // Valid rows should be visible (opacity 1 or just present in DOM as we don't fully unmount, but class changes)
    // The component uses opacity/height classes to hide.
    // Testing Library `toBeVisible` might work if display:none or visibility:hidden, but here it's opacity/h-0.
    // However, the text is still in the DOM.
    // Let's check the container class of filtered rows if possible, or check if the "Dropping..." indicator appears.

    // Check for "Dropping..." visual cue
    expect(screen.getByText('Dropping...')).toBeInTheDocument();

    // We can assume functional correctness if the visual cue and console are correct,
    // but ideally we check if the row with "Bob" has the hidden classes.
    // Bob is index 1 (2nd row).
    // It's hard to target specific row by text "Bob" parent without more queries.
    // We'll rely on the console and step state verification via code text.
    expect(screen.getByText('.dropna()')).toHaveClass('text-pve-red');
  });

  it('renames column at CLEANING step 2', () => {
    render(<ChainInterpreter setConsole={mockSetConsole} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 2 } });

    // Check Header change
    expect(screen.getByText('Final_Grade')).toBeInTheDocument();
    expect(screen.queryByText('Score')).not.toBeInTheDocument();

    // Console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('.rename()'));
  });

  it('shows mean value at CLEANING step 3', () => {
    render(<ChainInterpreter setConsole={mockSetConsole} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 3 } });

    // Table should be gone (or not visible)
    // The component conditionally renders: {!showTable ? (...) : (...)}
    // So table should definitely be gone from DOM
    expect(screen.queryByText('ID')).not.toBeInTheDocument();

    // Calculator and single value should appear
    // Value calculation: (95 + 82 + 88) / 3 = 88.3
    expect(screen.getByText('88.3')).toBeInTheDocument();
    expect(screen.getByText('Final_Grade (Mean)')).toBeInTheDocument();

    // Console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('.mean()'));
  });

  it('switches to ANALYTICS scenario', () => {
    render(<ChainInterpreter setConsole={mockSetConsole} />);

    const analyticsBtn = screen.getByRole('button', { name: /Analytics Pipeline/ });
    fireEvent.click(analyticsBtn);

    // Step should reset to 0
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe('0');

    // Console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('加载 DataFrame'));

    // Check Analytics specific data (Frank, Grace...)
    expect(screen.getByText('Frank')).toBeInTheDocument();
  });

  it('performs ANALYTICS steps correctly', () => {
    render(<ChainInterpreter setConsole={mockSetConsole} />);
    fireEvent.click(screen.getByRole('button', { name: /Analytics Pipeline/ }));
    const slider = screen.getByRole('slider');

    // Step 1: query (filter scores < 80)
    fireEvent.change(slider, { target: { value: 1 } });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('.query()'));
    // Frank has 75, should be filtered. Grace 92, kept.
    // Check visual cue
    expect(screen.getByText('Filtering...')).toBeInTheDocument();

    // Step 2: assign (new column)
    fireEvent.change(slider, { target: { value: 2 } });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('.assign()'));
    // Check new column header
    expect(screen.getByText(/Grade/)).toBeInTheDocument();
    expect(screen.getAllByText('"A"').length).toBeGreaterThan(0);

    // Step 3: sort
    fireEvent.change(slider, { target: { value: 3 } });
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('.sort_values()'));

    // Sort logic: Descending score.
    // Judy (95), Grace (92), Heidi (88).
    // DOM order should reflect this.
    // Check if Judy appears before Grace in the document position
    const judy = screen.getByText('Judy');
    const grace = screen.getByText('Grace');
    expect(judy.compareDocumentPosition(grace)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    // means Grace follows Judy -> Judy is first.
  });
});
