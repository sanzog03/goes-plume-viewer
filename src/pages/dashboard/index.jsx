import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayer } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";

import { getPlotsItems } from './helper';

import "./index.css";

export function Dashboard({ dataTree, metaData, zoomLevel }) {
  const [ selectedPlume, setSelectedPlume ] = useState(null);
  const [ plots, setPlots ] = useState([]);
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]);
  const [ openDrawer, setOpenDrawer ] = useState(false);

  const handleSelectedPlume = (plume) => {
    setSelectedPlume(plume);
    setPlumesForAnimation(dataTree[plume.plumeId])
  }

  useEffect(() => {
    const plots = getPlotsItems(dataTree);
    setPlots(plots)
  }, [dataTree]);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <Title/>
        <MainMap>
            <MarkerFeature plots={plots} setSelectedPlume={handleSelectedPlume} setOpenDrawer={setOpenDrawer}></MarkerFeature>
            <MapLayer plume={selectedPlume}></MapLayer>
            <PlumeAnimation plumes={plumesForAnimation}/>
            <MapControls onClickHamburger={() => setOpenDrawer(true)} />
        </MainMap>
        <PersistentDrawerRight open={openDrawer} setOpen={setOpenDrawer}/>
      </div>
    </Box>
  );
}