import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText, ToggleButton, ToggleButtonGroup, Rating
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';

export default function PlacePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, loading } = useAuth();
  const [place, setPlace] = useState(null);
  const [menu, setMenu] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('reservation');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (loading || !isLoggedIn || !id) return;
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/restaurant', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(restaurants => {
        const found = restaurants.find(r => r.id === id);
        setPlace(found || null);
      });
    fetch(`http://localhost:3000/restaurant/${id}/menu`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMenu(data))
      .finally(() => setDataLoading(false));
  }, [id, isLoggedIn, loading]);

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

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>Restaurant not found.</div>;

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            component="img"
            src={place.image_url}
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
    </>
  );
}