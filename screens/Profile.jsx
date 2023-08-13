import React, { useContext } from "react";
import { Button, Center, Text } from "native-base";
import * as geolib from "geolib";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../context";

const Profile = () => {
  const { signOut } = useContext(AuthContext);
  const coord = [
    {
      // katubedda
      latitude: 6.797426,
      longitude: 79.888844,
    },
    {
      // moratuwa
      latitude: 6.804591,
      longitude: 79.88668,
    },
    {
      latitude: 6.809425,
      longitude: 79.883188,
    },
    {
      latitude: 6.812706,
      longitude: 79.880858,
    },
    {
      latitude: 6.815987,
      longitude: 79.878528,
    },
    {
      latitude: 6.815956,
      longitude: 79.877055,
    },
    {
      // near to uni
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

    let v = geolib.isPointWithinRadius(coord[6], base, 200);

    let near = geolib.findNearest(base, coord);
    console.log(v);
  };
  return (
    <Center h={"full"}>
      <Text>Profile</Text>
      {/* <Button onPress={signOut}>Logout</Button> */}
      <Button onPress={handleFindNearest}>Find</Button>
    </Center>
  );
};

export default Profile;
