import React from "react";
import {
  Alert,
  Text,
  CloseIcon,
  HStack,
  IconButton,
  VStack,
} from "native-base";

const ToastAlert = ({ onComplete, msg, type, toast }) => {
  return (
    <Alert
      maxWidth="100%"
      alignSelf="center"
      flexDirection="row"
      status={type}
      variant={"top-accent"}
    >
      <VStack space={1} flexShrink={1} w="80%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color="darkText"
            >
              {msg}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" />}
            _icon={{
              color: "darkText",
            }}
            onPress={onComplete}
          />
        </HStack>
      </VStack>
    </Alert>
  );
};

export default ToastAlert;
