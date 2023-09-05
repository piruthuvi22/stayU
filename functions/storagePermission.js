import {
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
} from 'react-native';

export const hasStoragePermission = async () => {
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  console.log('has permission', hasPermission);
  if (hasPermission) {
    return true;
  } else {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('Location permission granted by user.');
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      // console.log('Location permission denied by user.');
      ToastAndroid.show(
        'File storage permission denied by user.',
        ToastAndroid.LONG,
      );
    }
    if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      // console.log('Location permission revoked by user.');
      ToastAndroid.show(
        'File storage permission revoked. Allow storage access in settings',
        ToastAndroid.LONG,
      );
      await Linking.openSettings();
    }

    return false;
  }
};
