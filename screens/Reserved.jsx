import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  Dimensions,
  Text,
  StatusBar,
} from 'react-native';
import {
  Box,
  Center,
  Button as NBButton,
  ScrollView,
  useToast,
} from 'native-base';
import axios from 'axios';
// import Constants from 'expo-constants';

// Components
import BrowseCard from '../components/BrowseCard';
import BrowserSkelton from '../components/core/SkeltonBrowser';

// Other imports
import env from '../env';
import showToast from '../components/core/toast';

export const Reserved = ({navigation}) => {
  // States
  const [refreshing, setRefreshing] = useState(true);
  const [place, setPlace] = useState([]);
  const [statusCode, setStatusCode] = useState(null);

  // Hooks
  const toast = useToast();

  const fetchReserved = async () => {
    setRefreshing(true);
    try {
      let res = await axios.get(env.api + '/reservation/get-reservation', {
        params: {
          userId: 'user1',
        },
      });
      if (res.status === 200) {
        // console.log('*', res.data);
        setStatusCode(res.status);
        setPlace(res.data);
      }
    } catch (error) {
      // console.log('**');
      console.log('Error axios: ', error);
      if (error.isAxiosError && error.response === undefined) {
        showToast(toast, 'error', error.message);
      } else {
        setStatusCode(error.response.status);
        if (error.response.status === 404) {
          showToast(toast, 'error', error.response.data);
        }
        if (error.response.status === 500) {
          showToast(toast, 'error', error.message);
        }
      }
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReserved();
  }, []);

  const onRefresh = useCallback(() => {
    fetchReserved();
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
        <BrowseCard
          key={place._id}
          {...place}
          // uniLocation={uniLocation}
          navigation={navigation}
        />
      </ScrollView>
    );
  };

  return (
    <>
      {refreshing ? (
        <BrowserSkelton />
      ) : statusCode == 200 ? (
        <Box style={styles.wrapper}>
          <Box m={3}>
            <Text style={styles.head}>Reserved places</Text>
          </Box>
          {renderPlaceCard()}
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
            <Text style={styles.error}>Wishlist is empty</Text>
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
    position: 'relative',
    top: StatusBar.currentHeight,
    backgroundColor: '#eee',
    height: Dimensions.get('window').height,
    paddingBottom: 60,
  },
  head: {
    fontFamily: 'Poppins-Regular',
    fontSize: 24,
    color: '#5C5A6F',
  },
  currentLocation: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#A0A0A0',
  },
  error: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
    color: '#5C5A6F',
  },
});
