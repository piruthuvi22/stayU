import 'react-native-gesture-handler';
import './ignoreWarning';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Box, Button, Center, NativeBaseProvider, Pressable} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AuthProvider} from './utilities/context';
// "react": "18.2.0",

// ===============Create Navigations==============
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ===============Imports Screens==============
import GetStarted from './screens/Authentication/GetStarted';
import RenterLogin from './screens/Authentication/RenterLogin';
import SignUp from './screens/Authentication/SignUp';

import Browse from './screens/Browse';
import WishList from './screens/WishList';
import Profile from './screens/Profile';
import Map from './screens/Map';
import Details from './screens/Details';
import AddHome from './screens/landlord/AddHome';
import LandlordHome from './screens/landlord/LandlordHome';
import {Reserved} from './screens/Reserved';

// ===============Imports Icons==============
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocationPicker} from './components/LocationPicker';
import { SplashScreen } from './components/Splash';

const TabNavigator = ({navigation, route}) => {
  console.log('TabNavigator:', route.params);
  return (
    <Tab.Navigator
      id="tabs"
      initialRouteName={'Browse'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'home-landlord') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'WishList') {
            iconName = focused ? 'bookmarks' : 'bookmarks-outline';
          } else if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-sharp';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e3b3f2',
        tabBarInactiveTintColor: '#ffffff',
        tabBarHideOnKeyboard: true,
      })}>
      {route.params.userRole === 'student' && (
        <>
          <Tab.Screen
            name="Browse"
            component={Browse}
            options={{
              headerShown: false,
              tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
              // tabBarIcon: () => (
              //   <AntDesign name="search1" size={24} color="white" />
              // ),
              // tabBarItemStyle: {marginBottom: 2},
              tabBarLabel: 'Browse',
              tabBarLabelStyle: {color: 'white', fontSize: 14},
            }}
          />
          <Tab.Screen
            name="WishList"
            component={WishList}
            options={{
              headerShown: false,
              tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
              // tabBarIcon: () => (
              //   <Ionicons name="bookmarks-outline" size={24} color="white" />
              // ),
              // tabBarItemStyle: {
              //   marginBottom: 2,
              //   // borderBottomWidth: 2,
              //   // borderBottomColor: '#fff',
              //   // borderRadius: 10,
              // },
              tabBarLabel: 'WishList',
              tabBarLabelStyle: {color: 'white', fontSize: 14},
            }}
          />
        </>
      )}

      {route.params.userRole === 'landlord' && (
        <>
          <Tab.Screen
            name="home-landlord"
            component={LandlordHome}
            options={{
              headerShown: false,
              tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
              // tabBarIcon: () => (
              //   // <AntDesign name="home" size={24} color="white" />
              // ),
              // tabBarItemStyle: {marginBottom: 2},
              tabBarLabel: 'Home',
              tabBarLabelStyle: {color: 'white', fontSize: 14},
              title: 'Add Home',
            }}
          />
          <Tab.Screen
            name="add-home"
            component={AddHome}
            options={({route, navigation}) => ({
              headerTitleStyle: {color: '#fff'},
              headerLeft: () => {
                return (
                  <Ionicons
                    style={{paddingLeft: 5}}
                    name="chevron-back-outline"
                    size={24}
                    color="#fff"
                    onPress={() => navigation.navigate('home-landlord')}
                  />
                );
              },
              headerStyle: {backgroundColor: '#FF4E83'},
              title: 'Add Home',
              tabBarStyle: {
                display: 'none',
              },
              tabBarItemStyle: {marginBottom: 2, display: 'none'},
            })}
          />
          <Tab.Screen
            name="LocationPicker"
            component={LocationPicker}
            options={{
              headerShown: false,
              tabBarStyle: {
                display: 'none',
              },
              tabBarItemStyle: {marginBottom: 2, display: 'none'},
            }}
          />
        </>
      )}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
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
                onPress={() =>
                  route.params.userRole === 'landlord'
                    ? navigation.navigate('home-landlord')
                    : navigation.navigate('Browse')
                }
              />
            );
          },
          headerStyle: {backgroundColor: '#FF4E83'},
          title: route.params?.name || 'Details',
          tabBarStyle: {
            display: 'none',
          },
          tabBarItemStyle: {marginBottom: 2, display: 'none'},
        })}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = async () => {
    try {
      console.log('start:');

      const value = await AsyncStorage.getItem('user');
      console.log('end', value);

      if (value !== null) {
        const val = JSON.parse(value);
        setUserRole(val.userRole);
        console.log('userRole:', userRole);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect');
    getUserRole();
  }, [userRole]);
  console.log('userRole:', userRole);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <SafeAreaProvider>
          <StatusBar
            // animated={true}
            // showHideTransition={'slide'}
            backgroundColor={'#FF4E8300'}
            barStyle={'dark-content'}
            // hidden={true}
            translucent={true}
            networkActivityIndicatorVisible={false}
          />
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={userRole ? 'TabNavigator' : 'get-start'}
              id="stack">
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
                name="sign-up"
                component={SignUp}
                options={{headerShown: false}}
              />

              <Stack.Screen
                initialParams={{userRole: userRole}}
                name="TabNavigator"
                component={TabNavigator}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </NativeBaseProvider>
    </AuthProvider>
  );
}


