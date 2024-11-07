import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styled from "styled-components";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayer } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';

import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";
import { extractRepPlumes, getRepPlume } from './helper';
import { Search } from "../../components/search";

import "./index.css";


const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 15px;
`;

// // A representational plume for subdaily plumes
// interface dailyRepPlume {
//   id: string,
//   data: StacFeature, // object
//   location: [string, string] // lon, lat
// }

export function Dashboard({ dataTree, collectionId, metaData, zoomLevel, setZoomLevel }) {
  const [ selectedPlume, setSelectedPlume ] = useState(null); // plume id looks like BV1-1
  const [ dailyRepPlumes, setDailyRepPlumes ] = useState([]);
  const [ dailyRepPlumeIds, setDailyRepPlumeIds ] = useState([]);
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]);
  const [ openDrawer, setOpenDrawer ] = useState(false);

  const handleSelectedPlume = (dailyRepPlume) => {
    const { location, plumeId} = dailyRepPlume;
    setSelectedPlume(dailyRepPlume);
    setPlumesForAnimation(dataTree[plumeId])
    setOpenDrawer(true);
    setZoomLevel(location)

  }

  const handleSearchSelectedPlumeId = (plumeId) => {
    const selectedPlume = getRepPlume(plumeId, dataTree);
    handleSelectedPlume(selectedPlume);
  }

  useEffect(() => {
    if (!dataTree) return;

    const dailyRepPlumes = extractRepPlumes(dataTree);
    const dailyRepPlumeIds = dailyRepPlumes.map(plume => plume.plumeId);
    setDailyRepPlumes(dailyRepPlumes)
    setDailyRepPlumeIds(dailyRepPlumeIds);
  }, [dataTree]);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <Title>
          <HorizontalLayout>
            <Search ids={dailyRepPlumeIds} setSelectedPlumeId={handleSearchSelectedPlumeId}></Search>
          </HorizontalLayout>
          <HorizontalLayout>
            <div style={{width: "45%", height: "90%"}} >
              <DatePicker
                  label="Start Date"
                  // defaultValue={dayjs('2022-04-17')}
              />
            </div>
            <div style={{width: "45%", height: "90%"}} >
              <DatePicker
                  label="End Date"
                  // defaultValue={dayjs('2022-04-20')}
              />
            </div>
          </HorizontalLayout>
        </Title>
        <MainMap>
            <MarkerFeature plots={dailyRepPlumes} setSelectedPlume={handleSelectedPlume}></MarkerFeature>
            <MapLayer plume={selectedPlume}></MapLayer>
            <PlumeAnimation plumes={plumesForAnimation}/>
            <MapControls onClickHamburger={() => setOpenDrawer(true)} />
            <MapZoom zoomLevel={zoomLevel} />
        </MainMap>
        <PersistentDrawerRight open={openDrawer} setOpen={setOpenDrawer} selectedPlume={selectedPlume} collectionId={collectionId}/>
      </div>
    </Box>
  );
}