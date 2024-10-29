export function dataTransformation(data) {
    // format of FeatureCollection Id: <something>_<station/region(BV1)>_<datetime></datetime>
    const dataTree = {};

    // sort by data by time
    const sortedData = data.sort((prev, next) => {
        const prev_date = new Date(prev.properties.datetime).getTime();
        const next_date = new Date(next.properties.datetime).getTime();
        return prev_date - next_date
    });

    // create a data tree
    sortedData.forEach((item) => {
        const itemId = item.id;
        const destructuredId = itemId.split("_");
        const [ _, region, plumeId, __ ] = destructuredId;

        // build tree
        if (!(region in dataTree)) {
            dataTree[region] = {};
        }
        if (!(plumeId in dataTree[region])) {
            dataTree[region][plumeId] = [];
        }
        dataTree[region][plumeId].push(item);
    });

    return dataTree;
}