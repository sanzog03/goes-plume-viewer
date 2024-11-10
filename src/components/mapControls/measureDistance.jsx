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
    this._mounted = false
    this.container = null
    this.map = null
    this.root = null
    this._onClick = onClick;
  }
  updateUI() {
    if (this._mounted && this.root) {
      try {
        this.root.render(
          < MeasureButton /> 
        );
      } catch (error) {
        console.warn('Failed to update UI:', error);
      }
    }
  }

  onAdd(map) {
    try {
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
    catch (error) {
      console.error('Error adding control:', error);
      return document.createElement("div"); // Return empty div in case of error
    }
  }

   onRemove() {
    // Schedule unmount for next tick to avoid race conditions
    setTimeout(() => {
      try {
        this._mounted = false;
        
        if (this.root) {
          this.root.unmount();
          this.root = null;
        }
        
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        
        this.map = null;
        this.container = null;
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    }, 0);
  }
}
