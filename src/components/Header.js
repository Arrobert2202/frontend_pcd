import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <AppBar position="static" color="default" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
          onClick={() => router.push('/home')}
        >
          RestaurantApp
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => router.push('/home')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push('/profile')}>
            Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}