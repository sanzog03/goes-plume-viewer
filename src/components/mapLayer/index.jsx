import { useEffect, useState } from "react";
import { useMapbox } from "../../context/mapContext";

export const MapLayer = ({ plume }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !plume) return;

        const features = plume.data;
        // first one is the representing tiff among subdaily
        const sourceId = getSourceId(0);
        const layerId = getLayerId(0);
        addRaster(map, features, sourceId, layerId);

        return () => {
            // cleanups
            if (map) {
                try {
                    map.removeLayer(layerId);
                    map.removeSource(sourceId);
                } catch(e) {
                    console.log(e, "later on donot overlap the implementation")
                    // make the animation clear this thing and then work on its own from the first one.
                }
            }
        }
    }, [plume]);

    return null;
}

const getSourceId = (idx) => {
    return "raster-source-" + idx;
} 

const getLayerId = (idx) => {
    return "raster-layer-" + idx;
}

function addRaster(map, feature, sourceId, layerId) {
    const collection = "goes-ch4"; // feature.collection
    const assets = "rad"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
    let VMIN = 0;
    let VMAX = 0.2;
    let colorMap = "magma";
    let itemId = feature.id;

    const TILE_URL =
        `${process.env.REACT_APP_RASTER_API_URL}/collections/${collection}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
        "?item=" + itemId +
        "&assets=" +
        assets +
        "&bidx=1" +
        "&colormap_name=" + colorMap +
        "&rescale=" +
        VMIN +
        "%2C" +
        VMAX +
        "&nodata=-9999";

    map.addSource(sourceId, {
        type: "raster",
        tiles: [TILE_URL],
        tileSize: 256,
        bounds: feature.bbox,
    });

    map.addLayer({
        id: layerId,
        type: "raster",
        source: sourceId,
        paint: { "raster-opacity" : 1 },
    });
}
