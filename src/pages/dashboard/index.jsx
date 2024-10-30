import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayer } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';

import { getPlotsItems } from './helper';

import "./index.css";

export function Dashboard({ dataTree, metaData, zoomLevel }) {
  const [ selectedPlume, setSelectedPlume ] = useState(null);
  const [ plots, setPlots ] = useState([]);
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]);

  console.log("dtree", dataTree);
  console.log("selPlume", selectedPlume)

  const handleSelectedPlume = (plume) => {
    setSelectedPlume(plume);
    setPlumesForAnimation(dataTree[plume.plumeId])
  }

  useEffect(() => {
    console.log(dataTree)
    const plots = getPlotsItems(dataTree);
    setPlots(plots)
  }, [dataTree]);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MainMap>
            <MarkerFeature plots={plots} setSelectedPlume={handleSelectedPlume}></MarkerFeature>
            <MapLayer plume={selectedPlume}></MapLayer>
            <PlumeAnimation plumes={plumesForAnimation}/>
        </MainMap>
      </div>
    </Box>
  );
}