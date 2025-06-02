import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (loading || !isLoggedIn) return;
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/restaurant', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPlaces(data))
      .catch(() => setPlaces([]));
  }, [isLoggedIn]);

  const filteredPlaces = places.filter(p =>
    (!type || p.type === type) &&
    (!cuisine || p.cuisine === cuisine) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2, pr: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push('/create-form')}
        >
          Request new restaurant
        </Button>
      </Box>
      <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '100px' }}>
        {!isLoggedIn ? (
          <>
            <Typography variant="h3" gutterBottom>Table Reservation & Pickup Orders</Typography>
            <Typography variant="h5" gutterBottom>
              Welcome! You can reserve a table, place a pickup order, or reserve a table and pre-order your meal.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => router.push('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>Restaurants & Cafes</Typography>
            {user && (
              <Typography variant="h6" sx={{ mb: 2 }}>
                Welcome, {user.first_name} {user.last_name}!
              </Typography>
            )}
            <Typography variant="body1" sx={{ mb: 2 }}>
              Filter the venues and choose: table reservation, pickup order, or reservation with pre-order for dine-in.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
              <TextField
                label="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={e => setType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Cafe">Cafe</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Cuisine</InputLabel>
                <Select
                  value={cuisine}
                  label="Cuisine"
                  onChange={e => setCuisine(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Italian">Italian</MenuItem>
                  <MenuItem value="Japanese">Japanese</MenuItem>
                  <MenuItem value="American">American</MenuItem>
                  <MenuItem value="Coffee">Coffee</MenuItem>
                  <MenuItem value="Tea">Tea</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {filteredPlaces.map(p => (
              <Box
                key={p.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 3 }
                }}
                onClick={() => router.push(`/place?id=${p.id}`)}
              >
                <Box
                  component="img"
                  src={p.image}
                  alt={p.name}
                  sx={{
                    width: 90,
                    height: 90,
                    objectFit: 'cover',
                    borderRadius: 2,
                    flexShrink: 0,
                    mr: 2
                  }}
                />
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: 'primary.main', textDecoration: 'underline', mb: 0.5 }}
                  >
                    {p.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>Type: {p.type}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>Cuisine: {p.cuisine}</Typography>
                  <Typography variant="body2">Rating: {p.rating}</Typography>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Container>
    </>
  );
}