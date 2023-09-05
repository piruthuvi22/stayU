import React, {useEffect, useState, useCallback} from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {Box, HStack, Image, Row, Column, Badge, Pressable} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Client} from '@googlemaps/google-maps-services-js';
import Constants from 'expo-constants';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../utilities/context';
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import axios from 'axios';
import env from '../env';

const BrowseCard = ({
  navigation,
  Rating,
  PlaceTitle,
  PlaceDescription,
  Facilities,
  Cost,
  Coordinates,
  uniLocation,
  status,
  _id,
}) => {
  // const {user, userRole} = useAuth();
  const [distTime, setDistTime] = useState([]);

  const [availableNotification, setAvailableNotification] = useState(false);
  const {user} = useAuth();

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

  const availableNotificationHandler = () => {
    axios
      .get(env.api + '/reservation/getAvailableNotification', {
        params: {email: user?.email, placeId: _id},
      })
      .then(res => {
        setAvailableNotification(res.data);
      })
      .catch(err => {
        console.log('Browse Card Axios Error: ', err);
      });
  };

  useEffect(() => {
    getUserRole();
    availableNotificationHandler();
    const client = new Client({});

    const calculateDistance = async () => {
      try {
        let response = await client.distancematrix({
          params: {
            key: 'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc',
            origins: [uniLocation],
            destinations: [
              {
                latitude: Coordinates.Latitude,
                longitude: Coordinates.Longitude,
              },
            ],
            mode: 'walking',
            language: 'en',
            units: 'metric',
          },
        });

        //
        // geolib.getDistance(
        //   baseCoord,
        //   {
        //     latitude: res.Coordinates.Latitude,
        //     longitude: res.Coordinates.Longitude,
        //   },
        //   0.1,
        // ),
        setDistTime([
          response.data?.rows[0].elements[0].distance.text,
          response.data?.rows[0].elements[0].duration.text,
        ]);
      } catch (error) {
        throw new Error(error);
      }
    };
    uniLocation && calculateDistance();
  }, [uniLocation ? uniLocation : null, _id]);

  return (
    <Box style={styles.card} w="full" my={1} borderRadius={3}>
      <Pressable
        onPress={() =>
          navigation.navigate('Details', {
            _id,
            PlaceTitle,
            PlaceDescription,
            Cost,
            Rating,
            Facilities,
            Coordinates,
            uniLocation,
            status,
            userRole,
          })
        }>
        <Row>
          <Box h={150} w={'40%'} py={2}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Details', {
                  _id,
                  PlaceTitle,
                  Cost,
                  Rating,
                  Facilities,
                  PlaceDescription,
                  status,
                  uniLocation,
                  userRole,
                })
              }>
              <Image
                source={{
                  uri: 'https://www.travelanddestinations.com/wp-content/uploads/2017/10/hostel-room-pixabay-182965_1280.jpg',
                }}
                alt="room1"
                h={'full'}
                w={'full'}
              />
            </TouchableOpacity>
          </Box>
          <Row justifyContent={'space-between'} style={{width: '60%'}} py={2}>
            <Column marginX={1}>
              <Text style={styles.title}>{PlaceTitle}</Text>
              <Text style={styles.cost}>Rs.{Cost}</Text>
              <Text style={styles.km}>
                {distTime.length > 0 ? [distTime[0], '  ', distTime[1]] : ''}
                {distTime.length > 0 && (
                  <MaterialIcons
                    name="directions-walk"
                    size={14}
                    color="#aaa"
                  />
                )}
              </Text>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Row alignItems={'center'}>
                  {Facilities?.WashRoomType.includes('attached') && (
                    <Box pr={2}>
                      <FontAwesome name="bathtub" size={14} color="#aaa" />
                    </Box>
                  )}
                  {Facilities?.OfferingMeals && (
                    <Box pr={2}>
                      <MaterialIcons name="restaurant" size={14} color="#aaa" />
                    </Box>
                  )}
                  {Facilities?.NoOfBeds ? (
                    <>
                      <FontAwesome name="bed" size={14} color="#aaa" />
                      <Text style={styles.badge}>{Facilities?.NoOfBeds}</Text>
                    </>
                  ) : (
                    <Text style={styles.badge}>Badge</Text>
                  )}
                </Row>
              </HStack>
            </Column>

            <Badge
              colorScheme="warning"
              alignSelf=" flex-end"
              fontFamily={'Poppins-Regular'}
              style={{position: 'absolute', top: 10, right: 10}}>
              {Rating}
            </Badge>

            {userRole === 'landlord' &&
              (status === 'PENDING' ? (
                <HStack style={styles.pendingContainer}>
                  <Ionicons name="lock-open" size={24} color="#a0044d" />
                  <Text
                    style={{
                      marginTop: 6,
                      color: '#a0044d',
                      fontWeight: 'bold',
                    }}>
                    PENDING
                  </Text>
                </HStack>
              ) : (
                status === 'RESERVED' && (
                  <HStack style={styles.pendingContainer}>
                    <Ionicons
                      name="ios-lock-closed"
                      size={24}
                      color="#a0044d"
                    />
                    <Text
                      style={{
                        marginTop: 6,
                        color: '#a0044d',
                        fontWeight: 'bold',
                      }}>
                      RESERVED
                    </Text>
                  </HStack>
                )
              ))}
            {userRole === 'student' &&
              (availableNotification ? (
                <HStack style={styles.pendingContainer}>
                  <MaterialCommunityIcons
                    name="sticker-check"
                    size={24}
                    color="#04a256"
                  />
                </HStack>
              ) : status === 'RESERVED' ? (
                <HStack style={styles.pendingContainer}>
                  <Ionicons name="ios-lock-closed" size={24} color="#a0044d" />
                </HStack>
              ) : (
                status === 'PENDING' && (
                  <HStack style={styles.pendingContainer}>
                    <Ionicons name="lock-open" size={24} color="#a0044d" />
                  </HStack>
                )
              ))}
          </Row>
        </Row>
      </Pressable>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    // width: "100%",
    backgroundColor: '#fff',
  },

  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#223343',
  },
  desc: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#223343',
  },
  cost: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#223343',
  },
  km: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#888',
  },
  badge: {
    fontFamily: 'Poppins-Regular',
    color: '#aaa',
    paddingHorizontal: 2,
  },
  pendingContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default BrowseCard;
