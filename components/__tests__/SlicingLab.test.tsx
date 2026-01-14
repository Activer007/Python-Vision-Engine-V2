import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SlicingLab } from '../SlicingLab';

describe('SlicingLab Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    render(<SlicingLab setConsole={mockSetConsole} />);

    // Title
    expect(screen.getByText(/Level 7: 切片实验室/)).toBeInTheDocument();

    // Default Console
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('Level 7: 切片实验室'));

    // Default Code Display: text[0 : 6]
    expect(screen.getByText('text[0 : 6]')).toBeInTheDocument();

    // Default Selection: PYTHON_LAB -> PYTHON (0 to 6)
    // P (0) should be highlighted
    // [0] is in text[0:6], [1] is in visual block? No.
    // 'text[0 : 6]' is in header. 'P' is in visual block.
    // The visual block has 'P'.
    // Let's be precise.
    // The component renders char blocks.
    const charBlocks = screen.getAllByText(/^[A-Z_]$/); // Single chars
    // P is index 0.
    const charPBlock = charBlocks.find(el => el.textContent === 'P');
    expect(charPBlock).toHaveClass('bg-pve-amber');

    // _ is index 6 (PYTHON_). 0-6 excludes 6.
    const charUnderscore = charBlocks.find(el => el.textContent === '_');
    expect(charUnderscore).not.toHaveClass('bg-pve-amber');
  });

  it('updates start index', () => {
    render(<SlicingLab setConsole={mockSetConsole} />);

    const sliders = screen.getAllByRole('slider');
    const startSlider = sliders[0];

    fireEvent.change(startSlider, { target: { value: 2 } });

    // slice(2, 6) -> 'THON'
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('"THON"'));

    expect(screen.getByText('text[2 : 6]')).toBeInTheDocument();
  });

  it('updates stop index', () => {
    render(<SlicingLab setConsole={mockSetConsole} />);
    const sliders = screen.getAllByRole('slider');
    const stopSlider = sliders[1];

    fireEvent.change(stopSlider, { target: { value: 4 } });

    // slice(0, 4) -> 'PYTH'
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('"PYTH"'));
  });

  it('updates step', () => {
    render(<SlicingLab setConsole={mockSetConsole} />);
    const sliders = screen.getAllByRole('slider');
    const stepSlider = sliders[2];

    fireEvent.change(stepSlider, { target: { value: 2 } });

    // slice(0, 6, 2) -> 'PTO'
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('"PTO"'));
  });

  it('handles negative step (reverse)', () => {
    render(<SlicingLab setConsole={mockSetConsole} />);

    // Click Reverse button (-1)
    const reverseBtn = screen.getByText('Reverse');
    fireEvent.click(reverseBtn);

    // Set valid range for reverse
    // text[5:0:-1] -> NOHTY
    const sliders = screen.getAllByRole('slider');
    const startSlider = sliders[0];
    const stopSlider = sliders[1];

    fireEvent.change(startSlider, { target: { value: 5 } });
    fireEvent.change(stopSlider, { target: { value: 0 } });

    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('"NOHTY"'));
  });
});
