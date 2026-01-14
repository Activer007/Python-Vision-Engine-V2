import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BracketLens } from '../BracketLens';

describe('BracketLens Component', () => {
  const mockSetConsole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default sample code', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    // Check if initial console message is set
    expect(mockSetConsole).toHaveBeenCalledWith(expect.stringContaining('Level 1: 括号透视镜'));

    // Check if code input is present with default value
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(
      'result = api_call( "user_data" )[0][ { "id": 101, "meta": ( 2024, "Q1" ) } ]'
    );
  });

  it('parses and renders tokens correctly', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    // Check for some expected content tokens
    expect(screen.getByText('result = api_call')).toBeInTheDocument();
    expect(screen.getByText('"user_data"')).toBeInTheDocument();

    // Check for bracket tokens (using text content might be tricky due to split spans, but let's try generic brackets)
    const openParens = screen.getAllByText('(');
    expect(openParens.length).toBeGreaterThan(0);
  });

  it('updates analysis and console when hovering over a bracket', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    // Find a specific bracket to hover (e.g., the first '(')
    const openParen = screen.getAllByText('(')[0];

    fireEvent.mouseEnter(openParen);

    // Check if setConsole was called with some interpretation story
    expect(mockSetConsole).toHaveBeenCalledTimes(2); // 1 for mount, 1 for hover
    expect(mockSetConsole).toHaveBeenLastCalledWith(expect.stringContaining('🤖 翻译官'));

    // Check if analysis panel shows up
    expect(screen.getByText('执行 & 组合')).toBeInTheDocument();
    expect(screen.getByText('启动机器的按钮')).toBeInTheDocument();
  });

  it('clears analysis when mouse leaves', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    const openParen = screen.getAllByText('(')[0];
    fireEvent.mouseEnter(openParen);
    expect(screen.getByText('执行 & 组合')).toBeInTheDocument();

    fireEvent.mouseLeave(openParen);

    // Analysis panel should revert to default state
    expect(screen.queryByText('执行 & 组合')).not.toBeInTheDocument();
    expect(screen.getByText('鼠标悬停在上方代码的括号上，查看详细语法解析')).toBeInTheDocument();
    expect(mockSetConsole).toHaveBeenLastCalledWith('...等待探索...');
  });

  it('updates visualization when input code changes', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'func([1, 2])' } });

    expect(input).toHaveValue('func([1, 2])');
    expect(screen.getByText('func')).toBeInTheDocument();
    expect(screen.getByText('1, 2')).toBeInTheDocument();

    // Hover over the new bracket
    const openBracket = screen.getAllByText('[')[0];
    fireEvent.mouseEnter(openBracket);

    expect(screen.getByText('可变容器')).toBeInTheDocument();
    expect(screen.getByText('List (列表)')).toBeInTheDocument();
  });

  it('correctly identifies List vs Indexing', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    const input = screen.getByRole('textbox');
    // Test pure list
    fireEvent.change(input, { target: { value: 'my_list = [1, 2]' } });

    const listBracket = screen.getAllByText('[')[0];
    fireEvent.mouseEnter(listBracket);
    expect(screen.getByText('可变容器')).toBeInTheDocument();
    expect(screen.getByText('List (列表)')).toBeInTheDocument();

    // Test indexing
    fireEvent.change(input, { target: { value: 'data[0]' } });
    const indexBracket = screen.getAllByText('[')[0];
    fireEvent.mouseEnter(indexBracket);
    expect(screen.getByText('定位 & 索引')).toBeInTheDocument();
  });

  it('correctly identifies Dictionary vs Set', () => {
    render(<BracketLens setConsole={mockSetConsole} />);

    const input = screen.getByRole('textbox');

    // Test Dictionary
    fireEvent.change(input, { target: { value: '{"key": "value"}' } });
    const dictBracket = screen.getAllByText('{')[0];
    fireEvent.mouseEnter(dictBracket);
    expect(screen.getByText('映射 & 查找')).toBeInTheDocument();
    expect(screen.getByText('Dictionary (字典)')).toBeInTheDocument();

    // Test Set
    fireEvent.change(input, { target: { value: '{1, 2, 3}' } });
    const setBracket = screen.getAllByText('{')[0];
    fireEvent.mouseEnter(setBracket);
    expect(screen.getByText('无序集合 / 格式化')).toBeInTheDocument();
  });
});
