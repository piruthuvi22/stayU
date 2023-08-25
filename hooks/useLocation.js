import {useState, useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';

function useLocation2() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
}

export {useLocation2};

// import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export const useLocation1 = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let {status} = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          throw new Error('Permission not granted');
        }

        let locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        let latlong = {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        };

        setLocation(latlong);
      } catch (error) {
        setError(error);
      }
    };

    getLocation();
  }, []); // The empty dependency array ensures this effect runs only once.

  return {location, error};
};

export default useLocation1;
