import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        
        <form noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            label="Full name"
            variant="outlined"
            type="text"
            />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            type="text"
            />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            type="email"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone number"
            variant="outlined"
            type="tel"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            variant="outlined"
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={() => router.push('/home')}
          >
            Register
          </Button>
        </form>
      </Container>
    </Box>
  );
}