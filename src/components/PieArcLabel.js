import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';



export default function PieArcLabel(emptyrows, nonempty) {
  const piedata = [
    { value: Number(emptyrows), label: 'Empty Rows', color: '#8884d8' },
    { value: Number(nonempty), label: 'Non-empty Rows', color: '#82ca9d' },
  ];
  const size = {
    width: 400,
    height: 200,
  };  

  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.label} (${item.value})`,
          arcLabelMinAngle: 45,
          data: piedata,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
        },
      }}
      {...size}
      
    />
  );
}

