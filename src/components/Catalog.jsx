import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import AddBook from './forms/AddBook';
import PopulateBooks from './forms/PopulateBooks';

const Catalog = () => {
  const { books, lendBook, returnBook, members } = useLibrary();
  const [search, setSearch] = useState('');
  const [lendMember, setLendMember] = useState('');
  const [lendError, setLendError] = useState('');
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));

  const handleLend = (bookId) => {
    if (!lendMember) {
      setLendError('Please select a member');
      return;
    }
    lendBook(bookId, parseInt(lendMember));
    setLendMember('');
    setLendError('');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Catalog</h1>
      <AddBook />
      <PopulateBooks />
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold">{book.title}</h2>
            <p>by {book.author}</p>
            <p>Tags: {book.tags.join(', ')}</p>
            <p className={book.status === 'available' ? 'text-green-600' : 'text-red-600'}>Status: {book.status}</p>
            {book.status === 'available' && (
              <div>
                {lendError && <p className="text-red-500">{lendError}</p>}
                <select
                  value={lendMember}
                  onChange={e => setLendMember(e.target.value)}
                  className="border p-2 mr-2"
                >
                  <option value="">Select Member</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
                  ))}
                </select>
                <button onClick={() => handleLend(book.id)} className="bg-green-500 text-white px-4 py-2 rounded">Lend</button>
              </div>
            )}
            {book.status === 'loaned' && (
              <button onClick={() => returnBook(book.id)} className="bg-red-500 text-white px-4 py-2 rounded">Return</button>
            )}
            {book.waitlist.length > 0 && <p className="text-yellow-600">Waitlist: {book.waitlist.length}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;