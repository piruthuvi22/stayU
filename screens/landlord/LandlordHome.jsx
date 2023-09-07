import {
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Fab, Icon, Box, Center, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BrowseCard from './../../components/BrowseCard';
import env from '../../env';
import axios from 'axios';
import {useAuth} from '../../utilities/context';
import {RefreshControl} from 'react-native-gesture-handler';

const LandlordHome = ({navigation}) => {
  const {user} = useAuth();

  const [places, setPlaces] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const getPlaces = () => {
    setRefreshing(true);
    axios
      .get(env.api + '/places/get-uploaded-places', {
        params: {email: user?.email},
      })
      .then(res => {
        // console.log(res.data.length);
        if (res.data.length > 0) {
          setPlaces(res.data);
          setRefreshing(false);
        } else {
          setErrorMessage('Places not found');
          setRefreshing(false);
        }
      })
      .catch(err => {
        console.log(err);
        setErrorMessage('Something went wrong');
        setRefreshing(false);
      });
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     getPlaces();
  //   }, []),
  // );

  useEffect(() => getPlaces(), []);
  return (
    <>
      {refreshing ? (
        <Center flex={1}>
          <Text>Loading...</Text>
          <Button onPress={getPlaces} variant={'ghost'}>
            Try again
          </Button>
        </Center>
      ) : (
        <Box style={styles.wrapper}>
          {errorMessage !== '' ? (
            <Center style={styles.errorContainer}>
              <Text style={styles.head}>{errorMessage}</Text>
              <Button onPress={getPlaces} variant={'ghost'}>
                Try again
              </Button>
              <Fab
                renderInPortal={false}
                style={styles.fabBtn}
                onPress={() => navigation.navigate('add-home')}
                shadow={2}
                size="sm"
                icon={
                  <Icon color="#FF4E83" as={AntDesign} name="plus" size="sm" />
                }
              />
            </Center>
          ) : (
            <>
              <Box m={3}>
                <Text style={styles.head}>Your places</Text>
              </Box>
              <Box
                style={{
                  // width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height - 120,
                }}
                mb={3}
                mx={2}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={getPlaces}
                      colors={['#FF4E83', '#fff']}
                      progressBackgroundColor={'#223343'}
                    />
                  }>
                  {places.map(place => (
                    <BrowseCard
                      key={place?._id}
                      Rating={place?.Rating}
                      PlaceTitle={place?.PlaceTitle}
                      PlaceDescription={place?.PlaceDescription}
                      ImageUrl={place?.ImageUrl}
                      Facilities={{
                        WashRoomType: place?.Facilities?.WashRoomType,
                        Facilities: place?.Facilities?.Facilities,
                        OfferingMeals: place?.Facilities?.OfferingMeals,
                        NoOfBeds: place?.Facilities?.NoOfBeds,
                        Payment: place?.Facilities?.Payment,
                        RoomType: place?.Facilities?.RoomType,
                      }}
                      Cost={place?.Cost}
                      navigation={navigation}
                      status={place?.status}
                      _id={place?._id}
                    />
                  ))}
                </ScrollView>

                <Fab
                  renderInPortal={false}
                  style={styles.fabBtn}
                  onPress={() => navigation.navigate('add-home')}
                  shadow={2}
                  size="sm"
                  icon={
                    <Icon
                      color="#FF4E83"
                      as={AntDesign}
                      name="plus"
                      size="sm"
                    />
                  }
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default LandlordHome;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    fontFamily: 'Poppins-Regular',
    fontSize: 24,
    color: '#5C5A6F',
  },
  wrapper: {
    position: 'relative',
    top: StatusBar.currentHeight,
    backgroundColor: '#eee',
    height: Dimensions.get('window').height,
    paddingBottom: 60,
  },
  fab: {
    // position: 'absolute',
    // bottom: 30,
    // right: 10,
  },
  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FF4E83',
  },
});
