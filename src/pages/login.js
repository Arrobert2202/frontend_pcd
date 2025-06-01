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
          Login
        </Typography>
        
        <form noValidate autoComplete="off">
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
            label="Password"
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
            Login
          </Button>
        </form>
      </Container>
    </Box>
  );
}