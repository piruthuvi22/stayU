import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Constants from "expo-constants";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import AutoComplete from "./components/AutoComplete";
const { width, height } = Dimensions.get("window");

const aspectRatio = width / height;
const latitudeDelta = 6;
const longitudeDelta = latitudeDelta * aspectRatio;

const initialPosition = {
  latitude: 7.873592,
  longitude: 80.773137,
  latitudeDelta: latitudeDelta,
  longitudeDelta: longitudeDelta,
};

export default MapView = () => {
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  const mapRef = useRef("");

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };
  const handlePlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };

  console.log("origin : ", origin);
  console.log("destination : ", destination);
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialPosition}
        showsCompass={true}
      >
        {origin.hasOwnProperty("latitude") ? (
          <Marker coordinate={origin} />
        ) : null}

        {destination.hasOwnProperty("latitude") ? (
          <Marker coordinate={destination} />
        ) : null}

        {origin.hasOwnProperty("latitude") &&
          destination.hasOwnProperty("latitude") && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={"AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc"}
              strokeColor={"#fff"}
              strokeWidth={4}
            />
          )}
      </MapView>
      <View style={styles.searchContainer}>
        <AutoComplete
          label={"From"}
          onPlaceSelected={(details) => {
            handlePlaceSelected(details, "origin");
          }}
        />
        <AutoComplete
          label={"To"}
          onPlaceSelected={(details) => {
            handlePlaceSelected(details, "destination");
          }}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "#eee",
    shadowColor: "#333",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 5,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    // borderColor: "red",
    // borderWidth: 2,
  },
});
