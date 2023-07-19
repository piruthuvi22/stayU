import { Input } from "native-base";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const AutoComplete = ({ label, placeholder, onPlaceSelected }) => {
  const sriLanka = {
    description: "country1",
    geometry: { location: { lat: 7.873592, lng: 80.773137 } },
  };
  useEffect(() => {
    console.log("AutoComplete.jsx");
    return () => {};
  }, []);

  return (
    <>
      <Text style={{ fontFamily: "Poppins-Medium", color: "#5C5A6F" }}>
        {label}
      </Text>
      <GooglePlacesAutocomplete
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
          //   console.log(data, details);
        }}
        query={{
          key: "AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc",
          language: "en",
          components: "country:lk",
        }}
        styles={{
          textInput: {
            backgroundColor: "#fd683d1a",
            borderColor: "#FD683D",
            borderWidth: 1,
            color: "#666",
          },
          poweredContainer: {
            display: "none",
          },
          loader: {
            backgroundColor: "#ff0000",
          },
        }}
      />
    </>
  );
};

export default AutoComplete;
