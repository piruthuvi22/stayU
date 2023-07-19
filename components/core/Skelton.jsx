import { Box, HStack, Skeleton } from "native-base";
import React from "react";
import { Dimensions } from "react-native";

const SkeltonCard = () => {
  return (
    <HStack
      w="100%"
      h={"150"}
      my={1}
      borderWidth="1"
      rounded="md"
      _light={{
        borderColor: "coolGray.200",
      }}
    >
      <Box w="40%" p={2}>
        <Skeleton h="100%" />
      </Box>
      <Box w="60%" h="100%" p={2}>
        <Skeleton.Text px="2" my={1} />
      </Box>
    </HStack>
  );
};

export default SkeltonCard;
