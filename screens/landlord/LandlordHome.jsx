import {StyleSheet, Text, ScrollView} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Fab, Icon, Box, Center} from 'native-base';
import {AntDesign} from '@expo/vector-icons';
import BrowseCard from './../../components/BrowseCard';
import env from '../../env';
import axios from 'axios';
import Constants from 'expo-constants';
import {useAuth} from '../../utilities/context';

const LandlordHome = ({navigation}) => {
  const {user} = useAuth();
  const [places, setPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const getPlaces = () => {
    axios
      .get(env.api + '/places/get-uploaded-places', {
        params: {email: user?.email},
      })
      .then(res => {
        console.log('places:', res.data);
        if (res.data.length > 0) {
          setPlaces(res.data);
        } else {
          setErrorMessage('Places not found');
        }
      })
      .catch(err => {
        setErrorMessage('Something went wrong');
      });
  };
  useFocusEffect(
    useCallback(() => {
      getPlaces();
      return () => {
        // Code to clean up when the screen loses focus (optional)
        console.log('Screen has lost focus');
      };
    }, []),
  );
  return (
    <Box style={styles.wrapper}>
      {errorMessage !== '' ? (
        <Center style={styles.errorContainer}>
          <Text style={styles.head}>{errorMessage}</Text>
        </Center>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 70}}
          mx={3}>
          {places.map(place => (
            <BrowseCard
              key={place._id}
              Rating={place.Rating}
              PlaceTitle={place.PlaceTitle}
              PlaceDescription={place.PlaceDescription}
              Facilities={{
                WashRoomType: place.Facilities.WashRoomType,
                Facilities: place.Facilities.Facilities,
                OfferingMeals: place.Facilities.OfferingMeals,
                NoOfBeds: place.Facilities.NoOfBeds,
                Payment: place.Facilities.Payment,
                RoomType: place.Facilities.RoomType,
              }}
              Cost={place.Cost}
              navigation={navigation}
              status={place.status}
            />
          ))}
        </ScrollView>
      )}
      <Box style={styles.fab}>
        <Fab
          renderInPortal={false}
          style={styles.fabBtn}
          onPress={() => navigation.navigate('add-home')}
          shadow={2}
          size="sm"
          icon={<Icon color="#FF4E83" as={AntDesign} name="plus" size="sm" />}
        />
      </Box>
    </Box>
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
    fontSize: 16,
    color: '#5C5A6F',
  },
  wrapper: {
    position: 'relative',
    backgroundColor: '#eee',
    height: '100%',
    width: '100%',
    paddingHorizontal: 7,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FF754E',
  },
});
