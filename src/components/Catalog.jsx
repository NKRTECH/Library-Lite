import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Grid, Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import AddBook from './forms/AddBook';
import PopulateBooks from './forms/PopulateBooks';

const Catalog = () => {
  const { books, lendBook, returnBook, members } = useLibrary();
  const [search, setSearch] = useState('');
  // track selected member per-book so each card maintains its own selection
  const [lendMember, setLendMember] = useState({});
  // track lend errors per-book (kept for possible inline usage)
  const [lendError, setLendError] = useState({});
  // centralized snackbar for messages
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));

  const handleLend = (bookId) => {
    const selected = lendMember[bookId];
    if (!selected) {
      setSnackbar({ open: true, message: 'Please select a member', severity: 'error' });
      return;
    }
    const result = lendBook(bookId, Number(selected));
    if (!result || !result.ok) {
      setSnackbar({ open: true, message: result ? result.reason : 'Unknown error', severity: 'error' });
      return;
    }
    // success (lent or waitlisted) — show snackbar and clear selection
    setSnackbar({ open: true, message: result.action === 'lent' ? 'Book lent successfully' : 'Added to waitlist', severity: 'success' });
    setLendMember(prev => ({ ...prev, [bookId]: '' }));
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleReturnClick = (bookId) => {
    const result = returnBook(bookId);
    if (!result || !result.ok) {
      setSnackbar({ open: true, message: result ? result.reason : 'Unknown error', severity: 'error' });
      return;
    }
    if (result.action === 'promoted') {
      setSnackbar({ open: true, message: `Book auto-lent to member ${result.toMember}`, severity: 'info' });
    } else {
      setSnackbar({ open: true, message: 'Book returned and available', severity: 'success' });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Catalog</Typography>
      <AddBook />
      <PopulateBooks />
      <TextField
        label="Search by title"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Grid container spacing={2}>
        {filteredBooks.map(book => (
          <Grid key={book.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography>by {book.author}</Typography>
                <Typography>Tags: {book.tags.join(', ')}</Typography>
                <Typography color={book.status === 'available' ? 'success.main' : 'error.main'}>
                  Status: {book.status}
                </Typography>
                {book.status === 'available' && (
                  <div>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id={`select-member-label-${book.id}`}>Select Member</InputLabel>
                      <Select
                        labelId={`select-member-label-${book.id}`}
                        value={lendMember[book.id] || ''}
                        onChange={e => setLendMember(prev => ({ ...prev, [book.id]: e.target.value }))}
                      >
                        {members.map(member => (
                          <MenuItem key={member.id} value={member.id}>{member.firstName} {member.lastName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={() => handleLend(book.id)}>Lend</Button>
                  </div>
                )}
                {book.status === 'loaned' && (
                  <Button variant="contained" color="secondary" onClick={() => handleReturnClick(book.id)}>Return</Button>
                )}
                {book.waitlist.length > 0 && <Typography color="warning.main">Waitlist: {book.waitlist.length}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Catalog;