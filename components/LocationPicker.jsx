import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  BackHandler,
  Text,
  // Image,
  View,
  StatusBar,
} from 'react-native';
import {
  Box,
  HStack,
  Fab,
  Icon,
  IconButton,
  Image as NBImage,
} from 'native-base';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
// import Constants from 'expo-constants';
const {width, height} = Dimensions.get('window');
import {Client} from '@googlemaps/google-maps-services-js';

import AutoComplete from '../components/AutoComplete';

import {MaterialIcons} from '@expo/vector-icons';
import {useLocation} from '../hooks/useLocation';
import {findAddress} from './findLocation';
import showToast from './core/toast';

const client = new Client({});

export const LocationPicker = ({navigation, route}) => {
  const aspectRatio = width / height;
  const latitudeDelta = 6;
  const longitudeDelta = latitudeDelta * aspectRatio;

  const initialPosition = {
    latitude: 7.873592,
    longitude: 80.773137,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  };

  const [coordinate, setCoordinate] = useState(null);
  const [locationName, setLocationName] = useState(null);

  // Hooks
  const mapRef = useRef(null);
  const {location, updateLocation, error} = useLocation();

  const zoomToFit = async coords => {
    // console.log(mapRef.current);
    const camera = await mapRef.current?.fitToCoordinates([coords]);
    await mapRef.current?.animateCamera(camera, {duration: 1000});
  };

  useEffect(() => {
    // console.log('Use effect 1 = ', location);
    if (location) {
      setCoordinate(location);
      getAddress(location);
      zoomToFit(location);
    }
  }, [location]);

  // useEffect(() => {
  //   const handleBackPress = () => {
  //     // Navigate to a specific route when the back button is pressed
  //     navigation.navigate('Browse');
  //     return true; // Return true to prevent the default behavior (e.g., exit the app)
  //   };

  //   // Add event listener for the hardware back button press
  //   BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //   };
  // }, []);

  const getAddress = async latlong => {
    try {
      let name = await findAddress(latlong);
      // console.log('Name = ', name);
      setLocationName(name);
    } catch (error) {
      console.log('Error = ', error.message);
      // showToast(toast, 'error', error.message);
    }
  };

  const handlePick = async e => {
    setCoordinate(e.nativeEvent.coordinate);
    getAddress(e.nativeEvent.coordinate);
    zoomToFit(e.nativeEvent.coordinate);
  };

  const locate = async => {
    updateLocation();
  };

  const handleSelect = () => {
    console.log('Selected location = ', coordinate, locationName);
    navigation.navigate('add-home', {location: coordinate, locationName});
  };

  return (
    <Box style={styles.wrapper}>
      <Box style={styles.bottomWrapper} mx={2}>
        <HStack alignItems="center" justifyContent="space-between" h="full">
          <Text fontSize="lg" fontWeight="bold" mr={2}>
            {locationName ? locationName : 'Select a location'}
          </Text>
          <IconButton
            icon={<Icon as={MaterialIcons} name="done" color="#FF4E83" />}
            borderRadius="full"
            size={'lg'}
            style={styles.fabBtn}
            onPress={handleSelect}
          />
        </HStack>
      </Box>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialPosition}
        showsUserLocation={true}
        // showsMyLocationButton={true}
        // showsCompass={true}
        loadingEnabled={true}
        // mapPadding={{top: 50, right: 50, bottom: 50, left: 50}}
        // onDoublePress={() => console.log('Double Pressed')}
        // onPanDrag={handlePanDrag}
        onMarkerDragEnd={handlePick}
        onPress={handlePick}
        // onRegionChangeComplete={e => console.log('Region Changed', e)}

        // rotateEnabled={false}
      >
        {/* Map Markers */}
        {coordinate && (
          <Marker
            draggable
            coordinate={coordinate}
            // onDragEnd={handlePick}
          />
        )}
      </MapView>
      {/* <Box style={styles.markerFixed} m="0" p="0">
        <NBImage
          style={styles.marker}
          // source={{
          //   uri: 'https://freeiconshop.com/wp-content/uploads/edd/plus-circle-outline.png',
          // }}
          source={require('../assets/images/pick.png')}
          alt="Marker"
        />
      </Box> */}

      <Fab
        renderInPortal={false}
        onPress={locate}
        style={styles.fabBtn}
        shadow={3}
        placement="bottom-right"
        icon={
          <Icon color="#FF4E83" as={MaterialIcons} name="gps-fixed" size="19" />
        }
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    top: StatusBar.currentHeight,
    backgroundColor: '#fff',
    height: Dimensions.get('window').height,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60,
  },
  bottomWrapper: {
    height: 60,
    // backgroundColor: '#eae',
  },
  markerFixed: {
    position: 'absolute',
    // left: '50%',
    right: Dimensions.get('window').width / 2,
    // top: '50%',
    bottom: (Dimensions.get('window').height - 60) / 2,
    // marginLeft: -24,
    // marginTop: -48,
    // zIndex: 999,
  },
  marker: {
    height: 20,
    width: 20,
    // zIndex: 9,
  },
  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FD683D',
  },
});
