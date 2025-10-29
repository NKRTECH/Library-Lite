import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LibraryProvider } from '../context/LibraryContext';
import Catalog from '../components/Catalog';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Catalog', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 1, title: 'Harry Potter', author: 'J.K. Rowling', tags: ['fantasy'], status: 'available', waitlist: [] },
        { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', tags: ['fantasy'], status: 'available', waitlist: [] }
      ]);
      if (key === 'members') return '[]';
      return null;
    });
  });

  test('displays books', () => {
    render(
      <LibraryProvider>
        <Catalog />
      </LibraryProvider>
    );
    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.getByText('The Hobbit')).toBeInTheDocument();
  });

  test('filters books by search', () => {
    render(
      <LibraryProvider>
        <Catalog />
      </LibraryProvider>
    );
    const searchInput = screen.getByPlaceholderText('Search by title');
    fireEvent.change(searchInput, { target: { value: 'Harry' } });
    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument();
  });
});