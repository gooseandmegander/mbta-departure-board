function mapStream({ included, data }) {
  let mappedStream = [];
  const mappedStops = mapIncludedStops(included);

  for (let i = 0; i < data.length; i++) {
    const boardItem = data[i];
    const departure_time = boardItem['attributes']['departure_time'];
    const id = boardItem['id'];
    const platform_name = boardItem['relationships']['route']['data']['id'];

    const stop_id = boardItem['relationships']['stop']['data']['id'];
    const stop_name = mappedStops[stop_id];


    let boardItemValues = {
      'departure_time': departure_time,
      'destination': '',
      'status': '',
      'platform_name': platform_name,
      'date': ''
    };
    mappedStream[id] = boardItemValues;
  }

  return mappedStream;
}

function mapIncludedStops(includedData) {
  let mappedStops = {};

  includedData.forEach(({ id, attributes }) => {
    mappedStops[id] = {
      'platform_name': attributes['platform_name'],
      'name': attributes['name']

    }
  });
  return mappedStops;
}

export default mapStream;