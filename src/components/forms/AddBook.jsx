import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';

const AddBook = () => {
  const { addBook } = useLibrary();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addBook({ title, author, tags: tags.split(',').map(t => t.trim()) });
      setTitle('');
      setAuthor('');
      setTags('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Add Book</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Book</button>
    </form>
  );
};

export default AddBook;