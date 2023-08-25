import React, {useContext} from 'react';
import {Button, Center, Text} from 'native-base';
import * as geolib from 'geolib';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context';

const Profile = () => {
  const {signOut} = useContext(AuthContext);
  const coord = [
    {
      // katubedda
      id:1,
      latitude: 6.797426,
      longitude: 79.888844,
    },
    {
      // moratuwa
      id:2,
      latitude: 6.804591,
      longitude: 79.88668,
    },
    {
      id:3,
      latitude: 6.809425,
      longitude: 79.883188,
    },
    {
      id:4,
      latitude: 6.812706,
      longitude: 79.880858,
    },
    {
      id:5,
      latitude: 6.815987,
      longitude: 79.878528,
    },
    {
      id:6,
      latitude: 6.815956,
      longitude: 79.877055,
    },
    {
      // near to uni
      id:7,
      latitude: 6.794725,
      longitude: 79.901398,
    },
  ];
  const base = {
    latitude: 6.7949753,
    longitude: 79.9003922,
  };
  const handleLogout = async () => {};
  const handleFindNearest = async () => {
    let v = geolib.orderByDistance(base, coord);
    // let v = geolib.isPointWithinRadius(coord[1], base, 200);

    // let near = geolib.findNearest(base, coord);

  };
  return (
    <Center h={'full'}>
      <Text>Profile</Text>
      {/* <Button onPress={signOut}>Logout</Button> */}
      <Button onPress={handleFindNearest}>Find</Button>
    </Center>
  );
};

export default Profile;
