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
import {AuthProvider} from './utilities/context';
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
import AddHome from './screens/landlord/AddHome';
import LandlordHome from './screens/landlord/LandlordHome';
// import ImageViewer from './components/ImageViewer';

// ===============Imports Icons==============
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const TabNavigator = () => {
    return (
      <Tab.Navigator
        id="tabs"
        screenOptions={{tabBarHideOnKeyboard: true}}
        initialRouteName="Browse">
        <Tab.Screen
          name="Browse"
          component={Browse}
          options={{
            headerShown: false,
            tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
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
            tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
            tabBarIcon: () => (
              <Ionicons name="bookmarks-outline" size={24} color="white" />
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
            tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
            tabBarIcon: () => <AntDesign name="user" size={24} color="white" />,
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
          name="home-landlord"
          component={LandlordHome}
          options={{
            headerShown: false,
            tabBarStyle: {backgroundColor: '#FF4E83', height: 60},
            tabBarIcon: () => <AntDesign name="home" size={24} color="white" />,
            tabBarItemStyle: {marginBottom: 2},
            tabBarLabel: 'Home',
            tabBarLabelStyle: {color: 'white', fontSize: 14},
            title: 'Add Home',
          }}
        />
        <Tab.Screen
          name="add-home"
          component={AddHome}
          options={{
            headerShown: false,
            tabBarStyle: {
              display: 'none',
            },
            tabBarItemStyle: {marginBottom: 2, display: 'none'},
          }}
        />
      </Tab.Navigator>
    );
  };
  if (!importFont()) {
    return (
      <NativeBaseProvider>
        <Text>Font Not loaded</Text>
      </NativeBaseProvider>
    );
  } else {
    return (
      <AuthProvider>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <StatusBar networkActivityIndicatorVisible={false} />
            <NavigationContainer>
              <Stack.Navigator initialRouteName="get-start" id="stack">
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
                {/* <Stack.Screen
                  name="student-login"
                  component={StudentLogin}
                  options={{headerShown: false}}
                /> */}
                <Stack.Screen
                  name="sign-up"
                  component={SignUp}
                  options={{headerShown: false}}
                />
                {/* <Stack.Screen
                  name="image-viewer"
                  component={ImageViewer}
                  options={{headerShown: false}}
                /> */}
                <Stack.Screen
                  name="TabNavigator"
                  component={TabNavigator}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
              {/* )} */}
            </NavigationContainer>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </AuthProvider>
    );
  }
}

registerRootComponent(App);
