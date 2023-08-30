import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

import { Box, Text, HStack, ScrollView } from "native-base";
import { StyleSheet,  StatusBar, } from "react-native";
// import Constants from "expo-constants";
import { Client } from "@googlemaps/google-maps-services-js";

import { Feather } from "@expo/vector-icons";
import RoomCard from "../components/RoomCard";
import { findAddress, findLocation } from "../components/findLocation";

const client = new Client({});

const Home = () => {
  const [location, setLocation] = useState(null);
  const [uniName, setUniName] = useState("");

  useEffect(() => {
    console.log("Home.jsx mounted");
    findLocation().then((res) => {
      // setLocation(res.lantlong);
      findAddress(res.lantlong).then((res) => setUniName(res.uniName));
    });
  }, []);

  return (
    <Box style={styles.wrapper}>
      <HStack margin={3} alignItems="center">
        {/* <Text style={styles.head}>Current Location </Text> */}
        <Text style={styles.currentLocation}>{uniName} </Text>
        {/* <Pressable android_ripple={{ color: "#ccc", borderless: true }}>
          <Feather name="chevron-down" size={24} color="#A0A0A0" />
        </Pressable> */}
      </HStack>
      <Text margin={3} style={styles.popular}>
        Popular places near to you
      </Text>
      <ScrollView margin={3} showsVerticalScrollIndicator={false}>
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    top: StatusBar.currentHeight,
    backgroundColor: "#eee",
  },
  head: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#5C5A6F",
  },
  currentLocation: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#A0A0A0",
  },
  popular: {
    fontFamily: "Poppins-Bold",
    // color: "#A0A0A0",
  },
});

export default Home;
