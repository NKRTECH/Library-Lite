import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const Reports = () => {
  const { books } = useLibrary();
  const [topN, setTopN] = useState(5);

  const overdue = books.filter(book => book.status === 'loaned' && new Date(book.dueDate) < new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const topBooks = books.sort((a, b) => b.checkoutCount - a.checkoutCount || a.title.localeCompare(b.title)).slice(0, topN);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Overdue Loans</h2>
        <ul className="space-y-2">
          {overdue.map(book => (
            <li key={book.id} className="border-b pb-2">
              {book.title} - Due: {new Date(book.dueDate).toLocaleDateString()} - Days Overdue: {Math.floor((new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24))}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Top Books</h2>
        <input
          type="number"
          value={topN}
          onChange={e => setTopN(parseInt(e.target.value))}
          className="border p-2 mb-2"
        />
        <ul className="space-y-2">
          {topBooks.map(book => (
            <li key={book.id} className="border-b pb-2">
              {book.title} - Checkouts: {book.checkoutCount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;