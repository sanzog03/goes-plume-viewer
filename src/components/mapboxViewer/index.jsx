import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

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
        }
        // functions
        this.getMeanCenterOfLocation = getMeanCenterOfLocation;
        this.getMarkerSVG = getMarkerSVG;
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
        if (this.props.data !== prevProps.data) {
            // data comes after some time async
            this.plotPlumesMarker(this.props.data);

            console.log("data>>>>", this.props.data)
            console.log("metadata>>>>", this.props.metaData)
            // For testing only
            this.props.data.forEach((data, idx) => {
                this.addRaster(data, idx)
            })
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

    plotPlumesMarker = (features) => {
        const uniqueLocationsSet = new Set();
        features.forEach(feature => {
            const { bbox } = feature;
            const lon = bbox[0];
            const lat = bbox[1];
            const coordinate = [lon, lat];
            if (!uniqueLocationsSet.has(JSON.stringify(coordinate))) {
                uniqueLocationsSet.add(JSON.stringify(coordinate));
            }
        });
        const uniqueLocations = Array.from(uniqueLocationsSet).map(coordinateStr => JSON.parse(coordinateStr));

        uniqueLocations.forEach(([lon, lat]) => {
            this.addMarker(this.state.currentViewer, lon, lat)
        });
    }

    addRaster(feature, uniqueId) {
        const collection = "goes-ch4"; // feature.collection
        const assets = "rad"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
        let VMIN = 0;
        let VMAX = 0.2;
        let colorMap = "magma";

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
            "?item=" +
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

    render() {
        return (
            <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }} style={this.props.style}>
                <Grid container className="fullSize">
                    <Grid item xs={12} sx={{ position: "relative" }} style={{height: "100%"}}>
                        <div id="mapbox-container" className='fullSize' style={{ position: "absolute" }}></div>
                    </Grid>
                </Grid>
            </Box>
        );    
    }
}