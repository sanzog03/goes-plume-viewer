import React from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../../components/mapboxViewer';

import "./index.css";

export function Dashboard({ data, metaData, zoomLevel }) {

  // lets see where the sources of data are from.
  // format of FeatureCollection Id: <something>_<station/region(BV1)>_<datetime></datetime>
  const dataTree = {};
  const regionsName = new Set();
  const plumesIds = new Set();

  const sortedData = data.sort((prev, next) => {
    const prev_date = new Date(prev.properties.datetime).getTime();
    const next_date = new Date(next.properties.datetime).getTime();
    return prev_date - next_date
  });

  sortedData.forEach((item) => {
    const itemId = item.id;
    const destructuredId = itemId.split("_");
    const [ _, region, plumeId, __ ] = destructuredId;

    // build tree
    if (!(region in dataTree)) {
      dataTree[region] = {};
    }
    if (!(plumeId in dataTree[region])) {
      dataTree[region][plumeId] = [];
    }
    dataTree[region][plumeId].push(item);

    // collect regionsName and PlumeIds
    regionsName.add(region);
    plumesIds.add(plumeId);
  });
  // tree data structure is ready

  // Now, lets get the list of items that we need to plot in the map.
  const plots = []
  Object.keys(dataTree).forEach(region => {
    Object.keys(dataTree[region]).forEach(plumesId => {
      // plumeIds: [lon, lat]
      const representingPlume = dataTree[region][plumesId][0];
      const [lon1, lat1, _, __] = representingPlume.bbox;
      plots.push({
        plumeId: plumesId,
        region: region,
        location: [lon1, lat1],
        data: representingPlume
      });
    });
  });

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MapBoxViewer data={data} metaData={metaData} dataTree={dataTree} plots={plots}/>
      </div>
    </Box>
  );
}