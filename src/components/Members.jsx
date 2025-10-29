import { useLibrary } from '../context/LibraryContext';
import AddMember from './forms/AddMember';

const Members = () => {
  const { members, books } = useLibrary();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>
      <AddMember />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(member => {
          const activeLoans = books.filter(book => book.loanedTo === member.id);
          return (
            <div key={member.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-bold">{member.firstName} {member.lastName}</h2>
              <h3 className="font-semibold">Active Loans:</h3>
              <ul className="list-disc list-inside">
                {activeLoans.map(book => (
                  <li key={book.id}>{book.title} - Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Members;