import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { LibraryProvider, useLibrary } from '../context/LibraryContext';
import React, { useEffect } from 'react';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function Runner({ fn }) {
  const api = useLibrary();
  useEffect(() => {
    fn(api);
  }, []);
  return null;
}

describe('Lend flows', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
  });

  test('lending to available book -> lent', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 1, title: 'Book A', author: 'A', tags: [], status: 'available', waitlist: [], checkoutCount: 0 }
      ]);
      if (key === 'members') return JSON.stringify([
        { id: 1001, firstName: 'John', lastName: 'Doe' }
      ]);
      return null;
    });

    let resultRef = null;
    render(
      <LibraryProvider>
        <Runner fn={({ lendBook }) => { resultRef = lendBook(1, 1001); }} />
      </LibraryProvider>
    );

    await waitFor(() => {
      if (!resultRef) throw new Error('not set');
      expect(resultRef.ok).toBe(true);
      expect(resultRef.action).toBe('lent');
    });
  });

  test('lending when already loaned -> waitlist', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 2, title: 'Book B', author: 'B', tags: [], status: 'loaned', loanedTo: 2000, waitlist: [], checkoutCount: 1 }
      ]);
      if (key === 'members') return JSON.stringify([
        { id: 3000, firstName: 'Alice', lastName: 'A' }
      ]);
      return null;
    });

    let resultRef = null;
    render(
      <LibraryProvider>
        <Runner fn={({ lendBook }) => { resultRef = lendBook(2, 3000); }} />
      </LibraryProvider>
    );

    await waitFor(() => {
      if (!resultRef) throw new Error('not set');
      expect(resultRef.ok).toBe(true);
      expect(resultRef.action).toBe('waitlisted');
    });
  });

  test('member already on waitlist -> error', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 3, title: 'Book C', author: 'C', tags: [], status: 'loaned', loanedTo: 4000, waitlist: [5000], checkoutCount: 1 }
      ]);
      if (key === 'members') return JSON.stringify([
        { id: 5000, firstName: 'Bob', lastName: 'B' }
      ]);
      return null;
    });

    let resultRef = null;
    render(
      <LibraryProvider>
        <Runner fn={({ lendBook }) => { resultRef = lendBook(3, 5000); }} />
      </LibraryProvider>
    );

    await waitFor(() => {
      if (!resultRef) throw new Error('not set');
      expect(resultRef.ok).toBe(false);
      expect(resultRef.reason).toMatch(/waitlist/i);
    });
  });

  test('invalid member/book IDs -> error', async () => {
    // case A: valid member but invalid book -> book not found
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 10, title: 'Book X', author: 'X', tags: [], status: 'available', waitlist: [], checkoutCount: 0 }
      ]);
      if (key === 'members') return JSON.stringify([
        { id: 1, firstName: 'Test', lastName: 'User' }
      ]);
      return null;
    });

    let resA = null;
    render(
      <LibraryProvider>
        <Runner fn={({ lendBook }) => { resA = lendBook(9999, 1); }} />
      </LibraryProvider>
    );

    await waitFor(() => {
      if (!resA) throw new Error('not set');
      expect(resA.ok).toBe(false);
      expect(resA.reason).toMatch(/book not found/i);
    });

    // case B: valid book but invalid member -> member not found
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'books') return JSON.stringify([
        { id: 10, title: 'Book X', author: 'X', tags: [], status: 'available', waitlist: [], checkoutCount: 0 }
      ]);
      if (key === 'members') return JSON.stringify([]);
      return null;
    });

    let resB = null;
    render(
      <LibraryProvider>
        <Runner fn={({ lendBook }) => { resB = lendBook(10, 1); }} />
      </LibraryProvider>
    );

    await waitFor(() => {
      if (!resB) throw new Error('not set');
      expect(resB.ok).toBe(false);
      expect(resB.reason).toMatch(/member not found/i);
    });
  });
});
