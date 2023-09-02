import {
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
} from 'react-native';

export const hasLocationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    // console.log('Location permission granted by user.');
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    // console.log('Location permission denied by user.');
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    // console.log('Location permission revoked by user.');
    ToastAndroid.show(
      'Location permission revoked. Allow location access in settings',
      ToastAndroid.LONG,
    );
    Linking.openSettings();
  }

  return false;
};
