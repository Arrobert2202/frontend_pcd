import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useRouter } from 'next/router';

const mockPlaces = [
  { id: 1, name: 'Pizza Place', type: 'Restaurant', cuisine: 'Italian', rating: 4.5, image: '/images/pizza.jpg' },
  { id: 2, name: 'Sushi World', type: 'Restaurant', cuisine: 'Japanese', rating: 4.7, image: '/images/sushi.jpg' },
  { id: 3, name: 'Cafe Central', type: 'Cafe', cuisine: 'Coffee', rating: 4.8, image: '/images/cafe.jpg' },
  { id: 4, name: 'Burger House', type: 'Restaurant', cuisine: 'American', rating: 4.2, image: '/images/burger.jpg' },
  { id: 5, name: 'Tea Time', type: 'Cafe', cuisine: 'Tea', rating: 4.3, image: '/images/tea.jpg' },
];

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [places, setPlaces] = useState(mockPlaces);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const filteredPlaces = places.filter(p =>
    (!type || p.type === type) &&
    (!cuisine || p.cuisine === cuisine) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
              onClick={() => router.push(`/place/${p.id}`)}
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
  );
}