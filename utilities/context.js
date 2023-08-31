import {createContext, useContext, useState, useEffect} from 'react';
import {onAuthStateChanged, updateProfile} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../utilities/firebase';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const getUserRole = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const val = JSON.parse(value);
        setUserRole(val.userRole);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser({});
      }
    });
    let displayName =
      auth?.currentUser?.displayName === ''
        ? user?.email?.split('@')[0]
        : auth?.currentUser?.displayName;
    let photoURL =
      auth?.currentUser?.photoURL === ''
        ? 'https://cdn5.vectorstock.com/i/1000x1000/09/79/user-neon-sign-vector-28270979.jpg'
        : auth?.currentUser?.photoURL;

    updateProfile(auth?.currentUser, {
      displayName: displayName,
      photoURL: photoURL,
    });

    getUserRole();

    return unsubscribe;
  }, [user]);

  return (
    <AuthContext.Provider value={{user, userRole}}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
