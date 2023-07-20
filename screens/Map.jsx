import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, BackHandler} from 'react-native';
import {Box, Text, HStack, Pressable} from 'native-base';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Constants from 'expo-constants';
const {width, height} = Dimensions.get('window');
import {Client} from '@googlemaps/google-maps-services-js';

import AutoComplete from '../components/AutoComplete';

import {Entypo} from '@expo/vector-icons';

const aspectRatio = width / height;
const latitudeDelta = 6;
const longitudeDelta = latitudeDelta * aspectRatio;

const initialPosition = {
  latitude: 7.873592,
  longitude: 80.773137,
  latitudeDelta: latitudeDelta,
  longitudeDelta: longitudeDelta,
};
const client = new Client({});

const Map = ({navigation, route}) => {
  const {placeInfo, selectedPlaceCoord, selectedPlaceName} = route.params;

  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedUniName, setSelectedUniName] = useState('');
  const [distance, setDistance] = useState({});
  const [selectedMarker, setSelectedMarker] = useState({});
  const [isChoose, setIsChoose] = useState(false);

  const mapRef = useRef(null);

  const zoomToFit = async () => {
    // console.log(mapRef.current);
    const camera = await mapRef.current?.fitToCoordinates([
      ...placeInfo,
      selectedPlaceCoord,
    ]);
    console.log('camera', camera);
    await mapRef.current?.animateCamera(camera, {duration: 1000});
  };

  useEffect(() => {
    setIsChoose(false);
    zoomToFit();
    (async () => {
      // moveTo(placeIfo);
      selectedPlaceCoord.hasOwnProperty('latitude') &&
        (await client
          .distancematrix({
            params: {
              key: 'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc',
              origins: [selectedPlaceCoord],
              destinations: placeInfo,
            },
          })
          .then(r => {
            setDistance(r.data);
            // console.log("Distance setted");
          })
          .catch(e => {
            console.log('e', e);
          }));
    })();
  }, [selectedPlaceCoord, placeInfo]);

  useEffect(() => {
    const handleBackPress = () => {
      // Navigate to a specific route when the back button is pressed
      navigation.navigate('Browse');
      return true; // Return true to prevent the default behavior (e.g., exit the app)
    };

    // Add event listener for the hardware back button press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const handlePlaceSelected = async details => {
    // console.log("placeInfo", placeInfo);
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    // console.log("Dis==", position);
    setIsChoose(true);
    setSelectedLocation(position);
    setSelectedUniName(details?.name);

    selectedLocation.hasOwnProperty('latitude') &&
      client
        .distancematrix({
          params: {
            key: 'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc',
            origins: [position],
            destinations: placeInfo,
          },
        })
        .then(r => {
          setDistance(r.data);
          console.log('Distance setted2', r.data);
        })
        .catch(e => {
          console.log('e', e);
        });

    const camera = mapRef.current?.fitToCoordinates([...placeInfo, position]);
    mapRef.current?.animateCamera(camera, {duration: 1000});
  };
  // console.log("================================", distance);

  return (
    <Box style={styles.wrapper}>
      <HStack
        marginX={3}
        marginTop={3}
        alignItems="center"
        justifyContent={'space-between'}>
        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>
          {isChoose ? selectedUniName : selectedPlaceName}
        </Text>
        <Pressable
          android_ripple={{color: '#ccc', borderless: true, radius: 20}}
          onPress={() => navigation.navigate('Browse')}>
          <Entypo name="circle-with-cross" size={24} color="#A0A0A0" />
        </Pressable>
      </HStack>

      <Box m={2}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          // initialRegion={initialPosition}
          // showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          loadingEnabled={true}
          mapPadding={{top: 50, right: 50, bottom: 50, left: 50}}>
          {isChoose && selectedLocation.hasOwnProperty('latitude') ? (
            <Marker
              coordinate={selectedLocation}
              key={selectedLocation.latitude}
              // title={marker.title}
              // description="desc"
              pinColor="#FD683D"
              flat={true}
              style={{width: 5, height: 5}}
              onPress={() => console.log('marker')}
            />
          ) : (
            selectedPlaceCoord.hasOwnProperty('latitude') && (
              <Marker
                coordinate={selectedPlaceCoord}
                key={selectedPlaceCoord.latitude}
                // title={marker.title}
                // description="desc"
                pinColor="#FD683D"
                flat={true}
                style={{width: 5, height: 5}}
                onPress={() => console.log('marker')}
              />
            )
          )}
          {placeInfo.map((marker, i) => {
            return marker.hasOwnProperty('latitude') ? (
              <Marker
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                key={marker.latitude}
                title={placeInfo[i].title}
                description={
                  distance.hasOwnProperty('destination_addresses')
                    ? distance?.rows[0].elements[i].distance.text +
                      ' | ' +
                      distance?.rows[0].elements[i].duration.text
                    : ''
                }
                pinColor="#0000ff"
                flat={true}
                style={{width: 2, height: 2}}
                icon={require('../assets/images/marker2.png')}
                onPress={() => setSelectedMarker(marker)}
              />
            ) : null;
          })}
          {selectedMarker.hasOwnProperty('latitude') && (
            <MapViewDirections
              key={selectedMarker.latitude}
              origin={selectedMarker}
              destination={isChoose ? selectedLocation : selectedPlaceCoord}
              apikey={'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc'}
              strokeColor={'#FD683D'}
              strokeWidth={3}
            />
          )}
        </MapView>
        <Box style={styles.searchContainer}>
          <AutoComplete
            label={'University'}
            onPlaceSelected={details => {
              handlePlaceSelected(details);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    top: Constants.statusBarHeight,
    backgroundColor: '#eee',
  },

  fab: {
    position: 'absolute',
    bottom: 150,
    right: 20,
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
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#eee',
    padding: 5,
  },
  input: {
    // borderColor: "red",
    // borderWidth: 2,
  },
});

export default Map;

/**
 title={
distance.hasOwnProperty("destination_addresses")
                    ? markers[i].title + distance?.destination_addresses[i][0]
                    : ""
                }
                
 */