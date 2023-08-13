import React from "react";

import {
  Box,
  Center,
  Text,
  StatusBar,
  HStack,
  IconButton,
  Pressable,
  ScrollView,
  Image,
  Row,
  Column,
  Badge,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";

const RoomCard = () => {
  return (
    <Box marginBottom={4} p={0} style={styles.room_wrapper} borderRadius={3}>
      <Box style={styles.image}>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            borderRadius={3}
            source={{
              uri: "https://www.travelanddestinations.com/wp-content/uploads/2017/10/hostel-room-pixabay-182965_1280.jpg",
            }}
            alt="room1"
            h={"full"}
            w="full"
          ></Image>
        </TouchableOpacity>
      </Box>
      <Row style={styles.details} justifyContent={"space-between"} paddingX={1}>
        <Column justifyContent={"space-between"} style={styles.info}>
          <Text fontSize={"lg"}>Place 1</Text>
          <Row justifyContent={"space-between"} w={"full"}>
            <Text
              fontSize={"sm"}
              color={"gray.600"}
              fontFamily={"Poppins-Regular"}
            >
              Description 1
            </Text>
            <Text
              fontSize={"sm"}
              color={"gray.400"}
              fontFamily={"Poppins-Regular"}
            >
              2.1Km
            </Text>
            <Text
              fontSize={"sm"}
              color={"gray.400"}
              fontFamily={"Poppins-Regular"}
            >
              3-6 mins
            </Text>
          </Row>
        </Column>
        <Column justifyContent={"center"}>
          <Badge
            colorScheme="warning"
            alignSelf="center"
            fontFamily={"Poppins-Regular"}
          >
            4.2
          </Badge>
        </Column>
      </Row>
    </Box>
  );
};

const styles = StyleSheet.create({
  room_wrapper: {
    height: 200,
    width: "100%",
    backgroundColor: "#fff",
    // padding: 50,
    // margin: 10,
  },
  image: {
    height: "75%",
  },
  details: {
    height: "25%",
  },
  info: {
    width: "80%",
  },
});

export default RoomCard;
