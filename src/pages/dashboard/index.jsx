import React from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../../components/mapboxViewer';

import "./index.css";

export function Dashboard({ data, zoomLevel }) {
  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MapBoxViewer data={data}/>
      </div>
    </Box>
  );
}