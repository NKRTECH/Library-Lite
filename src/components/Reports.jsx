import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Typography, Card, CardContent, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';

const Reports = () => {
  const { books } = useLibrary();
  const [topN, setTopN] = useState(5);

  const overdue = books.filter(book => book.status === 'loaned' && new Date(book.dueDate) < new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const topBooks = books.sort((a, b) => b.checkoutCount - a.checkoutCount || a.title.localeCompare(b.title)).slice(0, topN);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Reports</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Overdue Loans</Typography>
          <List>
            {overdue.map(book => (
              <React.Fragment key={book.id}>
                <ListItem>
                  <ListItemText
                    primary={book.title}
                    secondary={`Due: ${new Date(book.dueDate).toLocaleDateString()} - Days Overdue: ${Math.floor((new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24))}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Top Books</Typography>
          <TextField
            label="Number of books"
            type="number"
            value={topN}
            onChange={e => setTopN(parseInt(e.target.value))}
            sx={{ mb: 2 }}
          />
          <List>
            {topBooks.map(book => (
              <React.Fragment key={book.id}>
                <ListItem>
                  <ListItemText
                    primary={book.title}
                    secondary={`Checkouts: ${book.checkoutCount}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;