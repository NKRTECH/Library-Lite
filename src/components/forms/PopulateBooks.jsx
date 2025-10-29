import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';

const PopulateBooks = () => {
  const { addBook } = useLibrary();
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePopulate = async () => {
    if (!genre) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=10`);
      const data = await response.json();
      data.items.forEach(item => {
        const book = {
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown',
          tags: [genre]
        };
        try {
          addBook(book);
        } catch (e) {
          // ignore duplicates
        }
      });
      setGenre('');
    } catch (err) {
      setError('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Populate Books</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={e => setGenre(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handlePopulate}
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Populate Books'}
      </button>
    </div>
  );
};

export default PopulateBooks;