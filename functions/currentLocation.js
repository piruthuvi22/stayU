import * as Location from "expo-location";
import { Client } from "@googlemaps/google-maps-services-js";

let findLocation = async () => {
  const client = new Client({});
  let location = null;
  let errorMsg = "";
  let uniName = "";

  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    errorMsg = "Permission to access location was denied";
    return;
  }
  let coord = await Location.getCurrentPositionAsync({});
  location = {
    latitude: coord?.coords.latitude,
    longitude: coord?.coords.longitude,
  };
  let lantlong = {
    latitude: coord?.coords.latitude,
    longitude: coord?.coords.longitude,
  };
  client
    .reverseGeocode({
      params: {
        key: "AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc",
        latlng: lantlong,
      },
    })
    .then((r) => {
      //   console.log(r.data.results[0]?.formatted_address.split(",")[0]);
      uniName = r.data?.results[0]?.formatted_address;
    })
    .catch((e) => {
      console.log(e);
      return;
    });
  return location;
};

export default findLocation;
