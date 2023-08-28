import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Center,
  Button as NBButton,
  ScrollView,
  useDisclose,
} from 'native-base';
import * as Location from 'expo-location';
import {Client} from '@googlemaps/google-maps-services-js';
import axios from 'axios';
import Constants from 'expo-constants';
import {RefreshControl, StyleSheet, Dimensions, Text} from 'react-native';
import BrowseCard from '../components/BrowseCard';
import BrowserSkelton from '../components/core/SkeltonBrowser';
import {findAddress, findLocation} from '../components/findLocation';
import {FontAwesome} from '@expo/vector-icons';
import env from '../env';
import showToast from '../components/core/toast';

const client = new Client({});
const WishList = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(true);
  const [places, setPlaces] = useState([]);
  const [statusCode, setStatusCode] = useState(null);

  const fetchWishlist = async () => {
    setRefreshing(true);
    try {
      let res = await axios.get(env.api + '/wish-list/get-wishlist', {
        params: {
          userId: 'user2',
        },
      });
      console.log(res.status);
      setStatusCode(res.status);
      setPlaces(res.data);
    } catch (error) {
      console.log('Error axios: ', error.response.status);
      setStatusCode(error.response.status);
      if (error.response.status === 404) {
        console.log(error.response.data.message);
        console.log('*1');
        setRefreshing(false);
        showToast(toast, 'error', error.response.data.message);
      }
      if (error.response.status === 500) {
        showToast(toast, 'error', error.message);
      }
      console.log('*2');
      setRefreshing(false);
    }
    console.log('*3');
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const onRefresh = useCallback(() => {
    fetchWishlist();
  }, []);

  const renderPlaceCard = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
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
            // uniLocation={uniLocation}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    );
  };

  console.log('Refresh: ', refreshing);
  return (
    <>
      {refreshing ? (
        <BrowserSkelton />
      ) : statusCode == 200 ? (
        <Box style={styles.wrapper}>{renderPlaceCard()}</Box>
      ) : statusCode === 500 ? (
        <Box h="full" style={styles.wrapper}>
          <Center h="full">
            <Text style={{fontSize: 28, color: '#f00'}}>Request failed</Text>
            <NBButton onPress={onRefresh} variant={'ghost'}>
              Try again
            </NBButton>
          </Center>
        </Box>
      ) : statusCode === 404 ? (
        <Box h="full" style={styles.wrapper}>
          <Center h="full">
            {/* <Text style={{fontSize: 38, color: '#f00'}}>{errors}</Text> */}
            <Text style={{fontSize: 28, color: '#f00'}}>Wishlist is empty</Text>
            <NBButton onPress={onRefresh} variant={'ghost'}>
              Try again
            </NBButton>
          </Center>
        </Box>
      ) : (
        <Box h="full" style={styles.wrapper}>
          <Center h="full">
            <Text style={{fontSize: 28, color: '#f00'}}>{statusCode}</Text>
            <Text style={{fontSize: 28, color: '#f00'}}>
              Something went wrong
            </Text>
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
    position: 'relative',
    top: Constants.statusBarHeight,
    backgroundColor: '#eee',
    paddingBottom: 60,
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
});

export default WishList;
