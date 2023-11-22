import React from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const NullRowsTable = ({ nullValueRows }) => {
  if (!nullValueRows || nullValueRows.length === 0) {
    return null; // If there are no null value rows, don't render the table
  }

  const columns = Object.keys(nullValueRows[0]);

  const splitHeaderWord = (word) => {
    const maxWidth = 100; // Adjust the maximum width as needed
    const words = word.split('_');
    let firstLine = '';
    let secondLine = '';
  
    for (const w of words) {
      if (firstLine.length + w.length < maxWidth) {
        firstLine += `${w} `;
      } else if (secondLine.length === 0) {
        // Display the excess word in the second line
        secondLine += `${w} `;
      } else {
        secondLine += `${w} `;
      }
    }
  
    return { firstLine: firstLine.trim(), secondLine: secondLine.trim() };
  };
  

  return (
    <Grid item xs={12}>
      <Divider style={{ fontSize: '24px' }}>Rows with Null Values </Divider>
      <Paper style={{ marginTop: '20px', width: '100%', overflowX: 'auto' }}>
        <TableContainer style={{ width: '100%' }}>
          <Table size="small" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow style={{ backgroundColor: '#3498db', color: '#fff' }}>
                {columns.map((colName) => {
                  const { firstLine, secondLine } = splitHeaderWord(colName);
                  return (
                    <TableCell
                      key={colName}
                      style={{
                        // fontWeight: 'bold',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        padding: '10px',
                        wordWrap: 'break-word', // Allow long words to be broken and wrap to the next line
                      }}
                    >
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {firstLine}
                      </div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {secondLine}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {nullValueRows.map((row, index) => (
                <TableRow key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  {columns.map((colName) => (
                    <TableCell
                      key={colName}
                      style={{
                        fontSize: '14px',
                        padding: '10px',
                        wordWrap: 'break-word', // Allow long words to be broken and wrap to the next line
                      }}
                    >
                      {row[colName]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};









export default NullRowsTable;
