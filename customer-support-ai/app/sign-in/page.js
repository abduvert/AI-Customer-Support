"use client";
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, Link } from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { auth, googleProvider, githubProvider } from '../../firebase';
import NavBar from '../Components/NavBar';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sign in successful!");
      window.location.href = '/Chatbot';
    } catch (error) {
      console.error("Error signing in with email:", error);
      switch (error.code) {
        case 'auth/user-not-found':
          alert("No account found with this email. Please sign up first.");
          break;
        case 'auth/wrong-password':
          alert("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          alert("Invalid email address. Please try again.");
          break;
        case 'auth/network-request-failed':
          alert("Network error. Please try again.");
          break;
        case 'auth/invalid-credential':
          alert("Invalid credentials. Please check your input and try again.");
          break;
        default:
          alert("Error signing in with email: ${error.message}");
      }
    }
    setLoading(false);
  };
  

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Sign in with Google successful!");
      window.location.href = '/Chatbot';
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert("Error signing in with Google. Please try again.");
    }
    setLoading(false);
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
      alert("Sign in with GitHub successful!");
      window.location.href = '/Chatbot';
    } catch (error) {
      console.error("Error signing in with GitHub:", error.message);
      alert("Error signing in with GitHub. Please try again.");
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <NavBar />
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ p: 2 }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="black">
          Sign In
        </Typography>
        <Stack spacing={2} mb={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleEmailSignIn}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </Button>
        <Stack spacing={2} mt={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon />}
          >
            Sign In with Google
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleGitHubSignIn}
            startIcon={<GitHubIcon />}
          >
            Sign In with GitHub
          </Button>
        </Stack>
        <Typography variant="body2" mt={2} align="center">
          Don&apos;t have an account?<Link href="/sign-up" underline="hover">Sign Up here</Link>
        </Typography>
      </Box>
    </Box>
    </React.Fragment>
  );
};

export default SignIn;