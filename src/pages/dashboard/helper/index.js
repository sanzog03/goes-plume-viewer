export function getPlotsItems(dataTree) {
    // get list of items to plot.
    const plots = []
        Object.keys(dataTree).forEach(plumesId => {
            // plumeIds: [lon, lat]
            const representingPlume = dataTree[plumesId][0];
            const [lon1, lat1, _, __] = representingPlume.bbox;
            plots.push({
                plumeId: plumesId,
                location: [lon1, lat1],
                data: representingPlume
            });
        });
    return plots;
}