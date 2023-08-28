import 'react-native-gesture-handler';
import './ignoreWarnng';
import {registerRootComponent} from 'expo';
import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, NativeBaseProvider, Pressable, Text} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import importFont from './utilities/fonts';
// "react": "18.2.0",

// ===============Create Navigations==============
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ===============Imports Screens==============
import GetStarted from './screens/Authentication/GetStarted';
import RenterLogin from './screens/Authentication/RenterLogin';
import StudentLogin from './screens/Authentication/StudentLogin';
import SignUp from './screens/Authentication/SignUp';

import Home from './screens/Home';
import Browse from './screens/Browse';
import WishList from './screens/WishList';
import Profile from './screens/Profile';
import Map from './screens/Map';
import Details from './screens/Details';
import {Reserved} from './screens/Reserved';

// ===============Imports Icons==============
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './context';

export default function App() {
  const [isUser, setIsUser] = useState(true);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();

    return () => {
      // dispatch({ isLoading: true, isSignout: false, userToken: null });
    };
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  if (!importFont()) {
    return (
      <NativeBaseProvider>
        <Text>Font Not loaded</Text>
      </NativeBaseProvider>
    );
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <StatusBar networkActivityIndicatorVisible={false} />
            <NavigationContainer>
              {/* {state.userToken ? ( */}
              {true ? (
                <Tab.Navigator
                  screenOptions={{tabBarHideOnKeyboard: true}}
                  initialRouteName="Browse">
                  {/* <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{

                      // tabBarActiveBackgroundColor: "#FD685F",
                      headerShown: false,
                      tabBarStyle: { backgroundColor: "#FD683D", height: 60 },
                      tabBarIcon: () => (
                        <AntDesign name="home" size={24} color="white" />
                      ),
                      tabBarItemStyle: { marginBottom: 2 },
                      tabBarLabel: "Home",
                      tabBarLabelStyle: { color: "white", fontSize: 14 },
                    }}
                  /> */}

                  <Tab.Screen
                    name="Browse"
                    component={Browse}
                    options={{
                      headerShown: false,
                      tabBarStyle: {backgroundColor: '#FD683D', height: 60},
                      tabBarIcon: () => (
                        <AntDesign name="search1" size={24} color="white" />
                      ),
                      tabBarItemStyle: {marginBottom: 2},
                      tabBarLabel: 'Browse',
                      tabBarLabelStyle: {color: 'white', fontSize: 14},
                    }}
                  />

                  <Tab.Screen
                    name="WishList"
                    component={WishList}
                    options={{
                      headerShown: false,
                      tabBarStyle: {backgroundColor: '#FD683D', height: 60},
                      tabBarIcon: () => (
                        <Ionicons
                          name="bookmarks-outline"
                          size={24}
                          color="white"
                        />
                      ),
                      tabBarItemStyle: {
                        marginBottom: 2,
                        borderBottomWidth: 2,
                        borderBottomColor: '#fff',
                        borderRadius: 10,
                      },
                      tabBarLabel: 'WishList',
                      tabBarLabelStyle: {color: 'white', fontSize: 14},
                    }}
                  />

                  <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                      headerShown: false,
                      tabBarStyle: {backgroundColor: '#FD683D', height: 60},
                      tabBarIcon: () => (
                        <AntDesign name="user" size={24} color="white" />
                      ),
                      tabBarItemStyle: {marginBottom: 2},
                      tabBarLabel: 'Account',
                      tabBarLabelStyle: {color: 'white', fontSize: 14},
                    }}
                  />
                  <Tab.Screen
                    name="Map"
                    component={Map}
                    options={{
                      headerShown: false,
                      tabBarStyle: {
                        display: 'none',
                      },
                      tabBarItemStyle: {marginBottom: 2, display: 'none'},
                    }}
                  />
                  <Tab.Screen
                    name="Details"
                    component={Details}
                    options={({route, navigation}) => ({
                      headerTitleStyle: {color: '#fff'},
                      headerLeft: () => {
                        return (
                          <Ionicons
                            style={{paddingLeft: 5}}
                            name="chevron-back-outline"
                            size={24}
                            color="#fff"
                            onPress={() => navigation.navigate('Browse')}
                          />
                        );
                      },
                      headerStyle: {backgroundColor: '#FF754E'},
                      title: route.params?.name || 'Details',
                      tabBarStyle: {
                        display: 'none',
                      },
                      tabBarItemStyle: {marginBottom: 2, display: 'none'},
                    })}
                  />
                  <Tab.Screen
                    name="Settings"
                    component={Reserved}
                    options={{
                      headerShown: false,
                      tabBarStyle: {backgroundColor: '#FD683D', height: 60},
                      tabBarIcon: () => (
                        <Ionicons name="home" size={24} color="white" />
                      ),
                      tabBarItemStyle: {
                        marginBottom: 2,
                        borderBottomWidth: 2,
                        borderBottomColor: '#fff',
                        borderRadius: 10,
                      },
                      tabBarLabel: 'Settings',
                      tabBarLabelStyle: {color: 'white', fontSize: 14},
                    }}
                  />
                </Tab.Navigator>
              ) : (
                <Stack.Navigator initialRouteName="get-start">
                  <Stack.Screen
                    name="get-start"
                    component={GetStarted}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="renter-login"
                    component={RenterLogin}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="student-login"
                    component={StudentLogin}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="sign-up"
                    component={SignUp}
                    options={{headerShown: false}}
                  />
                </Stack.Navigator>
              )}
            </NavigationContainer>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </AuthContext.Provider>
    );
  }
}

registerRootComponent(App);
