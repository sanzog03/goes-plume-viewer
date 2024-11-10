import React from "react";
import IconButton from "@mui/material/IconButton";
import ExpandIcon from "@mui/icons-material/Expand";
import StraightenIcon from '@mui/icons-material/Straighten';
import ReactDOM from "react-dom/client";

function MeasureButton({ icon,onClick }) {
  return (
    <IconButton className="measure-icon" onClick={onClick}>
      {
        icon ? <ExpandIcon /> : <StraightenIcon style={{ transform: 'rotate(90deg)' }} />
      }
      
    </IconButton>
  );
}

export class MeasureDistanceControl {
  constructor(onClick) {
    this._mounted = false
    this.container = null
    this.map = null
    this.root = null
    this.icon = true
    this._onClick = onClick
  }
  
  handleClick = () => {
    if (!this._mounted || !this.map) return;
    this._onClick();
    this.icon = !this.icon 
    this.updateUI()
    
  }
  updateUI() {
    if (this._mounted && this.root) {
      try {
        this.root.render(
          < MeasureButton icon={this.icon} onClick={this.handleClick} /> 
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
     // Create root and mark as mounted
      this.root = ReactDOM.createRoot(this.container);
      this._mounted = true;
      
      // Initial render
      this.updateUI();
      
      return this.container;
    }
    catch (error) {
      console.error('Error adding control:', error);
      return document.createElement("div"); 
    }
  }

   onRemove() {
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
