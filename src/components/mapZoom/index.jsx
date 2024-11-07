import { useEffect } from "react";

import { useMapbox } from "../../context/mapContext";

export const MapZoom = ({ zoomLevel }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !zoomLevel.length) return;

        const [lon, lat] = zoomLevel;
        map.flyTo({
            center: [lon-0.001, lat], // Replace with the desired latitude and longitude
            zoom: 7,
        });

    }, [zoomLevel]);

    return null;
}