import { useEffect, useRef } from "react";
import { useMapbox } from "../../context/mapContext";
import TimelineControl from "mapboxgl-timeline";
import moment from "moment";
import { addSourceLayerToMap as bufferSourceLayer, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

import 'mapboxgl-timeline/dist/style.css';
import "./index.css";

export const PlumeAnimation = ({ plumes }) => {
    // plume is the array of stac collection features
    const { map } = useMapbox();
    const timeline = useRef(null);

    useEffect(() => {
        if (!map || !plumes.length) return;

        // hashmap so we could refer the index and do manipulations with respect to the index.
        const plumeDateIdxMap = {}
        plumes.forEach((plume, idx) => {
            const datetime = plume["properties"]["datetime"];
            const momentFormattedDatetimeStr = moment(datetime).format();
            plumeDateIdxMap[momentFormattedDatetimeStr] = idx;
        });

        console.log(plumeDateIdxMap)

        // bufferedLayer to hold the layers and soruces that are already bufferedLayer
        const bufferedLayer = new Set();
        const bufferedSource = new Set();
        // always setup when marker is clicked by mapLayer component
        // bufferedLayer.add(getLayerId(0));
        // bufferedSource.add(getSourceId(0));

        let startDatetime = plumes[0]["properties"]["datetime"];
        let endDatetime = plumes[plumes.length - 1]["properties"]["datetime"];
        timeline.current = new TimelineControl({
            start: startDatetime,
            end: endDatetime,
            initial: startDatetime,
            step: 1000 * 60 * 5, //miliseconds
            onStart: (date) => {
                // executed on initial step tick.
                handleAnimation(map, date, plumeDateIdxMap, plumes, bufferedLayer, bufferedSource);
            },
            onChange: date => {
                // executed on each changed step tick.
                handleAnimation(map, date, plumeDateIdxMap, plumes, bufferedLayer, bufferedSource);
            }
        });
        map.addControl(timeline.current, "top-left");

        return () => {
            // cleanups
            bufferedLayer.forEach(layer => { if (layerExists(map, layer)) map.removeLayer(layer) });
            bufferedSource.forEach(source => { if (sourceExists(map, source)) map.removeSource(source) });
            bufferedLayer.clear();
            bufferedSource.clear();
            prev = getLayerId(0); // always setup when marker is clicked by mapLayer component
            // bufferedLayer.add(getLayerId(0));
            // bufferedSource.add(getSourceId(0));
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

const handleAnimation = (map, date, plumeDateIdxMap, plumes, bufferedLayer, bufferedSource) => {
    const momentFormattedDatetimeStr = moment(date).format();
    if (!(momentFormattedDatetimeStr in plumeDateIdxMap)) return;

    const index = plumeDateIdxMap[momentFormattedDatetimeStr];
    console.log("index:", index);
    bufferAndTransition(map, plumes, index, bufferedLayer, bufferedSource);
}

let prev=getLayerId(0); // always setup when marker is clicked by mapLayer component

const bufferAndTransition = (map, plumes, index, bufferedLayer, bufferedSource) => {
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

const transitionLayers = (map, prevLayerId, currentLayerId) => {
    // Fade out the prev layer
    if (prevLayerId) {
        map.setLayoutProperty(prevLayerId, 'visibility', 'none');
    }

    // Fade in the current layer
    if (currentLayerId) {
        map.setLayoutProperty(prevLayerId, 'visibility', 'visible');
    }
}