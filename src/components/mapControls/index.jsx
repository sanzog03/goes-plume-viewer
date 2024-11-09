import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { useMapbox } from "../../context/mapContext"

import { HamburgerControl } from "./hamburger";
import { MeasureDistanceControl } from "./measureDistance";
import { ChangeUnitControl } from "./changeUnit";
import { ClearMeasurementControl } from "./clearMeasurement";

export const MapControls = ({ onClickHamburger, onClickMeasureMode }) => {
  const { map } = useMapbox();

  useEffect(() => {
    if (!map) return;

    const hamburgerControl = new HamburgerControl(onClickHamburger);
    const mapboxNavigation = new mapboxgl.NavigationControl();
    const measurementControl = new MeasureDistanceControl(onClickMeasureMode);
    const changeUnitControl = new ChangeUnitControl();
    const clearMeasurementControl = new ClearMeasurementControl();

    map.addControl(hamburgerControl);
    map.addControl(mapboxNavigation);
    map.addControl(measurementControl);
    map.addControl(changeUnitControl);
    map.addControl(clearMeasurementControl);

    return () => {
      // clean ups
      if (hamburgerControl) hamburgerControl.onRemove();
      if (mapboxNavigation) mapboxNavigation.onRemove();
      if (measurementControl) measurementControl.onRemove();
      if (changeUnitControl) changeUnitControl.onRemove();
      if (clearMeasurementControl) clearMeasurementControl.onRemove();
    };
  }, [map]);

  return null;
};
