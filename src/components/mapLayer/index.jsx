import { useEffect, useState } from "react";
import { useMapbox } from "../../context/mapContext";

export const MapLayer = ({ plume }) => {
    const { map } = useMapbox();
    const [ prevLayerId, setPrevLayerId ] = useState();
    const [ prevSourceId, setPrevSourceId ] = useState();

    useEffect(() => {
        if (!map || !plume) return;
        
        if (prevLayerId) map.removeLayer(prevLayerId);
        if (prevSourceId) map.removeSource(prevSourceId);

        const features = plume.data;
        const uid = plume.plumeId;
        const sourceId = "raster-source-" + uid;
        const layerId = "raster-layer-" + uid;

        setPrevSourceId(sourceId);
        setPrevLayerId(layerId);
        addRaster(map, features, sourceId, layerId);

        return () => { 
            map.removeLayer(layerId);
            map.removeLayer(sourceId);
        }
    }, [plume]);

    return null;
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
