import { useLibrary } from '../context/LibraryContext';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import AddMember from './forms/AddMember';

const Members = () => {
  const { members, books } = useLibrary();

  return (
    <div>
      <Typography variant="h4" gutterBottom>Members</Typography>
      <AddMember />
      <Grid container spacing={2}>
        {members.map(member => {
          const activeLoans = books.filter(book => book.loanedTo === member.id);
          return (
            <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{member.firstName} {member.lastName}</Typography>
                  <Typography variant="subtitle1">Active Loans:</Typography>
                  <List dense>
                    {activeLoans.map(book => (
                      <ListItem key={book.id}>
                        <ListItemText primary={book.title} secondary={`Due: ${book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Members;