import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import Catalog from './components/Catalog';
import Members from './components/Members';
import Reports from './components/Reports';

function App() {
  return (
    <LibraryProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex space-x-4">
              <Link to="/catalog" className="hover:underline">Catalog</Link>
              <Link to="/members" className="hover:underline">Members</Link>
              <Link to="/reports" className="hover:underline">Reports</Link>
            </div>
          </nav>
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/members" element={<Members />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/" element={<Catalog />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LibraryProvider>
  );
}

export default App;
