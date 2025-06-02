import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Select, MenuItem } from '@mui/material';
import Header from '../components/Header';

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [openAddManager, setOpenAddManager] = useState(false);
  const [managerEmail, setManagerEmail] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [message, setMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/restaurant-requests', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          setRequests([]);
          setMessage(data.error || 'Failed to load requests');
        }
      });

    fetch('http://localhost:3000/restaurant', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
        }
      });
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/restaurant-requests/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/restaurant-requests/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    }
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const token = localStorage.getItem('token');

    const usersRes = await fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = await usersRes.json();
    const user = users.find(u => u.email === managerEmail);

    if (!user) {
      setMessage('');
      setError('User not found!');
      return;
    }

    const res = await fetch('http://localhost:3000/restaurant/manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        user_uuid: user.id,
        restaurant_uuid: selectedRestaurant
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`User ${managerEmail} set as manager for ${restaurants.find(r => r.id === selectedRestaurant)?.name || ''}`);
      setError('');
      setOpenAddManager(false);
      setManagerEmail('');
      setSelectedRestaurant('');
    } else {
      setMessage('');
      setError(data.error || 'Could not add manager');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/restaurant/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setRestaurants(rests => rests.filter(r => r.id !== id));
    }
  };

  const handleDeleteClick = (id) => {
    setRestaurantToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/restaurant/${restaurantToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setRestaurants(rests => rests.filter(r => r.id !== restaurantToDelete));
    }
    setDeleteDialogOpen(false);
    setRestaurantToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setRestaurantToDelete(null);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Admin Panel</Typography>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom>Review Restaurant Creation Requests</Typography>
          <List sx={{ maxHeight: 260, overflowY: 'auto' }}>
            {requests.length === 0 && <ListItem><ListItemText primary="No requests." /></ListItem>}
            {requests.slice(0, 4).map(req => (
              <ListItem key={req.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ListItemText
                  primary={`${req.name} (by ${req.user_email || req.user_id})`}
                  secondary={`Status: ${req.status}`}
                />
                {req.status === 'pending' && (
                  <>
                    <Button variant="contained" color="success" onClick={() => handleApprove(req.id)}>Approve</Button>
                    <Button variant="contained" color="error" onClick={() => handleReject(req.id)}>Reject</Button>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom>Manage Restaurants</Typography>
          <List sx={{ maxHeight: 260, overflowY: 'auto' }}>
            {restaurants.length === 0 && <ListItem><ListItemText primary="No restaurants." /></ListItem>}
            {restaurants.slice(0, 4).map(r => (
              <ListItem key={r.id}>
                <ListItemText primary={r.name} />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteClick(r.id)}
                >
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Sigur vrei să ștergi acest restaurant? Această acțiune este ireversibilă.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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
    </>
  );
}