import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { getBackendUrl } from '../utils/api';

export default function CreateRestaurantForm() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    image_url: '',
    open_time: '',
    close_time: '',
    cuisine: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a restaurant.');
      return;
    }
    try {
      const res = await fetch(`${getBackendUrl()}/restaurant-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Request sent! An admin will review your restaurant.');
        setForm({
          name: '',
          description: '',
          address: '',
          phone: '',
          image_url: '',
          open_time: '',
          close_time: '',
          cuisine: ''
        });
        setTimeout(() => {
          router.push('/home');
        }, 1200);
      } else {
        setError(data.error || 'Error sending request');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) return null;

  if (!isLoggedIn) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Alert severity="warning">You must be logged in to create a restaurant.</Alert>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xs" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom align="center">Create Restaurant</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            border: '1px solid #eee',
            maxHeight: 500,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 6,
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#e0e0e0',
              borderRadius: 3
            },
          }}
        >
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
          <TextField label="Address" name="address" value={form.address} onChange={handleChange} />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <TextField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />
          <TextField label="Open Time" name="open_time" value={form.open_time} onChange={handleChange} placeholder="08:00" />
          <TextField label="Close Time" name="close_time" value={form.close_time} onChange={handleChange} placeholder="22:00" />
          <FormControl fullWidth required>
            <InputLabel id="cuisine-label">Cuisine</InputLabel>
            <Select
              labelId="cuisine-label"
              name="cuisine"
              value={form.cuisine}
              label="Cuisine"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select cuisine</em></MenuItem>
              <MenuItem value="Italian">Italian</MenuItem>
              <MenuItem value="Pizza">Pizza</MenuItem>
              <MenuItem value="Sushi">Sushi</MenuItem>
              <MenuItem value="Burger">Burger</MenuItem>
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">Create</Button>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Container>
    </>
  );
}