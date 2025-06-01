import { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, Divider, MenuItem, Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data
const mockPlace = {
  name: 'Pizza Place',
  description: 'Best pizza in town!',
  address: '123 Main St',
  phone: '0712345678',
  image: '/images/pizza.jpg'
};
const mockMenu = [
  { id: 1, name: 'Margherita Pizza', price: 32 },
  { id: 2, name: 'Pepperoni Pizza', price: 36 },
];
const mockReservations = [
  { id: 1, user: 'Alice', date: '2025-06-01 19:00', people: 2, status: 'Pending' },
  { id: 2, user: 'Bob', date: '2025-06-02 20:00', people: 4, status: 'Approved' },
  { id: 3, user: 'John', date: '2025-05-30 18:00', people: 3, status: 'Rejected' },
];

export default function PlaceManagerPage() {
  const [place, setPlace] = useState(mockPlace);
  const [editPlace, setEditPlace] = useState(false);
  const [placeForm, setPlaceForm] = useState(place);
  const [menu, setMenu] = useState(mockMenu);
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [menuForm, setMenuForm] = useState({ id: null, name: '', price: '' });
  const [reservations, setReservations] = useState(mockReservations);

  const handleEditPlace = () => {
    setPlaceForm(place);
    setEditPlace(true);
  };
  const handleSavePlace = () => {
    setPlace(placeForm);
    setEditPlace(false);
  };

  const handleMenuDialogOpen = (item = { id: null, name: '', price: '' }) => {
    setMenuForm(item);
    setOpenMenuDialog(true);
  };
  const handleMenuDialogSave = () => {
    if (menuForm.id) {
      setMenu(menu.map(m => m.id === menuForm.id ? menuForm : m));
    } else {
      setMenu([...menu, { ...menuForm, id: Date.now() }]);
    }
    setOpenMenuDialog(false);
    setMenuForm({ id: null, name: '', price: '' });
  };
  const handleMenuDelete = (id) => {
    setMenu(menu.filter(m => m.id !== id));
  };

  const handleReservationStatus = (id, status) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Manage Venue</Typography>
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
          <TextField label="Name" value={placeForm.name} onChange={e => setPlaceForm(f => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField label="Description" value={placeForm.description} onChange={e => setPlaceForm(f => ({ ...f, description: e.target.value }))} fullWidth />
          <TextField label="Address" value={placeForm.address} onChange={e => setPlaceForm(f => ({ ...f, address: e.target.value }))} fullWidth />
          <TextField label="Phone" value={placeForm.phone} onChange={e => setPlaceForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
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
  );
}