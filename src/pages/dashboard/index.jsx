import React from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../../components/mapboxViewer';

import "./index.css";

export function Dashboard({ data, zoomLevel }) {

  // lets see where the sources of data are from.
  // format of FeatureCollection Id: <something>_<station/region(BV1)>_<datetime></datetime>
  const uniqueRegionsSet = new Set();

  data.forEach(d => {
    let id = d.id;
    let region = id.split("_")[1];
    if (!uniqueRegionsSet.has(region)) {
      uniqueRegionsSet.add(region);
    }
  });

  const uniqueRegion = Array.from(uniqueRegionsSet);
  console.log(uniqueRegion);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MapBoxViewer data={data}/>
      </div>
    </Box>
  );
}