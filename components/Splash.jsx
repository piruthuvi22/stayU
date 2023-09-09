import {View, Text, ActivityIndicator, Image} from 'react-native';

export const SplashScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={"#FF4E83"} />
      <Text>Loading..</Text>
    </View>
  );
};
