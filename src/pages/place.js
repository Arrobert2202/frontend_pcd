import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, ToggleButton, ToggleButtonGroup, Rating
} from '@mui/material';

// Example mock data
const mockPlaces = {
  1: {
    name: 'Pizza Place',
    address: '123 Main St',
    phone: '0712345678',
    image: '/images/pizza.jpg',
    rating: 4.5,
    description: 'Best pizza in town!'
  },
  2: {
    name: 'Sushi World',
    address: '456 Ocean Ave',
    phone: '0723456789',
    image: '/images/sushi.jpg',
    rating: 4.7,
    description: 'Fresh sushi and rolls.'
  },
  // ...add for other ids
};
const mockMenus = {
  1: [
    { id: 1, name: 'Margherita Pizza', price: 32 },
    { id: 2, name: 'Pepperoni Pizza', price: 36 },
  ],
  2: [
    { id: 3, name: 'Salmon Sushi', price: 40 },
    { id: 4, name: 'Tuna Roll', price: 38 },
  ],
  // ...add for other ids
};

export default function PlacePage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  const place = mockPlaces[id] || {};
  const menu = mockMenus[id] || [];

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('reservation');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  const handleOrderChange = (itemId) => {
    setOrderItems(orderItems.includes(itemId)
      ? orderItems.filter(id => id !== itemId)
      : [...orderItems, itemId]
    );
  };

  const handleSubmit = () => {
    let msg = '';
    if (action === 'reservation') {
      msg = `Reservation for ${name} on ${date} for ${people} people.`;
    } else if (action === 'pickup') {
      msg = `Pickup order for ${name} on ${date}. Items: ${menu.filter(m => orderItems.includes(m.id)).map(m => m.name).join(', ')}`;
    } else if (action === 'reservation_preorder') {
      msg = `Reservation for ${name} on ${date} for ${people} people.\nPre-ordered: ${menu.filter(m => orderItems.includes(m.id)).map(m => m.name).join(', ')}`;
    }
    alert(msg);
    setOpen(false);
    setName('');
    setDate('');
    setPeople(1);
    setOrderItems([]);
    setAction('reservation');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Restaurant details */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          component="img"
          src={place.image}
          alt={place.name}
          sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 2 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">{place.name}</Typography>
          <Typography variant="body2">{place.description}</Typography>
          <Typography variant="body2">Address: {place.address}</Typography>
          <Typography variant="body2">Phone: {place.phone}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Rating value={place.rating || 0} precision={0.1} readOnly />
          <Typography variant="caption">{place.rating || '-'}/5</Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Menu
      </Typography>
      <List>
        {menu.length === 0 && <ListItem><ListItemText primary="No menu available." /></ListItem>}
        {menu.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} secondary={`Price: ${item.price} RON`} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Reserve / Order
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Reservation / Order</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ToggleButtonGroup
            color="primary"
            value={action}
            exclusive
            onChange={(_, value) => value && setAction(value)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="reservation">Reserve Table</ToggleButton>
            <ToggleButton value="pickup">Pickup Order</ToggleButton>
            <ToggleButton value="reservation_preorder">Reserve & Pre-order</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            label="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
          {(action === 'reservation' || action === 'reservation_preorder') && (
            <>
              <TextField
                label="Date & Time"
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Number of People"
                type="number"
                value={people}
                onChange={e => setPeople(Number(e.target.value))}
                inputProps={{ min: 1 }}
                fullWidth
              />
            </>
          )}
          {action === 'pickup' && (
            <TextField
              label="Pickup Date & Time"
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}
          {(action === 'pickup' || action === 'reservation_preorder') && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Select items to order:</Typography>
              {menu.map(item => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      checked={orderItems.includes(item.id)}
                      onChange={() => handleOrderChange(item.id)}
                    />
                  }
                  label={`${item.name} (${item.price} RON)`}
                />
              ))}
              {orderItems.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {menu.filter(m => orderItems.includes(m.id)).map(m => m.name).join(', ')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}