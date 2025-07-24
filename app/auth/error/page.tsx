"use client";
import { useSearchParams } from 'next/navigation';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please check your environment variables.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Authentication Error
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {getErrorMessage(error)}
          </Typography>

          <Link href="/login" passHref>
            <Button variant="contained" size="large">
              Back to Login
            </Button>
          </Link>
        </Paper>
      </Box>
    </Container>
  );
} 