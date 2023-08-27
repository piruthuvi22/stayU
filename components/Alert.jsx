import React from 'react';
import {Text} from 'react-native';
import {Alert, CloseIcon, HStack, IconButton, VStack} from 'native-base';

const ToastAlert = ({onComplete, msg, type, toast}) => {
  return (
    <Alert
      maxWidth="100%"
      alignSelf="center"
      flexDirection="row"
      status={type}
      variant={'top-accent'}>
      <VStack space={1} flexShrink={1} w="95%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
                color: '#555',
              }}>
              {msg}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" />}
            _icon={{
              color: 'darkText',
            }}
            onPress={onComplete}
          />
        </HStack>
      </VStack>
    </Alert>
  );
};

export default ToastAlert;
