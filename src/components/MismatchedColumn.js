import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Chip, Typography, Grid, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MismatchedColumn = ({ mismatchedColumn,number }) => {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };
  return (
    <Grid item xs={12} style={{marginBottom:'10px'}}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" style={{boxShadow: '0 4px 8px rgba(0.1, 0.1, 0.1, 0.2)'}}>
          <Typography variant="h6">Mismatched Columns : {number}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper style={{ padding: '10px' }}>
            {mismatchedColumn.map((column, index) => (
              <Chip  variant="outlined" 
                key={index}
                label={column}
                style={{
                  margin: '5px',
                  // backgroundColor: '#FF5733', // Custom background color
                  // color: '#FFF', // Custom text color
                  // fontWeight: 'bold', // Custom font weight
                }}
              />
            ))}
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default MismatchedColumn;
