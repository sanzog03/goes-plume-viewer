import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { useMapbox } from "../../context/mapContext"

import { HamburgerControl } from "./hamburger";

export const MapControls = ({ onClickHamburger }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map) return;

        const hamburgerControl = new HamburgerControl(onClickHamburger);
        const mapboxNavigation = new mapboxgl.NavigationControl();

        map.addControl(hamburgerControl);
        map.addControl(mapboxNavigation);

        return () => {
            // clean ups
            if (hamburgerControl) hamburgerControl.onRemove();
            if (mapboxNavigation) mapboxNavigation.onRemove();
        }
    }, [map]);

    return null;
}
