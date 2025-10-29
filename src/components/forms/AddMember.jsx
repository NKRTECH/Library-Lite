import { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';

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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Add Member</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Member</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMember;