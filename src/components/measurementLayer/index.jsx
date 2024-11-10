import { useEffect, useState } from "react";
import { useMapbox } from "../../context/mapContext";
import {
  findMeasurementAnchor,
  addMeasurementLayer,
  addMeasurementSource,
  createMeasuringLine,
  removeMeasurementLayer,
  removeMeasurementSource,
  changeCursor,
  cleanMap,
  MEASURE_LINE,
  MEASURE_LABEL,
  MEASURE_POINTS,
} from "../../utils/measureDistance";

export const MeasurementLayer = ({ measureMode,setClearIcon,clearMap,setClearMap }) => {
  const { map } = useMapbox();
  const [measurePoints, setMeasurePoints] = useState(null);
  const [measureLine, setMeasureLine] = useState(null);
  const [measureLabel, setMeasureLabel] = useState(null);
 
 
  
  
  const clearMeasurementState = () => { 
    setMeasureLine(MEASURE_LINE);
    setMeasureLabel(MEASURE_LABEL);
    setMeasurePoints(MEASURE_POINTS)
  };

  
  const handleClick = (e) => {
    const anchor = findMeasurementAnchor(e, map, measurePoints);
    if (!anchor?.features?.length) {
      cleanMap(map)
      setClearIcon(false)
    } 
    setMeasurePoints(anchor);
    map.getSource("measurePoints").setData(anchor);
    map.moveLayer("measure-points");
  };

  const handleMouseMovement = (e) => {
    const { line, label } = createMeasuringLine(e, measurePoints);
    map.getSource("measureLine")?.setData(line);
    map.getSource("measureLabel")?.setData(label);
    map.moveLayer("measure-line");
    map.moveLayer("measure-label");
    setMeasureLine(line);
    setMeasureLabel(label);
  };
  
   useEffect(() => {
    if (clearMap) {
      cleanMap(map)
      clearMeasurementState();
      setClearIcon(false)
      setClearMap(false)
    }
  
  }, [clearMap, map])

  useEffect(() => {
    if (!map) return;
    if (measurePoints?.features.length > 0 && measureMode) {
      setClearIcon(true)
      map.on("mousemove", handleMouseMovement);
    }
    return () => {
      // cleanups
      if (map) {
        map.off("mousemove", handleMouseMovement);
      }
    };
  }, [map, measurePoints]);

  useEffect(() => {
    if (map) {
      changeCursor(map, measurePoints, measureMode);
      if (measureMode) {
        addMeasurementSource(map, measurePoints, measureLine, measureLabel);
        addMeasurementLayer(map);
      } else if (!measureMode) {
        removeMeasurementSource(map);
        removeMeasurementLayer(map);
        clearMeasurementState();
      }
      return () => {
        removeMeasurementSource(map);
        removeMeasurementLayer(map);
      };
    }
  }, [map, measureMode]);

  useEffect(() => {
    if (!map) return;
    if (measureMode && map) {
      map.on("click", handleClick);
    }
    return () => {
      // cleanups
      if (map) {
        map.off("click", handleClick);
      }
    };
  });

  return null;
};
