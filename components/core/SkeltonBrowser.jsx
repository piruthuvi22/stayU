import React from "react";
import { Box, HStack, Skeleton, VStack } from "native-base";
import {StatusBar} from "react-native"
import SkeltonCard from "./Skelton";

const BrowserSkelton = () => {
  return (
    <Box top={StatusBar.currentHeight}>
      <HStack
        marginX={2}
        marginTop={3}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Skeleton size={"5"} w={"50%"} rounded="full" startColor={"gray.300"} />
        <Skeleton size={"5"} w={"10%"} rounded="sm" startColor={"gray.300"} />
      </HStack>
      <VStack my={2} mx={2}>
        <Skeleton size={"3"} w={"30%"} rounded="full" startColor={"gray.300"} />
        <Skeleton my={2} w={"100%"} rounded="sm" startColor={"gray.300"} />
      </VStack>
      <Box mx={2} backgroundColor={"white"}>
        <SkeltonCard />
        <SkeltonCard />
        <SkeltonCard />
        <SkeltonCard />
        <SkeltonCard />
      </Box>
    </Box>
  );
};

export default BrowserSkelton;
