import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button,
  ButtonGroup
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import { getBackendUrl } from '../utils/api';

export default function RestaurantReservationsPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { restaurant_id } = router.query;

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (loading || !isLoggedIn || !restaurant_id) return;

    const token = localStorage.getItem('token');
    fetch(`${getBackendUrl()}/reservations/restaurant/${restaurant_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch reservations');
        }
        return res.json();
      })
      .then(data => {
        setReservations(data);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to load reservations');
      })
      .finally(() => setDataLoading(false));
  }, [restaurant_id, isLoggedIn, loading]);

  const handleDecision = async (reservationId, decision) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getBackendUrl()}/reservation/${reservationId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ decision })
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }

      // Update local state after successful API call
      setReservations(reservations.map(res => 
        res.reservation_id === reservationId 
          ? { ...res, status: decision }
          : res
      ));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update reservation status');
    }
  };

  if (loading || dataLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authorized</div>;

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Restaurant Reservations
        </Typography>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Additional Comments</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow
                  key={reservation.reservation_id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: reservation.status === 'approved' 
                      ? 'success.light' 
                      : reservation.status === 'declined' 
                        ? 'error.light' 
                        : 'inherit'
                  }}
                >
                  <TableCell>{reservation.reservation_date}</TableCell>
                  <TableCell>{reservation.reservation_time}</TableCell>
                  <TableCell>{reservation.nr_of_people}</TableCell>
                  <TableCell sx={{ 
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: reservation.status === 'approved' 
                      ? 'success.dark' 
                      : reservation.status === 'declined' 
                        ? 'error.dark' 
                        : 'warning.dark'
                  }}>
                    {reservation.status}
                  </TableCell>
                  <TableCell>{reservation.additional_comment || '-'}</TableCell>
                  <TableCell align="center">
                    {reservation.status === 'pending' && (
                      <ButtonGroup size="small">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleDecision(reservation.reservation_id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDecision(reservation.reservation_id, 'declined')}
                        >
                          Decline
                        </Button>
                      </ButtonGroup>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No reservations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}