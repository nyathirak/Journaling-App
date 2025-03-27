import { render, screen, fireEvent } from '@testing-library/react';
import JournalForm from './JournalForm';
import '@testing-library/jest-dom';
import React from 'react';

describe('JournalForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the form with default values', () => {
    render(<JournalForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/category/i)).toHaveValue('personal');
    expect(screen.getByLabelText(/your thoughts/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /save entry/i })).toBeInTheDocument();
  });

  it('pre-fills the form when entryToEdit is provided', () => {
    const entryToEdit = {
      id: '1',
      userId: 1,
      title: 'Test Title',
      content: 'Test Content',
      category: 'work',
      createdAt: '2023-01-01',
    };

    render(<JournalForm onSubmit={mockOnSubmit} entryToEdit={entryToEdit} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Title');
    expect(screen.getByLabelText(/category/i)).toHaveValue('work');
    expect(screen.getByLabelText(/your thoughts/i)).toHaveValue('Test Content');
    expect(screen.getByRole('button', { name: /update entry/i })).toBeInTheDocument();
  });

  it('handles input changes for title, category, and content', () => {
    render(<JournalForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'ideas' } });
    fireEvent.change(screen.getByLabelText(/your thoughts/i), { target: { value: 'New Content' } });

    expect(screen.getByLabelText(/title/i)).toHaveValue('New Title');
    expect(screen.getByLabelText(/category/i)).toHaveValue('ideas');
    expect(screen.getByLabelText(/your thoughts/i)).toHaveValue('New Content');
  });

  it('submits the form and calls onSubmit with the correct data', () => {
    render(<JournalForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'goals' } });
    fireEvent.change(screen.getByLabelText(/your thoughts/i), { target: { value: 'Test Content' } });

    fireEvent.click(screen.getByRole('button', { name: /save entry/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: '',
      userId: 0,
      title: 'Test Title',
      content: 'Test Content',
      category: 'goals',
      createdAt: '',
    });
  });

  it('resets the form after submission', () => {
    render(<JournalForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'goals' } });
    fireEvent.change(screen.getByLabelText(/your thoughts/i), { target: { value: 'Test Content' } });

    fireEvent.click(screen.getByRole('button', { name: /save entry/i }));

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/category/i)).toHaveValue('personal');
    expect(screen.getByLabelText(/your thoughts/i)).toHaveValue('');
  });
});