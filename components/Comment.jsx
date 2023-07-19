import { Box, Divider, HStack, VStack } from "native-base";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { AirbnbRating } from "react-native-ratings";

const Comment = () => {
  return (
    <>
      <Box px={2} py={2} mb={4}>
        <HStack alignItems={"center"} justifyContent={"space-between"}>
          <VStack>
            <Text style={styles.username}>User 1</Text>
            <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={3}
              size={8}
              selectedColor={"#5C5A6F"}
              ratingBackgroundColor="blue"
              onFinishRating={(r) => console.log(r)}
              isDisabled
            />
          </VStack>
          <Box>
            <Text style={styles.date}>1 Aug 2022</Text>
          </Box>
        </HStack>
        <Text style={styles.comment}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum maiores
          deserunt quibusdam aliquam voluptatem numquam voluptates doloribus
          iste quaerat? Similique.
        </Text>
      </Box>
      <Divider bgColor={"#eee"} />
    </>
  );
};
const styles = StyleSheet.create({
  username: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#F24E1E",
  },
  date: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#999",
  },
  comment: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#A0A0A0",
    lineHeight: 16,
  },
});
export default Comment;
