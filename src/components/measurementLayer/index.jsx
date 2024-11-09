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
} from "../../utils/measureDistance";

export const MeasurementLayer = ({ measureMode }) => {
  const { map } = useMapbox();
  const [measurePoints, setMeasurePoints] = useState(null);
  const [measureLine, setMeasureLine] = useState(null);
  const [measureLabel, setMeasureLabel] = useState(null);

  const clearMeasurementState = () => {
    setMeasurePoints({
      type: "FeatureCollection",
      features: [],
    });
  };

  const handleClick = (e) => {
    const anchor = findMeasurementAnchor(e, map, measurePoints);
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
    if (!map) return;
    if (measurePoints?.features.length > 0 && measureMode) {
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
