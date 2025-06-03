import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { getBackendUrl } from '../utils/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [message, setMessage] = useState('');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [managerRestaurants, setManagerRestaurants] = useState([]);

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      router.push('/login');
    }
  }, [isLoggedIn, router, loading]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${getBackendUrl()}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setProfilePic(data.profile_picture || '');
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${getBackendUrl()}/manager/restaurants`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setManagerRestaurants(data || []));
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${getBackendUrl()}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          profile_picture: profilePic
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Update failed');
        return;
      }
      setMessage('Profile updated!');
    } catch {
      setMessage('Update failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!password || !newPassword || newPassword !== confirmPassword) {
      setMessage('Passwords do not match or fields are empty.');
      return;
    }
    try {
      const res = await fetch(`${getBackendUrl()}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          oldPassword: password,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Password change failed');
        return;
      }
      setMessage('Password changed!');
      setOpenPasswordModal(false);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage('Password change failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">You must be logged in to view this page.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Profile</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profilePic}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Button variant="outlined" component="label">
            Change Profile Picture
            <input type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
          </Button>
          <TextField
            label="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            disabled
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => setOpenPasswordModal(true)}>
            Change Password
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <form onSubmit={handleChangePassword}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Current Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="secondary">
                Change Password
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {message && (
          <Typography color={message.includes('fail') ? 'error' : 'success.main'} sx={{ mt: 3, textAlign: 'center' }}>
            {message}
          </Typography>
        )}
        {managerRestaurants.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Restaurants you manage:
            </Typography>
            <List>
              {managerRestaurants.map(r => (
                <ListItem
                  key={r.id}
                  button
                  onClick={() => router.push(`/place-manager?id=${r.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText primary={r.name} secondary={r.address} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Container>
    </>
  );
}