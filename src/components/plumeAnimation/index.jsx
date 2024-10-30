import { useEffect, useRef } from "react";
import { useMapbox } from "../../context/mapContext";
import TimelineControl from "mapboxgl-timeline";
import moment from "moment";

import 'mapboxgl-timeline/dist/style.css';
import "./index.css";

export const PlumeAnimation = ({ plumes }) => {
    // plume is the array of stac collection features
    const { map } = useMapbox();
    const timeline = useRef(null);

    useEffect(() => {
        if ((!map && timeline) || !plumes.length) return;

        // hashmap so we could refer the index and do manipulations with respect to the index.
        const plumeDateIdxMap = {}
        plumes.forEach((plume, idx) => {
            const datetime = plume["properties"]["datetime"];
            const momentFormattedDatetimeStr = moment(datetime).format();
            plumeDateIdxMap[momentFormattedDatetimeStr] = idx;
        });

        // bufferedLayer to hold the layers and soruces that are already bufferedLayer
        const bufferedLayer = new Set();
        const bufferedSource = new Set();
        // always setup when marker is clicked by mapLayer component
        bufferedLayer.add(getLayerId(0));
        bufferedSource.add(getSourceId(0));

        let startDatetime = plumes[0]["properties"]["datetime"];
        let endDatetime = plumes[plumes.length - 1]["properties"]["datetime"];
        timeline.current = new TimelineControl({
            start: startDatetime,
            end: endDatetime,
            step: 1000 * 60, //miliseconds
            onChange: date => {
                // executed on each step tick.
                const momentFormattedDatetimeStr = moment(date).format();
                if (!(momentFormattedDatetimeStr in plumeDateIdxMap)) return;

                const index = plumeDateIdxMap[momentFormattedDatetimeStr];
                handleAnimation(map, plumes, index, bufferedLayer, bufferedSource);
            }
        });
        map.addControl(timeline.current, "top-left");

        return () => {
            // cleanups
            if (map) {
                bufferedLayer.forEach(layer => map.removeLayer(layer));
                bufferedSource.forEach(source => map.removeSource(source));
            }
            bufferedLayer.clear();
            bufferedSource.clear();
            prev = getLayerId(0); // always setup when marker is clicked by mapLayer component
            bufferedLayer.add(getLayerId(0));
            bufferedSource.add(getSourceId(0));
            if (map && timeline) {
                map.removeControl(timeline.current);
            }
        }
    }, [plumes]);

    return (
        <div className="plume-animation-controller-container">
        </div>
    );
}

const getSourceId = (idx) => {
    return "raster-source-" + idx;
} 

const getLayerId = (idx) => {
    return "raster-layer-" + idx;
}

let prev=getLayerId(0); // always setup when marker is clicked by mapLayer component

const handleAnimation = (map, plumes, index, bufferedLayer, bufferedSource) => {
    // get the plume.
    // buffer the following k elements. // TODO
    const k = 4;
    bufferSourceLayers(map, plumes, index, k, bufferedLayer, bufferedSource);
    // display the plume.
    const prevLayerId = prev;
    const currentLayerId = getLayerId(index);
    prev = currentLayerId;
    transitionLayers(map, prevLayerId, currentLayerId);
}

const bufferSourceLayers = (map, plumes, index, k, bufferedLayer, bufferedSource) => {
    let start = index;
    let limit = index + k;
    if (start >= (plumes.length - 1)) {
        return
    }
    if (limit >= plumes.length) {
        limit = plumes.length;
    }
    for (let i=start; i<limit; i++){
        let sourceId = getSourceId(i);
        let layerId = getLayerId(i);
        if (!bufferedLayer.has(layerId)) {
            bufferSourceLayer(map, plumes[i], sourceId, layerId);
            bufferedLayer.add(layerId);
            if (!bufferedSource.has(sourceId)) bufferedSource.add(sourceId);
        }
    }
}

const bufferSourceLayer = (map, feature, sourceId, layerId) => {
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
            paint: { "raster-opacity" : 0 },
        });
    }


const transitionLayers = (map, prevLayerId, currentLayerId) => {
    // Fade out the prev layer
    if (prevLayerId) {
        map.setPaintProperty(
            prevLayerId,
            'raster-opacity',
            0,
            //  { transition: { duration: 1000 } }
        );
    }
  
    // Fade in the current layer
    if (currentLayerId) {
        map.setPaintProperty(
            currentLayerId,
            'raster-opacity',
            1,
            // { transition: { duration: 1000 } }
        );
    }
  }