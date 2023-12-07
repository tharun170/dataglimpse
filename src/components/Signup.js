import React, { useEffect,useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {auth,provider} from '../config/config';
import {signInWithPopup} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import Nav from './Nav';

const defaultTheme = createTheme();

function Signup() {
    const [email,setEmail]=React.useState("")
      const [password,setPassword]=React.useState("")
      const [username,setUsername]=React.useState("")
      const [loginstatus, setLoignstatus]=React.useState(true)
      const navigate =useNavigate();

      const handleSubmit = async (event) => {
        event.preventDefault();
        try{
        const registrationData = {
          username:username,
          email: email,
          password: password,
        };
        const response = await axios.post('http://localhost:5000/api/register', registrationData);
        if (response.message="ok") {
          alert('Registration successful');
          navigate('/');
          
        } else {
          console.error('Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error.message);
      }
      };

      const handleAuth = async () => {
        try {
          const { user } = await signInWithPopup(auth, provider);
          const email = user.email;
          const userName = user.displayName;
      
          // Check if the user already exists in the backend
          const response = await axios.post('http://localhost:5000/api/google-signup', {
            email,
            userName,
          });
      
          if (response.status === 200) {
            alert('Google sign-up successful');
            // Navigate to the home page or other route
            navigate('/home', { state: { email } });
          } else {
            alert("User already exists");
            console.error('Google sign-up failed');
          }
        } catch (error) {
          console.error('Error during Google sign-up:', error.message);
        }
      };
  return (
    <div>
    <Nav/>
    <div className="background-image"></div>
  <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign-Up 
          </Typography>
          {/* <Card sx={{ maxWidth: 400, margin: 'auto', boxShadow: 3 }}>
      <CardContent> */}
      
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1,alignItems: 'center',}}>
          <TextField
              margin="normal"
              
              fullWidth
              id="name"
              label="User Name"
              name="name"
              autoComplete="name"
              autoFocus
              onChange={(e)=>setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              
              onChange={(e)=>setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Register 
            </Button>
            <Divider>Or</Divider>
            <Grid container justifyContent="center">
            <Grid item>
            <Button
        onClick={handleAuth}
        startIcon={<GoogleIcon />}
        sx={{ mt: 3, mb: 2, backgroundColor: '#4285F4', color: '#fff','&:hover': {
          backgroundColor: '#4285F4'}}} // Adjust styles as needed
      >
        Sign-up with Google
      </Button>
      </Grid>
      </Grid>
          </Box>
          
        </Box>
      </Container>
    </ThemeProvider>
  </div>
  )
}

export default Signup;