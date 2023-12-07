import React from "react";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DataCollectionIcon from '../assests/exploration.png';
import 'fontsource-roboto';

function Nav(){
    return(
        <div><AppBar position="static"  sx={{ height: 55 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2,marginRight: 0  }}
          >
            <img
              src={DataCollectionIcon}
              alt="Data Collection Icon"
              style={{ width: 40, height: 40 }}
            />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', color: '#fff' }}>
            DataGlimpse
          </Typography>
        </Toolbar>
      </AppBar>

        </div>

    )
}
export default Nav;