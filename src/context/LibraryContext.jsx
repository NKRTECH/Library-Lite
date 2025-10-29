import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext); // eslint-disable-line react-refresh/only-export-components

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('books');
    const parsed = saved ? JSON.parse(saved) : [];
    // Remove duplicates based on ID
    const uniqueBooks = parsed.filter((book, index, arr) => 
      arr.findIndex(b => b.id === book.id) === index
    );
    return uniqueBooks;
  });
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('members');
    const parsed = saved ? JSON.parse(saved) : [];
    // Remove duplicates based on ID
    const uniqueMembers = parsed.filter((member, index, arr) => 
      arr.findIndex(m => m.id === member.id) === index
    );
    return uniqueMembers;
  });

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  const addBook = (book) => {
    if (books.some(b => b.title.toLowerCase() === book.title.toLowerCase())) {
      throw new Error('Book with this title already exists');
    }
    // create a stable integer id (Date.now() plus a small random offset)
    const newBook = { ...book, id: Date.now() * 1000 + Math.floor(Math.random() * 1000), status: 'available', loanedTo: null, dueDate: null, waitlist: [], checkoutCount: 0 };
    setBooks(prev => [...prev, newBook]);
  };

  const addMember = (member) => {
    const newMember = { ...member, id: Date.now() * 1000 + Math.floor(Math.random() * 1000) };
    setMembers(prev => [...prev, newMember]);
  };

  const lendBook = (bookId, memberId) => {
    // Validate member exists before lending/adding to waitlist
    const memberExists = members.some(m => m.id === memberId);
    if (!memberExists) return { ok: false, reason: 'Member not found' };

    const book = books.find(b => b.id === bookId);
    if (!book) return { ok: false, reason: 'Book not found' };

    if (book.status === 'available') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const updatedBook = { ...book, status: 'loaned', loanedTo: memberId, dueDate: dueDate.toISOString(), checkoutCount: book.checkoutCount + 1 };
      setBooks(prev => prev.map(b => (b.id === bookId ? updatedBook : b)));
      return { ok: true, action: 'lent', book: updatedBook };
    }

    // Book is already loaned
    if (book.loanedTo === memberId) {
      return { ok: false, reason: 'Member already has this book' };
    }
    if (book.waitlist.includes(memberId)) {
      return { ok: false, reason: 'Member already on waitlist' };
    }

    // add to waitlist
    setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, waitlist: [...b.waitlist, memberId] } : b)));
    return { ok: true, action: 'waitlisted' };
  };

  const returnBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return { ok: false, reason: 'Book not found' };

    if (book.waitlist.length > 0) {
      // promote the next existing member in FIFO order, skipping any stale ids
      const remaining = [...book.waitlist];
      let nextMember;
      let consumed = 0;
      while (remaining.length > 0) {
        const candidate = remaining.shift();
        consumed++;
        if (members.some(m => m.id === candidate)) {
          nextMember = candidate;
          break;
        }
      }
      if (nextMember !== undefined) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        const updatedBook = { ...book, status: 'loaned', loanedTo: nextMember, dueDate: dueDate.toISOString(), waitlist: book.waitlist.slice(book.waitlist.findIndex(id => id === nextMember) + 1), checkoutCount: book.checkoutCount + 1 };
        setBooks(prev => prev.map(b => (b.id === bookId ? updatedBook : b)));
        return { ok: true, action: 'promoted', toMember: nextMember, book: updatedBook };
      }
      // no valid next member found, clear waitlist and make available
      const updatedBook = { ...book, status: 'available', loanedTo: null, dueDate: null, waitlist: [] };
      setBooks(prev => prev.map(b => (b.id === bookId ? updatedBook : b)));
      return { ok: true, action: 'returned' };
    }

    // no waitlist — mark available
    const updatedBook = { ...book, status: 'available', loanedTo: null, dueDate: null };
    setBooks(prev => prev.map(b => (b.id === bookId ? updatedBook : b)));
    return { ok: true, action: 'returned' };
  };

  const clearPopulatedBooks = () => {
    setBooks(prev => prev.filter(b => b.source !== 'google-populate'));
  };

  return (
    <LibraryContext.Provider value={{ books, members, addBook, addMember, lendBook, returnBook, clearPopulatedBooks }}>
      {children}
    </LibraryContext.Provider>
  );
};