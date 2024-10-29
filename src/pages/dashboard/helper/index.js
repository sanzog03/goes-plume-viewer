export function getPlotsItems(dataTree) {
    // get list of items to plot.
    const plots = []
    Object.keys(dataTree).forEach(region => {
        Object.keys(dataTree[region]).forEach(plumesId => {
            // plumeIds: [lon, lat]
            const representingPlume = dataTree[region][plumesId][0];
            const [lon1, lat1, _, __] = representingPlume.bbox;
            plots.push({
                plumeId: plumesId,
                region: region,
                location: [lon1, lat1],
                data: representingPlume
            });
        });
    });
    return plots;
}