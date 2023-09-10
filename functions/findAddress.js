import {Client} from '@googlemaps/google-maps-services-js';
const client = new Client({});

export const findAddress = async latlong => {
  try {
    let response = await client.reverseGeocode({
      params: {
        key: 'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc',
        latlng: latlong,
      },
    });
    return response.data?.results[0]?.formatted_address.split(',')[0];
  } catch (error) {
    // console.log(error.message);
    throw new Error('Find address error');
  }
};
