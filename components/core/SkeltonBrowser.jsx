import React from "react";
import { Box, HStack, Skeleton, VStack } from "native-base";
import SkeltonCard from "./Skelton";

const BrowserSkelton = () => {
  return (
    <>
      <HStack
        marginX={3}
        marginTop={3}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Skeleton size={"5"} w={"50%"} rounded="full" startColor={"gray.300"} />
        <Skeleton size={"5"} w={"10%"} rounded="sm" startColor={"gray.300"} />
      </HStack>
      <VStack my={2} mx="3">
        <Skeleton size={"3"} w={"30%"} rounded="full" startColor={"gray.300"} />
        <Skeleton my={2} w={"100%"} rounded="sm" startColor={"gray.300"} />
      </VStack>
      <Box mx={3} backgroundColor={"white"}>
        <SkeltonCard />
        <SkeltonCard />
        <SkeltonCard />
        <SkeltonCard />
        <SkeltonCard />
      </Box>
    </>
  );
};

export default BrowserSkelton;
