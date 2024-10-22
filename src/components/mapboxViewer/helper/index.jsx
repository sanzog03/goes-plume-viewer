export const getMeanCenterOfLocation = (stations) => {
  // go through the stations and average the lat and lon to get the center
  let latSum = 0;
  let lonSum = 0;
  stations.forEach((station) => {
      let { properties: {longitude, latitude} } = station;
      latSum += latitude;
      lonSum += longitude;
  });
  let latCenter = latSum / stations.length;
  let lonCenter = lonSum / stations.length;
  return [lonCenter, latCenter];
}