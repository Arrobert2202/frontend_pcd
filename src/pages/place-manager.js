import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, FormControl, InputLabel, MenuItem, Select, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { getBackendUrl } from '../utils/api';

export default function PlaceManagerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [place, setPlace] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editPlace, setEditPlace] = useState(false);
  const [placeForm, setPlaceForm] = useState({});
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [menuForm, setMenuForm] = useState({ id: null, name: '', price: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    fetch(`${getBackendUrl()}/restaurant/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => {
        setPlace(data);
        setPlaceForm(data);
      });
    fetch(`${getBackendUrl()}/restaurant/${id}/menu`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setMenu);
    fetch(`${getBackendUrl()}/restaurant/${id}/reservations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setReservations);
  }, [id]);

  const handleEditPlace = () => {
    setPlaceForm(place);
    setEditPlace(true);
  };
  const handleSavePlace = async () => {
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    const res = await fetch(`${getBackendUrl()}/restaurant/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(placeForm)
    });
    if (res.ok) {
      setPlace(placeForm);
      setEditPlace(false);
      setMessage('Venue updated!');
    } else {
      setError('Could not update venue.');
    }
  };

  const handleMenuDialogOpen = (item = { id: null, name: '', price: '' }) => {
    setMenuForm(item);
    setOpenMenuDialog(true);
  };
  const handleMenuDialogSave = async () => {
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    if (menuForm.id) {
      const res = await fetch(`${getBackendUrl()}/menu/${menuForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(menuForm)
      });
      if (!res.ok) setError('Could not update menu item.');
    } else {
      const res = await fetch(`${getBackendUrl()}/restaurant/${id}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(menuForm)
      });
      if (!res.ok) setError('Could not add menu item.');
    }
    fetch(`${getBackendUrl()}/restaurant/${id}/menu`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setMenu);
    setOpenMenuDialog(false);
    setMenuForm({ id: null, name: '', price: '' });
  };
  const handleMenuDelete = async (menuId) => {
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    const res = await fetch(`${getBackendUrl()}/menu/${menuId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) setError('Could not delete menu item.');
    fetch(`${getBackendUrl()}/restaurant/${id}/menu`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setMenu);
  };

  const handleReservationStatus = async (resId, status) => {
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    await fetch(`${getBackendUrl()}/reservation/${resId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetch(`${getBackendUrl()}/restaurant/${id}/reservations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setReservations);
  };

  if (!place) return <Container sx={{ mt: 8 }}><Typography>Loading...</Typography></Container>;

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Manage Venue</Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={place.image}
              alt={place.name}
              sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5">{place.name}</Typography>
              <Typography variant="body2">{place.description}</Typography>
              <Typography variant="body2">Address: {place.address}</Typography>
              <Typography variant="body2">Phone: {place.phone}</Typography>
            </Box>
            <IconButton onClick={handleEditPlace}><EditIcon /></IconButton>
          </Box>
        </Box>
        <Dialog open={editPlace} onClose={() => setEditPlace(false)}>
          <DialogTitle>Edit Venue Details</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" value={placeForm.name || ''} onChange={e => setPlaceForm(f => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Description" value={placeForm.description || ''} onChange={e => setPlaceForm(f => ({ ...f, description: e.target.value }))} fullWidth />
            <TextField label="Address" value={placeForm.address || ''} onChange={e => setPlaceForm(f => ({ ...f, address: e.target.value }))} fullWidth />
            <TextField label="Phone" value={placeForm.phone || ''} onChange={e => setPlaceForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditPlace(false)}>Cancel</Button>
            <Button onClick={handleSavePlace} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Menu</Typography>
            <Button variant="outlined" onClick={() => handleMenuDialogOpen()}>Add Item</Button>
          </Box>
          <List>
            {menu.length === 0 && <ListItem><ListItemText primary="No menu items." /></ListItem>}
            {menu.map(item => (
              <ListItem key={item.id} secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleMenuDialogOpen(item)}><EditIcon /></IconButton>
                  <IconButton edge="end" onClick={() => handleMenuDelete(item.id)}><DeleteIcon /></IconButton>
                </>
              }>
                <ListItemText primary={item.name} secondary={`Price: ${item.price} RON`} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Dialog open={openMenuDialog} onClose={() => setOpenMenuDialog(false)}>
          <DialogTitle>{menuForm.id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" value={menuForm.name} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Price" type="number" value={menuForm.price} onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMenuDialog(false)}>Cancel</Button>
            <Button onClick={handleMenuDialogSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Pending Reservations</Typography>
          <List>
            {reservations.filter(r => r.status === 'Pending').length === 0 && (
              <ListItem><ListItemText primary="No pending reservations." /></ListItem>
            )}
            {reservations.filter(r => r.status === 'Pending').map(r => (
              <ListItem key={r.id} secondaryAction={
                <>
                  <Button color="success" onClick={() => handleReservationStatus(r.id, 'Approved')}>Approve</Button>
                  <Button color="error" onClick={() => handleReservationStatus(r.id, 'Rejected')}>Reject</Button>
                </>
              }>
                <ListItemText
                  primary={`${r.user} - ${r.date} (${r.people} people)`}
                  secondary={`Status: ${r.status}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Reservation History</Typography>
          <List>
            {reservations.filter(r => r.status !== 'Pending').length === 0 && (
              <ListItem><ListItemText primary="No reservation history." /></ListItem>
            )}
            {reservations.filter(r => r.status !== 'Pending').map(r => (
              <ListItem key={r.id}>
                <ListItemText
                  primary={`${r.user} - ${r.date} (${r.people} people)`}
                  secondary={`Status: ${r.status}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </>
  );
}