import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Dimensions, Text, RefreshControl} from 'react-native';
import {
  Box,
  HStack,
  Pressable,
  ScrollView,
  Fab,
  Icon,
  Actionsheet,
  useDisclose,
  useToast,
} from 'native-base';
import Constants from 'expo-constants';
import {Client} from '@googlemaps/google-maps-services-js';
import BrowseCard from '../components/BrowseCard';
import AutoComplete from '../components/AutoComplete';

import {FontAwesome, Entypo, MaterialIcons} from '@expo/vector-icons';
import axios from 'axios';
import {findAddress, findLocation} from '../components/findLocation';
import BrowserSkelton from '../components/core/SkeltonBrowser';
import Filters from '../components/Filters';

import env from '../env';
import showToast from '../components/core/toast';
import {getLocation, useLocation} from '../hooks/useLocation';

const Browse = ({navigation}) => {
  // States
  const [refreshing, setRefreshing] = useState(false);
  const [uniName, setUniName] = useState(null);
  // const [uniLocation, setUniLocation] = useState({
  //   latitude: null,
  //   longitude: null,
  // });
  const [places, setPlaces] = useState([]);
  const {isOpen, onOpen, onClose} = useDisclose();

  // Hooks
  const toast = useToast();
  const {location, updateLocation, error} = useLocation();

  // const fetchLocationAndAddress = async () => {
  //   console.log('fetchLocationAndAddress');
  //   setRefreshing(true);
  //   let latlong;
  //   try {
  //     latlong = await findLocation();
  //     console.log(latlong);

  //     setUniLocation(latlong);
  //   } catch (error) {
  //     console.log(error);
  //     showToast(toast, 'error', error);
  //   }
  //   setRefreshing(false);
  // };

  const getAddress = async latlong => {
    try {
      let uniName = await findAddress(latlong);
      console.log(uniName);
      setUniName(uniName);
    } catch (error) {
      console.log(error);
      showToast(toast, 'error', error);
    }
    setRefreshing(false);
  };

  const fetchPlaces = async () => {
    console.log('Location', location);
    if (location?.latitude) {
      setRefreshing(true);
      try {
        let res = await axios.get(env.api + '/places/get-places', {
          params: {location},
        });
        if (res.status === 200) {
          // console.log(res.data.length);
          setPlaces(res.data);
        }
      } catch (error) {
        console.log('Error axios: ', error);
        showToast(toast, 'error', error.message);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // fetchLocationAndAddress();
    if (location?.latitude) getAddress(location);
  }, [location]);

  useEffect(() => {
    fetchPlaces();
  }, [location]);

  const passToMaps = () => {
    if (places.length !== 0) {
      let placeInfo = [];
      places.map(place => {
        placeInfo.push({
          latitude: Number(place.Coordinates.Latitude),
          longitude: Number(place.Coordinates.Longitude),
          title: place.PlaceTitle,
        });
      });
      navigation.navigate('Map', {
        placeInfo,
        selectedPlaceCoord: location.hasOwnProperty('latitude') ? location : {},
        selectedPlaceName: uniName,
      });
    }
  };

  const handlePlaceSelected = details => {
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    setUniLocation(position);
    setUniName(details?.name);
  };

  const onRefresh = useCallback(() => {
    updateLocation();
    // fetchLocationAndAddress();
    // fetchPlaces();
  }, []);

  const renderPlaceCard = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginTop: 70}}
        mx={3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF754E', '#fff']}
            progressBackgroundColor={'#223343'}
          />
        }>
        {places.map(place => (
          <BrowseCard
            key={place._id}
            {...place}
            uniLocation={location}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    );
  };

  // console.log(places.length, uniLocation);
  return (
    <Box style={styles.wrapper}>
      {location?.latitude && places.length > 0 ? (
        <>
          <HStack
            marginX={3}
            marginTop={3}
            alignItems="center"
            justifyContent={'space-between'}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                color: '#A0A0A0',
              }}>
              {uniName}
            </Text>
            <HStack width={'20'} justifyContent={'space-between'}>
              <Pressable
                android_ripple={{color: '#ccc', borderless: true, radius: 30}}
                onPress={updateLocation}>
                <MaterialIcons name="gps-fixed" size={24} color="#A0A0A0" />
              </Pressable>
              <Pressable
                android_ripple={{color: '#ccc', borderless: true, radius: 30}}
                onPress={onOpen}>
                <FontAwesome name="bars" size={24} color="#A0A0A0" />
              </Pressable>
            </HStack>
          </HStack>
          <Box style={{zIndex: 20}} m={2}>
            <Box style={styles.searchContainer}>
              <AutoComplete
                label={'University'}
                onPlaceSelected={details => handlePlaceSelected(details)}
              />
            </Box>
          </Box>
          {renderPlaceCard()}
          <Box style={styles.fab}>
            <Fab
              renderInPortal={false}
              onPress={passToMaps}
              style={styles.fabBtn}
              shadow={3}
              placement="bottom-right"
              icon={
                <Icon color="#FF754E" as={Entypo} name="location" size="19" />
              }
            />
          </Box>

          {/* <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content bgColor={'rgba(34, 51, 67,0.95)'}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{width: '100%'}}> */}
                <Filters isOpen={isOpen} onClose={onClose}/>
              {/* </ScrollView>
            </Actionsheet.Content>
          </Actionsheet> */}
        </>
      ) : (
        <BrowserSkelton />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    top: Constants.statusBarHeight,
    backgroundColor: '#eee',
    paddingBottom: 60,
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#eee',
    padding: 5,
    // height: 50,
    // zIndex: 3000,
  },
  head: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#5C5A6F',
  },
  currentLocation: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#A0A0A0',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 10,
  },
  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FF754E',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  categoryTitle: {
    fontSize: 20,
    color: '#FD683D',
    fontFamily: 'Poppins-Medium',
  },
  slideVal: {
    color: '#737373',
    fontFamily: 'Poppins-Medium',
  },
  filterValues: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});

export default Browse;
