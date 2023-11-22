import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { BarCharts } from '@mui/x-charts/BarChart';

const NullValuesBarChart = ({ nullValues }) => {
  const data = Object.entries(nullValues).map(([columnName, value]) => ({
    columnName,
    value,
  }));

  return (
    <div style={{ width:'100%'}}>
        <Typography variant="h5" gutterBottom>
         <Divider>Null Values of Each Column</Divider> 
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 7 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="columnName" angle={-45} textAnchor="end" interval={0} height={100} tick={{ fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
  );
};

export default NullValuesBarChart;

