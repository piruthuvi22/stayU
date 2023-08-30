import {useState} from 'react';
import {
  Text,
  Center,
  Stack,
  Box,
  FormControl,
  Input,
  WarningOutlineIcon,
  HStack,
  Pressable,
  Button,
  VStack,
  Flex,
  Divider,
  Avatar,
  ScrollView,
  KeyboardAvoidingView,
  IconButton,
  Image,
  useToast,
} from 'native-base';
import {
  ImageBackground,
  StyleSheet,
  Dimensions,
  // ScrollView,
} from 'react-native';
import {Feather, Ionicons} from '@expo/vector-icons';
import axios from 'axios';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {auth} from '../../utilities/firebase';
import env from '../../env';
import showToast from '../../components/core/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

let {height, width} = Dimensions.get('screen');

const RenterLogin = ({navigation, route}) => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [email, setemail] = useState('saginisaju@gmail.com');
  const [password, setPassword] = useState('Sagini18');
  // console.log(route.params);
  const handleemail = e => {
    setemail(e);
  };

  const handlePassword = e => {
    setPassword(e);
  };

  const handleRenterLogin = () => {
    let body = {email, password, role: 'renter'};

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const emailVerified = userCredential?.user?.emailVerified;
        emailVerified
          ? navigation.navigate('TabNavigator', {screen: 'Browse'})
          : showToast(toast, 'warning', 'Please Verify Email!');
      })
      .catch(error => {
        const errorMessage = error?.message?.split('/')[1]?.split(')')[0];
        showToast(toast, 'warning', errorMessage);
      });
  };
  const handleForgotPassword = () => {
    if (!email) {
      showToast(toast, 'warning', 'Please enter your email!');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('reset email sent');
        showToast(toast, 'success', 'Reset Email sent!');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView h={height} behavior={'a'}>
        <ImageBackground
          source={require('../../assets/images/backkgroun-login.png')}
          resizeMode="stretch">
          <Stack
            justifyContent={'space-evenly'}
            h={'full'}
            mx={{base: '5%', sm: 10, md: 20}}>
            <Box h={'34%'} justifyContent={'center'}>
              <Box alignItems={'flex-start'}>
                <Pressable
                  android_ripple={{color: '#ddd'}}
                  onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={36}
                    color="#FF4E83"
                  />
                </Pressable>
              </Box>
              <Text
                color={'#FF4E83'}
                fontFamily={'Poppins-Bold'}
                fontSize={'5xl'}>
                Sign in
              </Text>
              <Text
                color={'#A0A0A0'}
                fontFamily={'Poppins-Regular'}
                fontSize={'md'}>
                {route.params.userRole === 'landlord'
                  ? 'Showcase your rooms with us'
                  : 'Discover your boarding with us'}
              </Text>
            </Box>
            <VStack h={'66%'}>
              <FormControl isRequired my={2}>
                <Stack mx="4">
                  <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                    email
                  </FormControl.Label>
                  <Input
                    _focus={{
                      borderWidth: '2',
                      borderColor: '#FF4E83',
                      backgroundColor: '#FF4E83:alpha.5',
                    }}
                    type="text"
                    defaultValue={''}
                    value={email}
                    placeholder="email"
                    backgroundColor={'#FF4E83:alpha.10'}
                    borderColor={'#FF4E83'}
                    focusOutlineColor={'red'}
                    fontSize={'md'}
                    color={'#666'}
                    onChangeText={handleemail}
                  />
                  {/* <FormControl.HelperText>
                    Must be atleast 6 characters.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage> */}
                </Stack>
              </FormControl>

              <FormControl isRequired my={2}>
                <Stack mx="4">
                  <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                    Password
                  </FormControl.Label>
                  <Input
                    type={show ? 'text' : 'password'}
                    _focus={{
                      borderWidth: '2',
                      borderColor: '#FF4E83',
                      backgroundColor: '#FF4E83:alpha.5',
                    }}
                    InputRightElement={
                      <Feather
                        name={show ? 'eye' : 'eye-off'}
                        size={20}
                        style={{marginRight: 5}}
                        color="#999"
                        onPress={() => setShow(!show)}
                      />
                    }
                    defaultValue={''}
                    value={password}
                    placeholder="Password"
                    backgroundColor={'#FF4E83:alpha.10'}
                    borderColor={'#FF4E83'}
                    focusOutlineColor={'red'}
                    fontSize={'md'}
                    color={'#666'}
                    onChangeText={handlePassword}
                  />
                  <HStack justifyContent={'space-between'}>
                    <FormControl.HelperText
                      _text={{fontFamily: 'Poppins-Medium'}}>
                      Must be atleast 6 characters.
                    </FormControl.HelperText>
                  </HStack>
                  <FormControl.HelperText
                    _text={{fontSize: 'md', fontFamily: 'Poppins-Medium'}}
                    onTouchEnd={handleForgotPassword}
                    style={styles.forgotPassword}>
                    Forgot Password
                  </FormControl.HelperText>

                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>

              <Center mt={3} justify={'center'} align={'center'} w={'100%'}>
                <Button
                  android_ripple={{color: '#F0F1F628'}}
                  backgroundColor="#223343"
                  onPress={handleRenterLogin}
                  width="60%"
                  marginY={1}
                  height={50}
                  borderRadius={100}
                  borderColor={'#FF4E83'}
                  borderWidth={2}
                  // fontFamily={"Poppins-Bold"}
                  _text={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 'xl',
                    textAlign: 'center',
                  }}>
                  Login
                </Button>
                <Text fontFamily={'Poppins-Medium'} color={'#A0A0A0'} mt={2}>
                  Don't have an account?
                  <Text
                    color={'#A0A0A0'}
                    fontWeight={'extrabold'}
                    onPress={() =>
                      navigation.navigate('sign-up', {
                        userRole: route?.params?.userRole,
                      })
                    }>
                    &nbsp;Sign up
                  </Text>
                </Text>
              </Center>

              {/* <HStack alignItems={"center"} mt={3}>
              <Divider />
              <Text
                color={"#A0A0A0"}
                onPress={() => console.log("Dont have an acc")}
              >
                &nbsp; &nbsp;Or login with&nbsp; &nbsp;
              </Text>
              <Divider />
            </HStack> */}

              {/* <HStack justifyContent={"center"} mt={3} space={5}>
              <Avatar
                source={require("../assets/images/fb.png")}
                backgroundColor={"#ddd"}
              />
              <Avatar
                source={require("../assets/images/google.png")}
                backgroundColor={"#ddd"}
              />
            </HStack> */}
              {/* Temporary button */}
              {/* <Button
                onPress={() =>
                  navigation.navigate('TabNavigator', {screen: 'add-home'})
                }>
                landlord - upload
              </Button> */}
            </VStack>
          </Stack>
        </ImageBackground>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default RenterLogin;

const styles = StyleSheet.create({
  forgotPassword: {
    alignItems: 'center',
  },
});
