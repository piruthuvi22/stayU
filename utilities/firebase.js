// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
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
const auth = getAuth();
export default auth;
