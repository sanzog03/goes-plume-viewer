import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import './index.css';

import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from './config';
import { getMeanCenterOfLocation } from "./helper";
import { getMarkerSVG } from "../../utils";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;

export class MapBoxViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentViewer: null,
            zoomLevel: null,
            bounds: null,
            selectedPlumeId: null,
            selectedRegion: null,
            addedPlumeLayer: [],
            addedPlumeSource: []
        }
        // functions
        this.getMeanCenterOfLocation = getMeanCenterOfLocation;
        this.getMarkerSVG = getMarkerSVG;

        // 
        this.currentSourceId = null;
        this.currentLayerId = null; 
    }

    componentDidMount() {
        mapboxgl.accessToken = accessToken;
        let mapboxStyleUrl = 'mapbox://styles/mapbox/streets-v12';
        if (mapboxStyleBaseUrl) {
            let styleId = BASEMAP_STYLES.findIndex(style => style.id === BASEMAP_ID_DEFAULT);
            mapboxStyleUrl = `${mapboxStyleBaseUrl}/${BASEMAP_STYLES[styleId].mapboxId}`;
        }

        const map = new mapboxgl.Map({
            container: 'mapbox-container',
            style: mapboxStyleUrl,
            center: [-98.585522, 1.8333333], // Centered on the US
            zoom: this.props.zoomLevel || 2,
            projection: 'equirectangular',
            options: {
                trackResize: true
            }
        });

        map.on('zoomend', () => {
            const zoomLevel = map.getZoom();
            const bounds = map.getBounds();
            console.log("zoomed in ~~~~~>", zoomLevel, " x ", bounds);

            if (zoomLevel > 6.8) {
                // find the rasters that falls inside the bounds
                console.log("add in rasters!!!!")
            }
        })

        map.on('moveend', () => {
            const zoomLevel = map.getZoom();
            const bounds = map.getBounds();
            console.log("Panned/Moved ~~~~~>", zoomLevel, " x ", bounds);
        })

        this.setState({currentViewer: map});
        
        // show the world map and show all the stations
        // this.plotStations(map, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
        if (this.props.data) {
            // no data in the start.
            console.log("!!!HERE")
            // this.plotPlumesMarker(this.props.data);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.plots !== prevProps.plots) {
            // data comes after some time async
            // first save them: [dataTree, plots]

            this.plotPlumesMarker(this.props.plots);
            // // For testing only
            // this.props.data.forEach((data, idx) => {
            //     this.addRaster(data, idx)
            // })
        }
    }

    componentWillUnmount() {
        // clean all the event listeners
        this.stationMarkers && this.stationMarkers.forEach(marker => {
            let elem = marker.getElement();
            // clone won't have the event listeners, so previous will be garbage collected
            elem.replaceWith(elem.cloneNode(true));
        });
    }

    plotPlumesMarker = (plots) => {
        plots.forEach((plot) => {
            const { plumeId, data, location, region } = plot;
            const [ lon, lat ] = location;
            const marker = this.addMarker(this.state.currentViewer, lon, lat);
            marker.getElement().addEventListener("click", (e) => {
                //1. clear previous added Plume Layer
                this.state.addedPlumeLayer.forEach((layerId) => {
                    // remove layer
                    this.state.currentViewer.removeLayer(layerId);
                })
                this.state.addedPlumeSource.forEach((sourceId) => {
                    // remove source
                    this.state.currentViewer.removeSource(sourceId);
                })
                
                // get the first element of the plot
                // 2. render it.
                this.addRaster(data, data.id);
                
                // 3. zoom in
                this.state.currentViewer.flyTo({
                    center: [lon, lat], // Replace with the desired latitude and longitude
                    zoom: 6,
                });

                // 4. update the state
                this.setState({ selectedPlumeId: plumeId, addedPlumeLayer: [], addedPlumeSource: [], selectedRegion: region});
                // when rendered, also showcase the playbutton.
                // play functionality will take in currently clicked plume,
                // it will take in the get the list of plumes from the dataTree
                // then it will play it in 5 seconds gap
            });
        });
    }

    addRaster(feature, uniqueId) {
        const collection = "goes-ch4"; // feature.collection
        const assets = "rad"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
        let VMIN = 0;
        let VMAX = 0.2;
        let colorMap = "magma";
        let itemId = feature.id;

        // if (this.props.metaData) {
        //  // TODO: there is a problem here.
        //     const { colormap_name, rescale } = this.props.metaData.renders[`${assets}`]
        //     colorMap = colormap_name;
        //     let [ vmin, vmax ] = rescale;
        //     VMIN = vmin;
        //     VMAX = vmax;
        // }
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
            
        let map = this.state.currentViewer;
        const rasterSourceId = "raster-source-" + uniqueId; 
        map.addSource(rasterSourceId, {
            type: "raster",
            tiles: [TILE_URL],
            tileSize: 256,
            bounds: feature.bbox,
        });
        const layerId = "raster-layer-" + uniqueId;
        map.addLayer({
            id: layerId,
            type: "raster",
            source: rasterSourceId,
            paint: {},
        });

        this.currentLayerId = layerId;
        this.currentSourceId = rasterSourceId;
        // reference to later clean them up
        this.setState((prevState, props) => ({
            addedPlumeLayer: [...prevState.addedPlumeLayer, layerId],
            addedPlumeSource: [...prevState.addedPlumeSource, rasterSourceId]
        }));
    }

    // helper

    addMarker = (map, longitude, latitude) => {
        let element = this.getMarkerElement();
        let marker = new mapboxgl.Marker(element)
        .setLngLat([longitude, latitude])
        .addTo(map);
        return marker;
    }

    getMarkerElement = () => {
        const el = document.createElement('div');
        el.className = 'marker';
        const markerColor = "#fcbb46";
        el.innerHTML = this.getMarkerSVG(markerColor);
        return el;
    }

    clearPreviousLayersAndSources = () => {
        if (this.currentLayerId) {
            try {
                this.state.currentViewer.removeLayer(this.currentLayerId);
                this.currentLayerId = null;    
            } catch (e) {
                console.error(e)
            }
        }
        if (this.currentSourceId) {
            try {
                this.state.currentViewer.removeSource(this.currentSourceId);
                this.currentSourceId = null;    
            } catch (e) {
                console.error(e)
            }
        }
        if (this.state.addedPlumeLayer) {
            this.state.addedPlumeLayer.forEach(layer => {
                try {
                    this.state.currentViewer.removeLayer(layer);
                } catch (e) {
                    console.error(e)
                }
            });
        } 
        if (this.state.addedPlumeSource) {
            this.state.addedPlumeSource.forEach(source => {
                try {
                    this.state.currentViewer.removeSource(source);                    
                } catch (e) {
                    console.error(e)
                }
            });
        }
        this.setState({ addedPlumeLayer: [], addedPlumeSource: [] });
    }

    handleAnimate = () => {
        this.clearPreviousLayersAndSources();
        const { dataTree } = this.props;
        const { selectedPlumeId, selectedRegion } = this.state;
        const allPlumes = dataTree[selectedRegion][selectedPlumeId];
        console.log("}}}}}}}}}ALL PLUMES{{{{{{{{{{{{{{")
        console.log(allPlumes)

        let index = 0;  // Initialize index to start from the first element

        const intervalId = setInterval(() => {
            // first remove previous layer
            if (this.currentLayerId) this.state.currentViewer.removeLayer(this.currentLayerId);
            if (this.currentSourceId) this.state.currentViewer.removeSource(this.currentSourceId);

            console.log(allPlumes[index]);  // Print the current element
            this.addRaster(allPlumes[index], "slideshow"+index)
            index++;  // Move to the next element
            
            if (index >= allPlumes.length) {
                clearInterval(intervalId);  // Stop the interval when we've printed all elements
            }
        }, 5000);  // 5000 milliseconds = 5 seconds
    }

   handleViewAll = () => {
        this.clearPreviousLayersAndSources();
        const { dataTree } = this.props;
        const { selectedPlumeId, selectedRegion } = this.state;
        const allPlumes = dataTree[selectedRegion][selectedPlumeId];
        console.log("}}}}}}}}}ALL PLUMES{{{{{{{{{{{{{{")
        console.log(allPlumes)

        let index = 0;  // Initialize index to start from the first element

        allPlumes.forEach((plume, idx) => {
            this.addRaster(plume, "viewall"+idx)
        });
    }

    render() {
        return (
            <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }} style={this.props.style}>
                <Grid container className="fullSize">
                    <Grid item xs={12} sx={{ position: "relative" }} style={{height: "100%"}}>
                        <div id="mapbox-container" className='fullSize' style={{ position: "absolute" }}></div>
                    </Grid>
                </Grid>
                <div style={{position: "absolute", top: "20px", left: "20px", zIndex:"9999"}}>
                    { this.state.selectedPlumeId && <Button variant="contained" onClick={this.handleAnimate}>Animate</Button> }
                </div>
                <div style={{position: "absolute", top: "70px", left: "20px", zIndex:"9999"}}>
                    { this.state.selectedPlumeId && <Button variant="contained" onClick={this.handleViewAll}>View All</Button> }
                </div>
            </Box>
        );    
    }
}