import * as Location from "expo-location";

export const findLocation = async () => {
  let data = {};
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    data.error = "Permission to access location was denied";
    return data;
  }

  let location = await Location.getCurrentPositionAsync({});
  let lantlong = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
  };
  data.lantlong = lantlong;
  return data;
};

import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});

export const findAddress = async (lantlong) => {
  let data = {};
  await client
    .reverseGeocode({
      params: {
        key: "AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc",
        latlng: lantlong,
      },
    })
    .then((r) => {
      data.uniName = r.data?.results[0]?.formatted_address;
    })
    .catch((e) => {
      console.log(e);
      data.error = "Error-Unable to find address";
    });
  return data;
};
