import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profile_picture: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, profile_picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          profile_picture: form.profile_picture || null
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed');
        return;
      }
      router.push('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            variant="outlined"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            variant="outlined"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
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
            label="Phone number"
            variant="outlined"
            type="tel"
            name="phone"
            value={form.phone}
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
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            variant="outlined"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            style={{ marginTop: '10px', marginBottom: '10px' }}
          >
            Upload Profile Picture (optional)
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {error && (
            <Typography color="error" align="center" style={{ marginBottom: 8 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
            type="submit"
          >
            Register
          </Button>
        </form>
      </Container>
    </Box>
  );
}