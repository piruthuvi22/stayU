import 'react-native-gesture-handler';
import './ignoreWarning';
// import {registerRootComponent} from 'expo';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, NativeBaseProvider, Pressable} from 'native-base';
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
// import ImageViewer from './components/ImageViewer';
import {Reserved} from './screens/Reserved';

// ===============Imports Icons==============
import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocationPicker} from './components/LocationPicker';

export default function App() {
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
            <ExpoStatusBar
              // animated={true}
              // showHideTransition={'slide'}
              networkActivityIndicatorVisible={false}
            />
            <NavigationContainer>
              <Stack.Navigator initialRouteName="TabNavigator" id="stack">
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

// registerRootComponent(App);

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

      {/* Location picker test purpose */}

      <Tab.Screen
        name="LocationPicker"
        component={LocationPicker}
        options={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FF4E83',
            height: 60,
            display: 'none',
          },
          tabBarIcon: () => (
            <MaterialIcons name="add-location-alt" size={24} color="white" />
          ),
          tabBarItemStyle: {
            marginBottom: 2,
            borderBottomWidth: 2,
            borderBottomColor: '#fff',
            borderRadius: 10,
          },
          tabBarLabel: 'Picker',
          tabBarLabelStyle: {color: 'white', fontSize: 14},
        }}
      />
    </Tab.Navigator>
  );
};
