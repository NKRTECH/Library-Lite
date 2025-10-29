import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Card, CardContent, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

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
          tags: [genre],
          // mark as populated so users can clear these later if desired
          source: 'google-populate'
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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Populate Books</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handlePopulate}
          disabled={loading}
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Loading...' : 'Populate Books'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PopulateBooks;