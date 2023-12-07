import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Nav from './Nav';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import { Navigate, useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Set New Password
  const [newPassword, setNewPassword] = useState('');
  const [useremail, setUseremail]=useState('');
  const navigate=useNavigate();

  const handleStep1Submit = async (event) => {
    try {
      const response = await axios.post('http://localhost:5000/api/forgot_password_step1', { email });

      if (response.status === 200) {
        setUseremail(email);

        setEmail('')
        setStep(2);
        
      } else {
        alert('Please Enter Registered email!')
        console.error('Invalid email');
      }
    } catch (error) {
      console.error('Error during step 1:', error.message);
    }
  };
  const handleStep2Submit = async (event) => {
    console.log(useremail, newPassword)
    try {
      const response = await axios.post('http://localhost:5000/api/forgot_password_step2', { useremail, newPassword });
      if (response.status === 200) {
        alert("Password updated Successfully");
        navigate('/')
        console.log('Password updated successfully');
      } else {
        console.error('Password update failed');
      }
    } catch (error) {
      console.error('Error during step 2:', error.message);
    }
  };
  return (
    <div>
      <Nav/>
      <div className="background-image"></div>
      {step === 1 ? (
        // Step 1: Enter Email
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Card sx={{width:'50%'}}>
        <CardContent>
        <Container component="main" maxWidth="xs" sx={{}}>
        <InputLabel htmlFor="email" sx={{  fontSize: '16px' }}>
        Enter Registered E-mail Address:
      </InputLabel>
      <Box
        
        sx={{ mt: 1, alignItems: 'center', display: 'flex', flexDirection: 'row' }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <IconButton color="primary" aria-label="arrow forward" style={{ fontSize: '100' }} onClick={handleStep1Submit}>
          <ArrowForwardIcon  />
        </IconButton>
      </Box>
    </Container>
    </CardContent>
      </Card>
    </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Card sx={{width:'50%'}}>
        <CardContent>
        
       
        <Container component="main" maxWidth="xs">
        <InputLabel htmlFor="email" sx={{  fontSize: '16px' }}>
        Enter New Password:
      </InputLabel>
      <Box sx={{ mt: 1, alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Enter New Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
         <IconButton color="primary" aria-label="update password" style={{ fontSize: '24px' }} onClick={handleStep2Submit}>
      <SaveIcon />
    </IconButton>
      </Box>
    </Container>
    </CardContent>
      </Card>
    </div>
      )}
    </div>
  );
};

export default ForgotPassword;