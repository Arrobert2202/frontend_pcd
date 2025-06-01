import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function ProfilePage() {
  // Mock user data (replace with real user data from API)
  const [name, setName] = useState('John Doe');
  const [email] = useState('john@example.com');
  const [profilePic, setProfilePic] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setMessage('Profile updated!');
    // Here you would send updated data to the server
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!password || !newPassword || newPassword !== confirmPassword) {
      setMessage('Passwords do not match or fields are empty.');
      return;
    }
    setMessage('Password changed!');
    setOpenPasswordModal(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    // Here you would send password change request to the server
  };

  return (
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
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
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
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Button variant="contained" color="secondary" onClick={() => setOpenPasswordModal(true)}>
          Change Password
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
        <Typography color="success.main" sx={{ mt: 3, textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
}