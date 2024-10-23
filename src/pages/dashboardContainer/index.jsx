import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard';
import { fetchAllFromSTACAPI } from "../../services/api";

export function DashboardContainer() {
    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ zoomLevel ] = useState (searchParams.get('zoom-level')); // let default zoom level controlled by map component
    const [ collectionId ] = useState(searchParams.get("collection-id") || "goes-ch4");

    const [ collectionItems, setCollectionItems ] = useState([]);
    const [ collectionMeta, setCollectionMeta ] = useState({});

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
        try {
            // fetch in the collection from the features api
            const collectionUrl = `${process.env.REACT_APP_STAC_API_URL}/collections/${collectionId}`;
            // use this url to find out the data frequency of the collection
            // store to a state. 
            fetch(collectionUrl).then(async metaData => {
                const metadataJSON = await metaData.json();
                setCollectionMeta(metadataJSON)
            }).catch(err => console.error("Error fetching data: ", err)); 
            // get all the collection items
            const collectionItemUrl = `${process.env.REACT_APP_STAC_API_URL}/collections/${collectionId}/items`;
            
            const data = await fetchAllFromSTACAPI(collectionItemUrl);
            setCollectionItems(data)
            // get location and image information
            // plot it in the map.
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData().catch(console.error);
    }, []); // only on initial mount

    return (
        <Dashboard
            zoomLevel={zoomLevel}
            data={collectionItems}
            metaData={collectionMeta}
        />
    );
}