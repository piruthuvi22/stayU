import React, {useState, useEffect} from 'react';
import {
  Button,
  Center,
  Text,
  FormControl,
  Stack,
  Input,
  VStack,
  HStack,
  Avatar,
  Heading,
  useToast,
  // ScrollView,
  AddIcon,
  Spinner,
  Divider,
  KeyboardAvoidingView,
  Box,
  IconButton,
  Icon,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../utilities/firebase';
import {launchImageLibrary} from 'react-native-image-picker';
import {storage} from '../utilities/firebase';
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from 'firebase/storage';
import {updatePassword, signOut, updateProfile} from 'firebase/auth';
import axios from 'axios';
import {useAuth} from '../utilities/context';
import env from '../env';
import showToast from '../components/core/toast';
import {ToastAndroid} from 'react-native';

const Profile = ({navigation}) => {
  const toast = useToast();
  const {user, userRole} = useAuth();
  const [show, setShow] = useState(false);
  const [displayName, setDisplayName] = useState(
    auth?.currentUser?.displayName,
  );
  const [contactNumber, setContactNumber] = useState('');
  const [changedPassword, setChangedPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

  let {height} = Dimensions.get('screen');

  const getContactNumber = () => {
    axios
      .get(env.api + '/users/getContactNumber', {
        params: {email: auth?.currentUser?.email},
      })
      .then(res => {
        setContactNumber(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      signOut(auth)
        .then(async () => {
          await AsyncStorage.clear();
          navigation.navigate('get-start');
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const handleDetails = (name, number) => {
    let displayName = name === '' ? auth?.currentUser?.displayName : name;
    let contactNumber = number === '' ? auth?.currentUser?.phoneNumber : number;
    contactNumber = parseInt(contactNumber, 10);

    if (isNaN(contactNumber)) {
      showToast(toast, 'warning', 'Contact Number is not valid');
    } else {
      updateProfile(auth?.currentUser, {
        displayName: displayName,
        phoneNumber: contactNumber,
      })
        .then(() => {
          // console.log(
          //   'displayName:',
          //   displayName,
          //   'contactNumber:',
          //   contactNumber,
          // );
          axios
            .put(env.api + '/users/updateDisplayName', {
              email: auth?.currentUser?.email,
              displayName: displayName,
              phoneNumber: contactNumber,
            })
            .then(res => {
              setDisplayName('');
              setContactNumber('');
              showToast(toast, 'success', 'Updated Successfully!');
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(error => {
          showToast(toast, 'error', 'Error in Update');
        });
    }
  };
  const handleChangePassword = async () => {
    try {
      if (changedPassword === confirmedPassword) {
        updatePassword(auth?.currentUser, confirmedPassword)
          .then(() => {
            showToast(toast, 'success', 'Password Updated Successfully!');
          })
          .catch(error => {
            showToast(toast, 'error', 'Error in Password Updating!');
          });
      } else {
        showToast(toast, 'warning', 'Password does not match');
      }
    } catch (e) {
      console.log(e);
    }
  };
  const chooseFile = async type => {
    let options = {
      mediaType: type,
      quality: 1,
      // selectionLimit: 1,
    };
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        ToastAndroid.show('Cancelled by user', ToastAndroid.LONG);
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        ToastAndroid.show('Camera not available on device', ToastAndroid.LONG);
        return;
      } else if (response.errorCode == 'permission') {
        ToastAndroid.show('Permission not satisfied', ToastAndroid.LONG);
        return;
      } else if (response.errorCode == 'others') {
        ToastAndroid.show(response.errorMessage, ToastAndroid.LONG);
        return;
      }
      setImage(response?.assets[0]?.uri);
      fireStoreUpload(response);
    }).catch(error => {
      console.log('CHoose file :', error);
    });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);

      xhr.send(null);
    });
  };

  const fireStoreUpload = async fireStoreImage => {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storageRef = ref(
      storage,
      'profilePictures/' +
        user?.email +
        '/' +
        userRole +
        '/' +
        fireStoreImage?.assets[0]?.fileName,
    );
    let blob = await uriToBlob(fireStoreImage?.assets[0]?.uri);
    const uploadTask = uploadBytes(storageRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadURL => {
          // console.log('File available at', downloadURL);
          updateProfile(auth?.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              // console.log('photoURL is added');
              showToast(toast, 'success', 'Profile Picture Updated!');
            })
            .catch(err => {
              console.log('PhotoURL Error :', err);
            });
        });
      })
      .catch(err => console.log(err));
  };
  
  useEffect(() => {
    getContactNumber();
  }, []);
  return loading ? (
    <Box
      h="full"
      style={{
        position: 'relative',
        top: StatusBar.currentHeight,
        backgroundColor: '#eee',
        height: Dimensions.get('window').height,
        paddingBottom: 60,
      }}>
      <Center h="full">
        <Spinner color="pink.500" size={'lg'} />
      </Center>
    </Box>
  ) : (
    <Box h={'full'}>
      <KeyboardAvoidingView h={height} behavior={'a'} style={styles.wrapper}>
        <View>
          <ImageBackground
            source={require('../assets/images/background-profile.png')}
            resizeMode="stretch">
            <HStack style={styles.profile} alignItems="center" space={12}>
              <Avatar
                bg="amber.500"
                onTouchEnd={() => chooseFile('photo')}
                size="xl"
                source={{
                  uri: user?.photoURL,
                }}>
                <Avatar.Badge bg="#fff" size={8}>
                  {/* <Ionicons name="add-circle" size={17} color="black" mb={1} />{' '} */}
                  <Box justifyContent={'center'} alignItems={'center'} h="full">
                    <MaterialIcons name="mode-edit" size={18} color="#FF4E83" />
                  </Box>
                </Avatar.Badge>
              </Avatar>
              <Heading size="xl">{auth?.currentUser?.displayName}</Heading>
            </HStack>
            <MaterialCommunityIcons
              name="logout"
              size={35}
              color="#FF4E83"
              style={{position: 'absolute', bottom: 20, right: 20, zIndex: 1}}
              onPress={handleSignOut}
            />
            {/* <HStack justifyContent={'flex-end'}>
              <IconButton
                icon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="logout"
                    size={29}
                    color="#FF4E83"
                  />
                }
                borderRadius="full"
                onPress={handleSignOut}
              />
            </HStack> */}

            {/* <Text style={{color: '#fff', fontWeight: 'bold'}}>Logout</Text>
              </HStack>
            </Button> */}
          </ImageBackground>
        </View>
        <Divider thickness="2" />
        <ScrollView>
          <FormControl my={2}>
            <Stack mx="4">
              <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                Display name
              </FormControl.Label>
              <Input
                _focus={{
                  borderWidth: '2',
                  borderColor: '#FF4E83',
                  backgroundColor: '#FF4E83:alpha.5',
                }}
                type="text"
                defaultValue=""
                value={displayName || auth?.currentUser?.displayName}
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
                onChangeText={e => setDisplayName(e)}
              />
              <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                Contact number
              </FormControl.Label>
              <Input
                _focus={{
                  borderWidth: '2',
                  borderColor: '#FF4E83',
                  backgroundColor: '#FF4E83:alpha.5',
                }}
                type="text"
                defaultValue=""
                value={contactNumber}
                placeholder="Contact number"
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
                onChangeText={e => setContactNumber(e)}
              />
            </Stack>
          </FormControl>
          <Center mt={2}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleDetails(displayName, contactNumber)}
              style={styles.button}>
              <Text style={styles.buttonText}>Update Details</Text>
            </TouchableOpacity>
          </Center>
          <FormControl mt={8} mb={2}>
            <Divider thickness="2" mb={3} />

            <Stack mx="4">
              <Heading style={{marginBottom: 10, color: '#FF4E83'}}>
                {' '}
                Update Password
              </Heading>
              <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                Changed Password
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
                value={changedPassword}
                placeholder="Changed Password"
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
                onChangeText={e => setChangedPassword(e)}
              />
              <FormControl.Label _text={{fontFamily: 'Poppins-Medium'}}>
                Confirmed Password
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
                value={confirmedPassword}
                placeholder="Confrimed Password"
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
                onChangeText={e => setConfirmedPassword(e)}
              />
            </Stack>
          </FormControl>

          <Center mt={2}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleChangePassword}
              style={styles.button}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </Center>
          <View style={{width: '25%', marginLeft: 3}}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profile: {
    position: 'sticky',
    top: 0,
    height: Dimensions.get('window').height / 3.5,
    zIndex: 1,
    // backgroundColor: '#fff',
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    height: Dimensions.get('window').height,
    paddingBottom: StatusBar.currentHeight - 12,
  },
  button: {
    padding: 10,
    backgroundColor: '#FF4E83',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
