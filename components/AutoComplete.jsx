import {Button, Input} from 'native-base';
import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const AutoComplete = ({label, placeholder, onPlaceSelected}) => {
  return (
    <>
      <Text style={{fontFamily: 'Poppins-Medium', color: '#5C5A6F'}}>
        {label}
      </Text>
      <GooglePlacesAutocomplete
        styles={styles}
        placeholder={placeholder || 'Search'}
        fetchDetails
        query={{
          key: 'AIzaSyCz5aHnnwPi7R_v65PASfRLikJ5VVA8Ytc',
          language: 'en',
          components: 'country:lk',
        }}
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
      />
    </>
  );
};

let styles = {
  listView: {
    zIndex: 100,
  },
  row: {
    height: 50,
    zIndex: 1000,
  },
  textInput: {
    backgroundColor: '#fd683d1a',
    borderColor: '#FD683D',
    borderWidth: 1,
    color: '#666',
  },
  poweredContainer: {
    display: 'none',
  },
  description: {
    color: '#666',
  },
};
export default AutoComplete;
