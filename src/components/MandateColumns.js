import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


const MandateColumns = ({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
        
            <ArrowRightIcon/>
            
         
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
};

export default MandateColumns;
