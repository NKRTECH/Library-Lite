import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';

const AddMember = () => {
  const { addMember } = useLibrary();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError('Both first and last name are required');
      return;
    }
    addMember({ firstName, lastName });
    setFirstName('');
    setLastName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Add Member</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Member</button>
    </form>
  );
};

export default AddMember;