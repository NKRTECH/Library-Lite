import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';

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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Add Book</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Book</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBook;