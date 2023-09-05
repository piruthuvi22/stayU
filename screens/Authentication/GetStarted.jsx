// previous orange FD683D
// current pink FF4E83
import {
  View,
  Box,
  Button,
  Text,
  Center,
  Image,
  VStack,
  Heading,
  HStack,
} from 'native-base';
import {ImageBackground, StyleSheet} from 'react-native';

let styles = StyleSheet.create({
  appName1: {
    // lineHeight:70,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 3,
    color: '#FF4E83',
    // backgroundColor: "#aaa",
  },
  appName2: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 3,
    color: '#FF4E83',
    // backgroundColor: '#aaa',
  },
  appDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    // backgroundColor: "#fff",
  },
});
const Screen2 = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/background-pattern.png')}
      resizeMode="stretch">
      <VStack space={1} alignItems={'center'} justifyContent={'center'}>
        <Center h={'50%'} w={'100%'}>
          <Image
            marginTop={'40%'}
            source={require('../../assets/images/landing_home.png')}
            w={'70%'}
            resizeMode="contain"
            alt="home"
          />
        </Center>
        <Center h={'20%'} w={'100%'}>
          <HStack alignItems={'baseline'}>
            <Text style={styles.appName1} fontSize={'7xl'} lineHeight={'xs'}>
              S
            </Text>
            <Text style={styles.appName2} fontSize={'6xl'} lineHeight={'xs'}>
              tayU
            </Text>
          </HStack>
          <Text style={styles.appDesc} lineHeight={'xs'}>
            Find your boarding in a few clicks
          </Text>
        </Center>
        <Center h={'30%'} w={'100%'}>
          <Button
            android_ripple={{color: '#F0F1F6'}}
            backgroundColor="#223343"
            onPress={() =>
              navigation.navigate('renter-login', {userRole: 'landlord'})
            }
            width="60%"
            marginY={1}
            height={60}
            borderRadius={100}
            borderColor={'#FF4E83'}
            borderWidth={2}
            fontFamily={'Poppins-Bold'}
            _text={{fontFamily: 'Poppins-Bold', fontSize: 'xl'}}>
            I'm a Landlord
          </Button>

          <Button
            android_ripple={{color: '#F0F1F6'}}
            backgroundColor="#223343"
            onPress={() =>
              navigation.navigate('renter-login', {userRole: 'student'})
            }
            width="60%"
            marginY={1}
            height={60}
            borderRadius={100}
            borderColor={'#FF4E83'}
            borderWidth={2}
            fontFamily={'Poppins-Bold'}
            _text={{fontFamily: 'Poppins-Bold', fontSize: 'xl'}}>
            I'm a Student
          </Button>
        </Center>
      </VStack>
    </ImageBackground>
  );
};

export default Screen2;
