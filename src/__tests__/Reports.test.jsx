import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LibraryProvider } from '../context/LibraryContext';
import Reports from '../components/Reports';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Reports', () => {
  test('displays overdue books', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 1, title: 'Overdue Book', author: 'Author', tags: [], status: 'loaned', dueDate: pastDate.toISOString(), checkoutCount: 1 }
      ]);
      return '[]';
    });
    render(
      <LibraryProvider>
        <Reports />
      </LibraryProvider>
    );
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  test('displays top books', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 1, title: 'Popular Book', author: 'Author', tags: [], checkoutCount: 5 },
        { id: 2, title: 'Less Popular', author: 'Author', tags: [], checkoutCount: 2 }
      ]);
      return '[]';
    });
    render(
      <LibraryProvider>
        <Reports />
      </LibraryProvider>
    );
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});