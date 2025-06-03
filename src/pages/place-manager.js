import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, Alert
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
  const [reservations, setReservations] = useState([]); // All reservations
  const [pendingReservations, setPendingReservations] = useState([]); // Pending reservations
  const [reservationHistory, setReservationHistory] = useState([]); // Non-pending reservations
  const [editPlace, setEditPlace] = useState(false);
  const [placeForm, setPlaceForm] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');

    // Fetch place details
    fetch(`${getBackendUrl()}/restaurant/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setPlace(data);
        setPlaceForm(data);
      });

    // Fetch menu
    fetch(`${getBackendUrl()}/restaurant/${id}/menu`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setMenu);

    // Fetch reservations
    fetch(`${getBackendUrl()}/reservations/restaurant/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setPendingReservations(data.filter(r => r.status === 'pending')); // Filter pending reservations
        setReservationHistory(data.filter(r => r.status !== 'pending')); // Filter non-pending reservations
      });
  }, [id]);

  const handleReservationStatus = async (resId, status) => {
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    await fetch(`${getBackendUrl()}/reservation/${resId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ decision: status })
    });

    // Refresh reservations after status update
    fetch(`${getBackendUrl()}/reservations/restaurant/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setPendingReservations(data.filter(r => r.status === 'pending'));
        setReservationHistory(data.filter(r => r.status !== 'pending'));
      });
  };

  if (!place) return <Container sx={{ mt: 8 }}><Typography>Loading...</Typography></Container>;

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Manage Venue</Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Venue Details */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={place.image_url}
              alt={place.name}
              sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5">{place.name}</Typography>
              <Typography variant="body2">{place.description}</Typography>
              <Typography variant="body2">Address: {place.address}</Typography>
              <Typography variant="body2">Phone: {place.phone}</Typography>
            </Box>
            <IconButton onClick={() => setEditPlace(true)}><EditIcon /></IconButton>
          </Box>
        </Box>

        {/* Pending Reservations */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Pending Reservations</Typography>
          <List>
            {pendingReservations.length === 0 && (
              <ListItem><ListItemText primary="No pending reservations." /></ListItem>
            )}
            {pendingReservations.map(r => (
              <ListItem key={r.reservation_id} secondaryAction={
                <>
                  <Button color="success" onClick={() => handleReservationStatus(r.reservation_id, 'approved')}>Approve</Button>
                  <Button color="error" onClick={() => handleReservationStatus(r.reservation_id, 'declined')}>Reject</Button>
                </>
              }>
                <ListItemText
                  primary={`${r.reservation_date} (${r.nr_of_people} people)`}
                  secondary={`Status: ${r.status}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Reservation History */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Reservation History</Typography>
          <List>
            {reservationHistory.length === 0 && (
              <ListItem><ListItemText primary="No reservation history." /></ListItem>
            )}
            {reservationHistory.map(r => (
              <ListItem key={r.reservation_id}>
                <ListItemText
                  primary={`${r.reservation_date} (${r.nr_of_people} people)`}
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