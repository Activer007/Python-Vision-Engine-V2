import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogicToggles } from '../LogicToggles';

describe('LogicToggles Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    render(<LogicToggles setConsole={mockSetConsole} />);

    // Check title
    expect(screen.getByText(/Level 4: 逻辑开关/)).toBeInTheDocument();

    // Check initial console message
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('Level 4: 逻辑开关'));

    // Check default inputs
    // Threshold defaults to 60
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(60);

    // Operator defaults to '>'
    // The buttons don't have distinct roles other than button, check for class or active state logic if possible
    // But we can check if '>' button exists
    expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
  });

  it('updates threshold and logic correctly', () => {
    render(<LogicToggles setConsole={mockSetConsole} />);

    // Default: > 60.
    // Scores: 45, 92, 67, 88, 30
    // Expected True: 92, 67, 88 (3 students)

    // We can count how many "True" badges are visible
    let trueBadges = screen.getAllByText('True');
    expect(trueBadges).toHaveLength(3);

    // Change threshold to 90
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '90' } });

    // New Logic: > 90.
    // Scores > 90: 92 only (1 student)
    trueBadges = screen.getAllByText('True');
    expect(trueBadges).toHaveLength(1);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('90'));
  });

  it('updates operator and logic correctly', () => {
    render(<LogicToggles setConsole={mockSetConsole} />);

    // Default > 60 (3 True)

    // Click '<' button
    fireEvent.click(screen.getByRole('button', { name: '<' }));

    // Logic: < 60
    // Scores < 60: 45, 30 (2 students)
    const trueBadges = screen.getAllByText('True');
    expect(trueBadges).toHaveLength(2);

    // Check console update
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('60'));
  });

  it('handles equality operator correctly', () => {
    render(<LogicToggles setConsole={mockSetConsole} />);

    // Set operator to ==
    fireEvent.click(screen.getByRole('button', { name: '==' }));

    // Set threshold to 45
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '45' } });

    // Logic: == 45
    // Scores == 45: 45 (1 student)
    const trueBadges = screen.getAllByText('True');
    expect(trueBadges).toHaveLength(1);

    // Verify specific student is selected (Student A has 45)
    // We need to find the card for Student A and check if it has True
    // Ideally we'd look for parent element, but `screen.getAllByText('True')` is simple enough for count
  });

  it('updates summary footer count correctly', () => {
    render(<LogicToggles setConsole={mockSetConsole} />);

    // Default > 60 => 3 selected
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Rows Selected/)).toBeInTheDocument();

    // Change to > 100 => 0 selected
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '100' } });

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
