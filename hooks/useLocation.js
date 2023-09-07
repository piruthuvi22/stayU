import {useState, useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {hasLocationPermission} from '../functions/locationPermission';

// export const getLocation = () => {
//   let hasPermission = hasLocationPermission();
//   if (hasPermission) {
//     Geolocation.watchPosition(
//       position => {
//         // console.log('watchPosition', position.coords);
//         return position.coords;
//       },
//       error => {
//         console.error(error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 20000,
//         maximumAge: 1000,
//         accuracy: {
//           android: 'high',
//         },
//       },
//     );
//   }
// };

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let hasPermission = hasLocationPermission();
    let watchId;
    if (hasPermission) {
      watchId = Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
        },
        error => {
          setError(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const updateLocation = () => {
    console.log("Refresh hook")
    let hasPermission = hasLocationPermission();
    if (hasPermission) {
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
    }
  };

  return {location, updateLocation, error};
};