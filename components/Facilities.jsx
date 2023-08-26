import {Box, Divider, HStack, VStack} from 'native-base';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';

export const FacilitiesDetails = ({info}) => {
  console.log('info', info);
  return (
    <>
      <Box px={2} py={2} mb={4}>
        <HStack>
          <Text style={styles.username}>Address : </Text>
        </HStack>
        <VStack>
          <Text style={styles.username}>Facilities</Text>
          <Box pl={2}>
            {info?.Facilities?.Facilities?.map((faci, index) => (
              <Text key={faci + index} style={styles.subtitle}>
                {faci}
              </Text>
            ))}
            <Text style={styles.subtitle}>
              RoomType : {info?.Facilities?.RoomType}
            </Text>
            <Text style={styles.subtitle}>
              No of Beds : {info?.Facilities?.NoOfBeds}
            </Text>
            <Text style={styles.subtitle}>
              Wash room type :
              {info?.Facilities?.WashRoomType?.map((was, index) => (
                <Text key={was + index}>{was}, </Text>
              ))}
            </Text>

            <Text style={styles.subtitle}>
              Offering meals : {info?.Facilities?.OfferingMeals ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.subtitle}>
              Payment : {info?.Facilities?.Payment}
            </Text>
          </Box>
        </VStack>
      </Box>
      <Divider bgColor={'#eee'} />
    </>
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
  subtitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#666',
  },
});
