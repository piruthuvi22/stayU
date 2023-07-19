import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Center,
  HStack,
  Pressable,
  ScrollView,
  Text,
  useDisclose,
} from "native-base";
import * as Location from "expo-location";
import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios";
import Constants from "expo-constants";
import { RefreshControl, StyleSheet, Dimensions } from "react-native";
import BrowseCard from "../components/BrowseCard";
import BrowserSkelton from "../components/core/SkeltonBrowser";
import { findAddress, findLocation } from "../components/findLocation";
import { FontAwesome } from "@expo/vector-icons";
import env from "../env";

const client = new Client({});
const WishList = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [places, setPlaces] = useState([]);

  const fetchWishlist = async () => {
    setRefreshing(true);
    try {
      console.log("fetching wishlist");
      let res = await axios.get(env.api + "/wish-list/get-wishlist");
      setPlaces(res.data);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);

    }
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
            colors={["#FF754E", "#fff"]}
            progressBackgroundColor={"#223343"}
          />
        }
      >
        {places.map((place) => (
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

  return (
    <Box style={styles.wrapper}>
      {refreshing ? (
               <BrowserSkelton />

      ) : places.length > 0 ? (
        <>{renderPlaceCard()}</>
      ) : (
        <Center height={"full"}>
          <Text style={styles.head}>No WishList</Text>
        </Center>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    top: Constants.statusBarHeight,
    // bottom: -100,
    backgroundColor: "#eee",
    // paddingBottom: 70,
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
});

export default WishList;
