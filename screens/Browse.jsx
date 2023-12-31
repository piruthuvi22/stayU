import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  Button,
  RefreshControl,
  StatusBar,
} from 'react-native';
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
  Center,
  VStack,
  Stack,
  Button as NBButton,
  IconButton,
} from 'native-base';
// import Constants from 'expo-constants';
import BrowseCard from '../components/BrowseCard';
import AutoComplete from '../components/AutoComplete';

import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import axios from 'axios';
import {findAddress} from '../functions/findAddress';
import BrowserSkelton from '../components/core/SkeltonBrowser';
import Filters from '../components/Filters';

import env from '../env';
import showToast from '../components/core/toast';
import {getLocation, useLocation} from '../hooks/useLocation';

const Browse = ({navigation}) => {
  // States
  const [refreshing, setRefreshing] = useState(true);
  const [uniName, setUniName] = useState(null);
  const [places, setPlaces] = useState([]);
  const [coordinate, setCoordinate] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  // Hooks
  const {isOpen, onOpen, onClose} = useDisclose();
  const toast = useToast();
  const {location, updateLocation, error} = useLocation();

  const getAddress = async latlong => {
    try {
      let uniName = await findAddress(latlong);
      setUniName(uniName);
    } catch (error) {
      showToast(toast, 'error', error.message);
    }
    setRefreshing(false);
  };

  const fetchPlaces = async () => {
    if (location?.latitude) {
      setRefreshing(true);
      try {
        let res = await axios.get(env.api + '/places/get-places', {
          params: {location},
        });
        if (res.status === 200) {
          // console.log('res.data.length = ', res.data.length);
          setStatusCode(res.status);
          setPlaces(res.data);
        }
      } catch (error) {
        console.log('Error axios: ', error);
        if (error.isAxiosError && error.response === undefined) {
          showToast(toast, 'error', error.message);
        } else {
          setStatusCode(error.response.status);
          if (error.response.status === 404) {
            showToast(toast, 'error', error.response.data.message);
          }
          if (error.response.status === 500) {
            showToast(toast, 'error', error.message);
          }
        }
      }
    }
    setRefreshing(false);
  };

  useEffect(() => {
    // console.log('Use 1', location, coordinate);
    if (location?.latitude) {
      setCoordinate(location);
      getAddress(location);
    }
  }, [location]);

  useEffect(() => {
    if (coordinate?.latitude) {
      getAddress(coordinate);
    }
  }, [coordinate]);

  useEffect(() => {
    // console.log('Use 2');
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
        selectedPlaceCoord: coordinate.hasOwnProperty('latitude')
          ? coordinate
          : {},
        selectedPlaceName: uniName,
      });
    }
  };

  const handlePlaceSelected = details => {
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    setCoordinate(position);
    // setUniLocation(position);
    setUniName(details?.name);
  };

  const onRefresh = useCallback(() => {
    updateLocation();
  }, []);

  const renderPlaceCard = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        mx={2}
        refreshControl={
          <RefreshControl
            style={{zIndex: 500}}
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF4E83', '#fff']}
            progressBackgroundColor={'#223343'}
          />
        }>
        {places.map(place => (
          <BrowseCard
            key={place._id}
            {...place}
            uniLocation={coordinate}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    );
  };

  // console.log(location);
  return (
    <>
      {refreshing ? (
        <BrowserSkelton />
      ) : statusCode == 200 ? (
        <Box style={styles.wrapper}>
          <Box style={{height: 110}} marginX={2}>
            <HStack
              paddingTop={3}
              alignItems="center"
              justifyContent={'space-between'}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: '#A0A0A0',
                }}>
                {uniName}
              </Text>
              <Pressable
                android_ripple={{color: '#ccc', borderless: true, radius: 30}}
                onPress={updateLocation}>
                <MaterialIcons name="gps-fixed" size={24} color="#A0A0A0" />
              </Pressable>
              {/* Filter button commented */}

              {/* <HStack width={'20'} justifyContent={'space-between'}>
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
              </HStack> */}
            </HStack>
            <Box style={{zIndex: 20}}>
              <Box style={styles.searchContainer}>
                <AutoComplete
                  label={'University'}
                  onPlaceSelected={details => handlePlaceSelected(details)}
                />
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height - 110 - 60,
              // marginBottom: 70,
            }}>
            {renderPlaceCard()}
            <Fab
              renderInPortal={false}
              onPress={passToMaps}
              style={styles.fabBtn}
              shadow={3}
              placement="bottom-right"
              icon={
                <Icon color="#FF4E83" as={Entypo} name="location" size="19" />
              }
            />
          </Box>

          {/* <Box style={styles.fab}>
         
          </Box> */}

          {/* <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content bgColor={'rgba(34, 51, 67,0.95)'}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}> */}
          <Filters isOpen={isOpen} onClose={onClose} />
          {/* </ScrollView>
          </Actionsheet.Content>
        </Actionsheet> */}
        </Box>
      ) : statusCode === 500 ? (
        <Box h="full" style={styles.wrapper}>
          <Center h="full">
            <Text style={styles.error}>Request failed</Text>
            <NBButton onPress={onRefresh} variant={'ghost'}>
              Try again
            </NBButton>
          </Center>
        </Box>
      ) : statusCode === 404 ? (
        <Box h="full" style={styles.wrapper}>
          <Center h="full">
            <Text style={styles.error}>Places not found</Text>
            <NBButton onPress={onRefresh} variant={'ghost'}>
              Try again
            </NBButton>
          </Center>
        </Box>
      ) : (
        <Box h="full" style={styles.wrapper}>
          <Center h="full">
            <Text style={styles.error}>{statusCode}</Text>
            <Text style={styles.error}>Something went wrong</Text>
            <NBButton onPress={onRefresh} variant={'ghost'}>
              Try again
            </NBButton>
          </Center>
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // position: 'relative',
    top: StatusBar.currentHeight,
    // backgroundColor: '#eee',
    // paddingBottom: 60,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    // backgroundColor: '#eee',
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
    // position: 'absolute',
    // bottom: 50,
    // right: 10,
  },
  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FD683D',
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
  error: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#5C5A6F',
  },
});

export default Browse;
