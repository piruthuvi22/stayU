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
import showToast from '../../components/core/toast';
import env from '../../env';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import auth from '../../utilities/firebase';
import {useAuth} from '../../utilities/context';

let {height, width} = Dimensions.get('screen');

const RenterLogin = ({navigation, route}) => {
  const {user} = useAuth();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('navaratnamsagini@gmail.com');
  const [password, setPassword] = useState('Sagini18');
  const [password2, setPassword2] = useState('Sagini18');

  const toast = useToast();

  const handleEmail = e => {
    setEmail(e);
  };

  const handlePassword = e => {
    setPassword(e);
  };

  const handlePassword2 = e => {
    setPassword2(e);
  };

  const handleRegister = () => {
    let body = {email, password};
    if (email != '' && password != '' && password2 != '') {
      if (password === password2) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            // Signed in
            sendEmailVerification(auth.currentUser).then(() => {
              // Email verification sent!
              showToast(toast, 'success', 'Email verification sent!', () =>
                navigation.navigate('get-start'),
              );
            });
          })
          .catch(error => {
            const errorMessage = error?.message?.split('/')[1]?.split(')')[0];
            showToast(toast, 'warning', errorMessage);
          });
      } else {
        showToast(toast, 'error', 'Password not match');
      }
    } else {
      console.log('Invalid params');
      showToast(toast, 'error', 'Invalid credentials!');
    }
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
            <Box h={'30%'} justifyContent={'center'}>
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
                Sign up
              </Text>
              <Text
                color={'#A0A0A0'}
                fontFamily={'Poppins-Regular'}
                fontSize={'md'}>
                Create your account for free
              </Text>
            </Box>
            <VStack h={'70%'}>
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
                    defaultValue=""
                    value={email}
                    placeholder="email"
                    backgroundColor={'#FF4E83:alpha.10'}
                    borderColor={'#FF4E83'}
                    focusOutlineColor={'red'}
                    fontSize={'md'}
                    color={'#666'}
                    onChangeText={handleEmail}
                  />
                  {/* <FormControl.HelperText>
                Must be atleast 6 characters.
              </FormControl.HelperText>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
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
                    defaultValue=""
                    value={password}
                    placeholder="Password"
                    backgroundColor={'#FF4E83:alpha.10'}
                    borderColor={'#FF4E83'}
                    focusOutlineColor={'red'}
                    fontSize={'md'}
                    color={'#666'}
                    onChangeText={handlePassword}
                  />
                </Stack>
              </FormControl>

              <FormControl isRequired my={2}>
                <Stack mx="4">
                  <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                    Confirm Password
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
                    defaultValue=""
                    value={password2}
                    placeholder="Password"
                    backgroundColor={'#FF4E83:alpha.10'}
                    borderColor={'#FF4E83'}
                    focusOutlineColor={'red'}
                    fontSize={'md'}
                    color={'#666'}
                    onChangeText={handlePassword2}
                  />
                  <HStack justifyContent={'space-between'}>
                    <FormControl.HelperText
                      _text={{fontFamily: 'Poppins-Medium'}}>
                      Must be atleast 6 characters.
                    </FormControl.HelperText>
                  </HStack>

                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>

              <Center mt={3} justify={'center'} align={'center'} w={'100%'}>
                <Button
                  android_ripple={{color: '#F0F1F6'}}
                  backgroundColor="#223343"
                  onPress={handleRegister}
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
                  Register
                </Button>
                <Text fontFamily={'Poppins-Medium'} color={'#A0A0A0'} mt={2}>
                  Don't have an account?
                  <Text
                    color={'#A0A0A0'}
                    fontWeight={'extrabold'}
                    onPress={() =>
                      navigation.navigate('renter-login', {
                        userRole: route?.params?.userRole,
                      })
                    }>
                    &nbsp;Sign in
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
            </VStack>
          </Stack>
        </ImageBackground>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default RenterLogin;
