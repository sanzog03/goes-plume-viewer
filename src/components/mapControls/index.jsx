import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { useMapbox } from "../../context/mapContext"
import { HamburgerControl } from "./hamburger";
import { MeasureDistanceControl } from "./measureDistance";
import { ChangeUnitControl } from "./changeUnit";
import { ClearMeasurementControl } from "./clearMeasurement";
 
export const MapControls = ({ onClickHamburger, onClickMeasureMode,onClickClearIcon,clearIcon }) => {
  const { map } = useMapbox();
  
  useEffect(() => {
    if (!map) return;

    const hamburgerControl = new HamburgerControl(onClickHamburger);
    const mapboxNavigation = new mapboxgl.NavigationControl();
    const measurementControl = new MeasureDistanceControl(onClickMeasureMode);
    const changeUnitControl = new ChangeUnitControl();

    map.addControl(hamburgerControl);
    map.addControl(mapboxNavigation);
    map.addControl(measurementControl);
    map.addControl(changeUnitControl);
   
    return () => {
      // clean ups
      if (hamburgerControl) map.removeControl(hamburgerControl)
      if (mapboxNavigation) map.removeControl(mapboxNavigation)
      if (measurementControl) map.removeControl(measurementControl)
      if (changeUnitControl) map.removeControl(changeUnitControl);
    
    };
  }, [map]);
  
   useEffect(() => {
    if (!map) return;

    const clearMeasurementControl = clearIcon?new ClearMeasurementControl(onClickClearIcon):null
  
    if (clearIcon) {
      map.addControl(clearMeasurementControl);
    }

    return () => {
      // clean ups
      if (clearMeasurementControl &&clearIcon) map.removeControl(clearMeasurementControl)
    };
  }, [map, clearIcon]);
  


  return null;
};
