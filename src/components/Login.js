import React from 'react';
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
import { Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import {auth,provider} from '../config/config';
import {signInWithPopup} from 'firebase/auth';



const defaultTheme = createTheme();

function Login() {
  const [email,setEmail]=React.useState("")
  const [password,setPassword]=React.useState("")
  const [loginstatus, setLoignstatus]=React.useState(true)
  const navigate=useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response =  axios.post('http://localhost:5000/api/authenticate', loginData);

      if (response.message = "ok") {
        alert('Authentication successful');
        navigate('/upload', { state: { email: loginData.email } });
      } else {
        console.error('Authentication failed');  
      }
    } catch (error) {
      console.error('Error during authentication:', error.message);
    }
  };  
  const handleGoogleLogin = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const email = user.email;

      // Check if the user exists in the backend
      const response = await axios.post('http://localhost:5000/api/google-login', {
        email,
      });

      if (response.status === 200) {
        alert('Login successful');
        // Navigate to the home page or other route
        navigate('/upload', { state: { email: email } });
      } else {
        alert('User not found');
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during Google login:', error.message);
    }
  };
  return (
  <div>
    <Box>
      <Nav/>
      <div className="background-image"></div>
    
  </Box>
  <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Login 
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              Login 
            </Button>
            <Divider>Or</Divider>
            <Grid container justifyContent="center">
            <Grid item>
            <Button
        onClick={handleGoogleLogin}
 
        
        startIcon={<GoogleIcon />}
        sx={{ mt: 3, mb: 2, backgroundColor: '#4285F4', color: '#fff','&:hover': {
          backgroundColor: '#4285F4'}}} // Adjust styles as needed
      >
        Sign-in with Google
      </Button>
      </Grid>
      </Grid>
      <Grid container>
              <Grid item xs>
                <Link href="/forgotpass" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  </div>
  )
}

export default Login