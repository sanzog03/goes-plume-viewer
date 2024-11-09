import React from "react";
import IconButton from "@mui/material/IconButton";
import ExpandIcon from "@mui/icons-material/Expand";
import ReactDOM from "react-dom/client";

function MeasureButton() {
  return (
    <IconButton className="measure-icon">
      <ExpandIcon />
    </IconButton>
  );
}

export class MeasureDistanceControl {
  constructor(onClick) {
    this._onClick = onClick;
    console.log("mounted");
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.container.addEventListener("contextmenu", (e) => e.preventDefault());
    const root = ReactDOM.createRoot(this.container);
    root.render(<MeasureButton />);

    this.root = root;
    this.container.onclick = this._onClick;
    return this.container;
  }

  onRemove() {
    if (this.root) {
      this.root.unmount();
    }
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
