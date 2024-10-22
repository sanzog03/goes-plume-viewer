export const fetchAllFromSTACAPI = async (STACApiUrl) => {
    // it will fetch all collection items from all stac api.
    // do not provide offset and limits in the url
    try {
        let requiredResult = [];
        // fetch in the collection from the stac api
        const response = await fetch(STACApiUrl);
        if (!response.ok) {
          throw new Error('Error in Network');
        }
        const jsonResult = await response.json();
        requiredResult.push(...getResultArray(jsonResult));

        // need to pull in remaining data based on the pagination information
        const { matched, returned, limit } = jsonResult.context;
        if (matched > returned) {
          let remainingData = await fetchRemainingData(STACApiUrl, matched, returned, limit);
          requiredResult.push(...remainingData);
        }
        return requiredResult;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
}

const fetchRemainingData = async (STACApiUrl, numberMatched, numberReturned, limit) => {
    let remaining = numberMatched - numberReturned;
    // so we still have some remaining data to fetch
    let batches = Math.ceil(remaining / limit);
    let offsets = []; // when we are pulling data in the capacity of 1000 per batches
    for (let i = 1; i <= batches; i++) {
      offsets.push(i * limit);
    }

    let dataFetchPromises = [];

    offsets.forEach(async (offset) => {
        const response = fetch(addOffsetsToURL(STACApiUrl, offset, limit));
        dataFetchPromises.push(response);
    });

    try {
        let results = await Promise.all(dataFetchPromises);
        let jsonResult = await Promise.all(results.map(result => result.json()));
        let remainingRequiredResult = [];
        jsonResult.forEach(data => {
            remainingRequiredResult.push(...getResultArray(data));
        });
        return remainingRequiredResult;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

// helpers

const addOffsetsToURL = (url, offset, limit) => {
    if (url.includes('?')) {
        return `${url}&limit=${limit}&offset=${offset}`;
    } else {
        return `${url}?limit=${limit}&offset=${offset}`;
    }
}

const getResultArray = (result) => {
    if ("features" in result) {
        // the result is for collection item
        return result.features;
    }
    if ("collections" in result) {
        // the result is for collection
        return result.collections;
    }
    return [];
}