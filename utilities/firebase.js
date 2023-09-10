// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth, initializeAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC2qkXyTtOZiBavbx7EjbSOIkSzgh8jo8A',
  authDomain: 'stayu-firebase2.firebaseapp.com',
  projectId: 'stayu-firebase2',
  storageBucket: 'stayu-firebase2.appspot.com',
  messagingSenderId: '21175664754',
  appId: '1:21175664754:web:2dec8ea6c51ed0476ec2eb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const auth = getAuth();
export const storage = getStorage(app);

// firebase - storage version 1
// rules_version = '2';

// // Craft rules based on data in your Firestore database
// // allow write: if firestore.get(
// //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {

//       allow read, write: if request.auth.token.roles.size() > 0;
//       allow read, write: if false;
//     }
//   }
// }
