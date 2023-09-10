import {Box, Divider, HStack, VStack} from 'native-base';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import {Entypo} from '@expo/vector-icons';

export const FacilitiesDetails = ({info}) => {
  return (
    <Box px={2} py={2}>
      {/* <HStack>
          <Text style={styles.username}>Address : </Text>
        </HStack> */}
      <VStack>
        {/* <Text style={styles.username}>Facilities</Text> */}
        <Box pl={2}>
          <Text style={styles.title}>
            {info?.Facilities?.Facilities?.length > 0 && 'Facilities :'}
          </Text>
          {info?.Facilities?.Facilities?.map((faci, index) => (
            <HStack key={faci + index}>
              <Entypo name="dot-single" size={24} color="black" />
              <Text style={styles.subtitle}>
                {faci.charAt(0).toUpperCase() + faci.slice(1)}
              </Text>
            </HStack>
          ))}
          <HStack>
            <Text style={styles.title}>RoomType : </Text>
            <Text style={styles.subtitle}>{info?.Facilities?.RoomType}</Text>
          </HStack>
          <HStack>
            <Text style={styles.title}>No of Beds : </Text>
            <Text style={styles.subtitle}>{info?.Facilities?.NoOfBeds}</Text>
          </HStack>
          <HStack>
            <Text style={styles.title}>Wash room type : </Text>
            <Text style={styles.subtitle}>
              {info?.Facilities?.WashRoomType?.map((was, index) => (
                <Text key={was + index}>
                  {was}
                  {index !== info?.Facilities?.WashRoomType?.length - 1 && ', '}
                </Text>
              ))}
            </Text>
          </HStack>
          <HStack>
            <Text style={styles.title}>Offering meals : </Text>
            <Text style={styles.subtitle}>
              {info?.Facilities?.OfferingMeals ? 'Yes' : 'No'}
            </Text>
          </HStack>
          <HStack>
            <Text style={styles.title}>Payment : </Text>
            <Text style={styles.subtitle}>{info?.Facilities?.Payment}</Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};
const styles = StyleSheet.create({
  username: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#F24E1E',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#999',
  },
  comment: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#A0A0A0',
    lineHeight: 16,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
});
