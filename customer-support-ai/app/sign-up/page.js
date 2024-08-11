"use client";
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, Link } from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { auth, googleProvider, githubProvider } from '../../firebase';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { signInWithPopup } from 'firebase/auth';
import NavBar from '../Components/NavBar';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      alert("Email and Password cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(email, password);
      alert("Sign up successful!");
      window.location.href = '/Chatbot';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("Email already in use. Please try a different email.");
      } else if (error.code === 'auth/invalid-email') {
        alert("Invalid email. Please try a different email.");
      } else if (error.code === 'auth/weak-password') {
        alert("Password is too weak. Please try a stronger password.");
      } else {
        alert("Error signing up with email. Please try again.");
      }
      console.error("Error signing up with email:", error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Sign up with Google successful!");
      window.location.href = '/Chatbot';
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("Account already exists with a different credential. Please try a different account.");
      } else {
        alert("Error signing up with Google. Please try again.");
      }
      console.error("Error signing up with Google:", error.message);
    }
    setLoading(false);
  };

  const handleGitHubSignUp = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
      alert("Sign up with GitHub successful!");
      window.location.href = '/Chatbot';
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("Account already exists with a different credential. Please try a different account.");
      } else {
        alert("Error signing up with GitHub. Please try again.");
      }
      console.error("Error signing up with GitHub:", error.message);
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
            Sign Up
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
            onClick={handleEmailSignUp}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up with Email'}
          </Button>
          <Stack spacing={2} mt={2}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleGoogleSignUp}
              startIcon={<GoogleIcon />}
            >
              Sign Up with Google
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleGitHubSignUp}
              startIcon={<GitHubIcon />}
            >
              Sign Up with GitHub
            </Button>
          </Stack>
          <Typography variant="body2" mt={2} align="center">
            Already have an account? <Link href="/sign-in" underline="hover">Login here</Link>
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default SignUp;