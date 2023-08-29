import * as Location from 'expo-location';
import {Client} from '@googlemaps/google-maps-services-js';
const client = new Client({});

export const findLocation = async () => {
  try {
    let {status} = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   throw new Error('Error 0 : Permission not granted');
    // }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    let latlong = {
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    };

    return latlong;
  } catch (error) {
    throw new Error('Location error');
  }
};

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
