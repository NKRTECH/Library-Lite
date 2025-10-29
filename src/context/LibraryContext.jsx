import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext); // eslint-disable-line react-refresh/only-export-components

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('books');
    return saved ? JSON.parse(saved) : [];
  });
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('members');
    return saved ? JSON.parse(saved) : [];
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
    const newBook = { ...book, id: Date.now(), status: 'available', loanedTo: null, dueDate: null, waitlist: [], checkoutCount: 0 };
    setBooks(prev => [...prev, newBook]);
  };

  const addMember = (member) => {
    const newMember = { ...member, id: Date.now() };
    setMembers(prev => [...prev, newMember]);
  };

  const lendBook = (bookId, memberId) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        if (book.status === 'available') {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7);
          return { ...book, status: 'loaned', loanedTo: memberId, dueDate: dueDate.toISOString(), checkoutCount: book.checkoutCount + 1 };
        } else {
          if (!book.waitlist.includes(memberId)) {
            return { ...book, waitlist: [...book.waitlist, memberId] };
          }
        }
      }
      return book;
    }));
  };

  const returnBook = (bookId) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        if (book.waitlist.length > 0) {
          const nextMember = book.waitlist[0];
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7);
          console.log(`Book lent to ${members.find(m => m.id === nextMember)?.firstName} ${members.find(m => m.id === nextMember)?.lastName}`);
          return { ...book, status: 'loaned', loanedTo: nextMember, dueDate: dueDate.toISOString(), waitlist: book.waitlist.slice(1), checkoutCount: book.checkoutCount + 1 };
        } else {
          return { ...book, status: 'available', loanedTo: null, dueDate: null };
        }
      }
      return book;
    }));
  };

  return (
    <LibraryContext.Provider value={{ books, members, addBook, addMember, lendBook, returnBook }}>
      {children}
    </LibraryContext.Provider>
  );
};