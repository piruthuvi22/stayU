import * as Location from 'expo-location';
import {Client} from '@googlemaps/google-maps-services-js';
const client = new Client({});

export const findLocation = async () => {
  try {
    let {status} = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   throw new Error('Error 0 : Permission not granted');
    // }

    let location = await Location.getCurrentPositionAsync({});
    let latlong = {
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    };

    return latlong;
  } catch (error) {
    throw new Error('Error : ' + error.message);
  }
};

export const findAddress = async lantlong => {
  try {
    let response = await client.reverseGeocode({
      params: {
        key: 'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc',
        latlng: lantlong,
      },
    });
    return response.data?.results[0]?.formatted_address.split(',')[0];
  } catch (error) {
    throw new Error('Error while reverse geocoding: ' + error.message);
  }
};
