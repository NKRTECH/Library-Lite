import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LibraryProvider } from '../context/LibraryContext';
import AddBook from '../components/forms/AddBook';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AddBook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue('[]');
    localStorageMock.setItem.mockClear();
  });

  test('renders form', () => {
    render(
      <LibraryProvider>
        <AddBook />
      </LibraryProvider>
    );
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Author *')).toBeInTheDocument();
    expect(screen.getByLabelText('Tags (comma separated)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
  });

  test('adds a book successfully', () => {
    render(
      <LibraryProvider>
        <AddBook />
      </LibraryProvider>
    );
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'Test Book' } });
    fireEvent.change(screen.getByLabelText('Author *'), { target: { value: 'New Author' } });
    fireEvent.change(screen.getByLabelText('Tags (comma separated)'), { target: { value: 'fiction' } });
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('rejects duplicate title', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{ id: 1, title: 'Test Book', author: 'Author', tags: [] }]));
    render(
      <LibraryProvider>
        <AddBook />
      </LibraryProvider>
    );
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'Test Book' } });
    fireEvent.change(screen.getByLabelText('Author *'), { target: { value: 'New Author' } });
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));
    expect(screen.getByText('Book with this title already exists')).toBeInTheDocument();
  });
});