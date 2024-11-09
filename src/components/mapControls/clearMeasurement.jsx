import React from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import ReactDOM from "react-dom/client";

function ClearMeasurementIcon({ onClick }) {
  return (
    <IconButton className="clear-icon" onClick={onClick}>
     <ClearIcon/>
    </IconButton>
  );
}

export class ClearMeasurementControl {
  onClick() {
    console.log("Clicked");
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.container.addEventListener("contextmenu", (e) => e.preventDefault());

    const root = ReactDOM.createRoot(this.container);
    root.render(<ClearMeasurementIcon onClick={() => this.onClick()} />);

    this.root = root;

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
