import Nav from './Nav';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import 'fontsource-roboto';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '@mui/material';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid} from 'recharts';
import NullValuesBarChart from './NullValuesBarChart';
import NullRowsTable from './NullRowsTable';
import Divider from '@mui/material/Divider';
import MismatchedColumns from './MismatchedColumn';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { PieChart,pieArcLabelClasses } from '@mui/x-charts/PieChart';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MandateColumns from './MandateColumns';
import { Router, useNavigate} from 'react-router-dom';
import PieArcLabel from './PieArcLabel';


const ColumnInfoTable = ({ columnInfo }) => {
    return (
      <Grid item xs={4} >
        
        <Paper>
          <TableContainer component={Paper} style={{ marginTop: '20px' ,marginBottom:'17px'}}>
            <Table size="small" style={{ height: 'auto' }}>
              <TableHead style={{ backgroundColor: '#3498db', color: '#fff' }}>
                <TableRow>
                  <TableCell>Column Name</TableCell>
                  <TableCell>Data Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(columnInfo).map(([columnName, dataType]) => (
                  <TableRow key={columnName}>
                    <TableCell>{columnName}</TableCell>
                    <TableCell>{dataType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    );
  };
  
  const DataRowTable = ({ title, data }) => {
    return (
      <Grid item xs={4} >
        
        <Paper>
          <TableContainer component={Paper} style={{ marginTop: '20px'}}>
            <Table size="small">
              <TableHead style={{ backgroundColor: '#3498db', color: '#fff' }}>
                <TableRow>
                  <TableCell>{title}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  Object.entries(data).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{`${key}: ${value}`}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    );
  };
const DataCard = ({ title, data }) => {
    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      minHeight: '120px',
      transition: 'transform 0.3s ease-in-out',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0.1, 0.1, 0.1, 0.45)',
      marginBottom:'10px',
      color: '#000', 
      marginTop:'18px',
      color: theme.palette.text.secondary,
      '&:hover': {
        transform: 'scale(1.05)',
      }
    }));
    return (
        <Grid item xs={4}>
      <Item>
        <h2 style={{color:'#333'}}><Divider >{title}</Divider></h2>
        {title === 'Date Format'  ? ( 
                    <div style={{color:'#000'}}>{data}   </div>) : (data ? (Object.entries(data).map(([key, value]) => (
              <div key={key}>
                {title === 'Shape' ? ( <div style={{color:'#000'}}>
                    {key === '0' ? ( <strong>Columns:</strong>) : key === '1' ? (<strong>Rows:</strong>) : 
                    (<strong>{key}:</strong>)} {value}
                  </div>) : (<div style={{color:'#333'}}>
                    <strong>{key}:</strong> {value}
                  </div>
                )}
              </div>
            ))
            
          ) : (
            <div> </div>
          )
        )}
      </Item>
    </Grid>
      );
    };
  
   
const Result = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const emptyrows=data.empty_rows;
  const nonempty=data.rows-data.empty_rows;
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
  };
const piedata=[{ value: emptyrows, label: 'Empty Rows',color: '#8884d8' },
{ value: nonempty, label: 'Non-empty Rows' }]
  
  return (
    <div>
      <Nav/> <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
  <FileCopyIcon style={{ marginRight: '5px'}} />
  <h3 style={{ margin: '0', marginRight:'10px' }}>Filename: </h3>
  <div> {data.filename}</div>

  <Grid item>
            <IconButton color="inherit" onClick={handleClose} style={{paddingTop:'13px' }} >
              <CloseIcon />
            </IconButton>
          </Grid>
</Grid>
        </Grid>
        <Grid item container alignItems="center">
        </Grid>
      </Grid>
      <Grid container spacing={2} className='grid' style={{paddingLeft:'5px',paddingRight:'5px'}}  >
<DataCard title="Shape" data={data.shape} />
<DataCard title="Date Format" data={data.date_format} />
<DataCard title="Date Range" data={data.date_range} />
</Grid>
<Grid container spacing={2}>
  <ColumnInfoTable columnInfo={data.column_info} />
  <DataRowTable title="First Row" data={data.first_row} />
  <DataRowTable title="Last Row" data={data.last_row} />
  </Grid>
<Grid container spacing={2}>
      <Grid item xs={5}>
      <MismatchedColumns mismatchedColumn={data.mismatched_columns} number={data.number_of_unmatched_columns}/>
        <Divider style={{fontSize:'20px'}}>Mandate Columns</Divider>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        <MandateColumns items={data.mandatecolumns} />
        </div>
      </Grid>
      <Grid item xs={7}>
        <Divider style={{fontSize:'20px'}}>Null Rows</Divider>
        <div style={{ display: 'flex', flexDirection: 'row' ,marginTop:'10px'}}>
        <PieChart
      series={[
        {
          data:[{ value: emptyrows, label: 'Empty Rows',color: '#8884d8' },
          { value: nonempty, label: 'Non-empty Rows' }],
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          arcLabel: (item) => `${item.value}`
        },
      ]} sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
        },
      }}
      height={200}
      width={500}
    />
        </div>
      </Grid>
    </Grid>
    <NullValuesBarChart nullValues={data.null_values} />
<Grid container spacing={2}>
  <NullRowsTable nullValueRows={data.null_value_rows} />    
</Grid>

    </div>
  );
};

export default Result;

