import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {Box, HStack, Image, Row, Column, Badge, Pressable} from 'native-base';
import {Client} from '@googlemaps/google-maps-services-js';
import Constants from 'expo-constants';

import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import axios from 'axios';

const BrowseCard = ({
  navigation,
  Rating,
  PlaceTitle,
  PlaceDescription,
  Facilities,
  Cost,
  Coordinates,
  uniLocation,
  _id,
}) => {
  const [distTime, setDistTime] = useState([]);

  useEffect(() => {
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
  }, [uniLocation ? uniLocation : null]);

  return (
    <Box style={styles.card} w="full" my={1} borderRadius={3}>
      <Pressable
        onPress={() =>
          navigation.navigate('Details', {
            _id,
            PlaceTitle,
            Cost,
            Rating,
            Facilities,
            uniLocation,
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
                  uniLocation,
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
              </Text>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Row alignItems={'center'}>
                  {Facilities?.WashRoomType.includes('Attached') && (
                    <Box pr={2}>
                      <FontAwesome name="bathtub" size={18} color="#aaa" />
                    </Box>
                  )}
                  {Facilities?.OfferingMeals && (
                    <Box pr={2}>
                      <MaterialIcons name="restaurant" size={18} color="#aaa" />
                    </Box>
                  )}
                  {Facilities?.NoOfBeds ? (
                    <>
                      <FontAwesome name="bed" size={18} color="#aaa" />
                      <Text style={styles.badge}>{Facilities?.NoOfBeds}</Text>
                    </>
                  ) : (
                    <Text style={styles.badge}>Badge</Text>
                  )}
                </Row>
              </HStack>
            </Column>
            <Box w="20%">
              <Badge
                colorScheme="warning"
                alignSelf="center"
                fontFamily={'Poppins-Regular'}>
                {Rating}
              </Badge>
            </Box>
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
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#223343',
  },
  desc: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#223343',
  },
  cost: {
    fontFamily: 'Poppins-Bold',
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
});

export default BrowseCard;
