import { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Select, MenuItem } from '@mui/material';

// Mock data for requests and restaurants
const mockRequests = [
  { id: 1, user: 'Alice', type: 'Reservation', place: 'Pizza Place', status: 'Pending' },
  { id: 2, user: 'Bob', type: 'Pickup', place: 'Cafe Central', status: 'Pending' },
];
const mockRestaurants = [
  { id: 1, name: 'Pizza Place' },
  { id: 2, name: 'Sushi World' },
];

export default function AdminPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [openAddManager, setOpenAddManager] = useState(false);
  const [managerEmail, setManagerEmail] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [message, setMessage] = useState('');

  const handleApprove = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleReject = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    setMessage(`User ${managerEmail} set as manager for ${restaurants.find(r => r.id === selectedRestaurant)?.name || ''}`);
    setOpenAddManager(false);
    setManagerEmail('');
    setSelectedRestaurant('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      {/* Review Requests */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" gutterBottom>Review Requests</Typography>
        <List>
          {requests.length === 0 && <ListItem><ListItemText primary="No requests." /></ListItem>}
          {requests.map(req => (
            <ListItem key={req.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ListItemText
                primary={`${req.user} - ${req.type} at ${req.place}`}
                secondary={`Status: ${req.status}`}
              />
              {req.status === 'Pending' && (
                <>
                  <Button variant="contained" color="success" onClick={() => handleApprove(req.id)}>Approve</Button>
                  <Button variant="contained" color="error" onClick={() => handleReject(req.id)}>Reject</Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Manage Restaurants */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" gutterBottom>Manage Restaurants</Typography>
        <List>
          {restaurants.length === 0 && <ListItem><ListItemText primary="No restaurants." /></ListItem>}
          {restaurants.map(r => (
            <ListItem key={r.id}>
              <ListItemText primary={r.name} />
              {/* Add more management actions here */}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Add Store Manager */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => setOpenAddManager(true)}>
          Add Store Manager
        </Button>
      </Box>
      <Dialog open={openAddManager} onClose={() => setOpenAddManager(false)}>
        <DialogTitle>Add Store Manager</DialogTitle>
        <form onSubmit={handleAddManager}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="User Email"
              value={managerEmail}
              onChange={e => setManagerEmail(e.target.value)}
              fullWidth
              required
            />
            <Select
              value={selectedRestaurant}
              onChange={e => setSelectedRestaurant(e.target.value)}
              displayEmpty
              fullWidth
              required
            >
              <MenuItem value="" disabled>Select Restaurant</MenuItem>
              {restaurants.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddManager(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Manager
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {message && (
        <Typography color="success.main" sx={{ mt: 3, textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
}