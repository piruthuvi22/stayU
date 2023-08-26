import {useState, useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';

export const getLocation = () => {
  Geolocation.watchPosition(
    position => {
      // console.log('watchPosition', position.coords);
      return position.coords;
    },
    error => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      accuracy: {
        android: 'high',
      },
    },
  );
};

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        setError(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const updateLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        setError(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return {location, updateLocation, error};
};

// // import { useEffect, useState } from 'react';
// import * as Location from 'expo-location';

// export const getLocation2 = async () => {
//   let locationData = await Location.getCurrentPositionAsync({
//     accuracy: Location.Accuracy.High,
//   });

//   let latlong = {
//     latitude: locationData.coords.latitude,
//     longitude: locationData.coords.longitude,
//   };
//   return latlong;
// };
