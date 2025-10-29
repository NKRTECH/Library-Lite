import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Catalog from './components/Catalog';
import Members from './components/Members';
import Reports from './components/Reports';

function App() {
  return (
    <LibraryProvider>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/catalog">Catalog</Button>
            <Button color="inherit" component={Link} to="/members">Members</Button>
            <Button color="inherit" component={Link} to="/reports">Reports</Button>
            <ClearPopulatedButton />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/members" element={<Members />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Catalog />} />
          </Routes>
        </Container>
      </Router>
    </LibraryProvider>
  );
}

export default App;

// small helper component placed below default export so it's inside the provider at runtime
function ClearPopulatedButton() {
  // import hook lazily from the same module to avoid hoisting issues
  const { clearPopulatedBooks } = useLibrary();
  const [open, setOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleConfirm = () => {
    clearPopulatedBooks();
    setOpen(false);
    setSnackbar({ open: true, message: 'Populated books cleared', severity: 'success' });
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <>
      <Button color="inherit" onClick={openDialog} sx={{ ml: 2 }}>
        Clear populated
      </Button>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Remove populated books?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove all books added via Populate Books? This will delete those entries from localStorage.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleConfirm} color="error">Remove</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
