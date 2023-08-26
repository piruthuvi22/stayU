import {createContext, useContext, useState, useEffect} from 'react';
import {onAuthStateChanged, updateProfile} from 'firebase/auth';
import auth from '../utilities/firebase';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
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
    return unsubscribe;
  }, [user]);

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
