import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { getBackendUrl } from '../utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${getBackendUrl()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      console.log('Login successful, token:', data.token);
      localStorage.setItem('token', data.token);
      console.log('Saved token:', localStorage.getItem('token'));
      if (data.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } catch (err) {
      console.error('JWT decode error:', err);
      setError('Login failed');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && (
            <Typography color="error" align="center" style={{ marginBottom: 8 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            type="submit"
          >
            Login
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link href="/register" passHref legacyBehavior>
              <Button variant="text" color="primary">Create account</Button>
            </Link>
          </Box>
        </form>
      </Container>
    </Box>
  );
}