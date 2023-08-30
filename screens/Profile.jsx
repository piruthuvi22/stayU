import React, {useState} from 'react';
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
  ScrollView,
  AddIcon,
  KeyboardAvoidingView,
} from 'native-base';
import {Feather} from '@expo/vector-icons';
import {View, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../utilities/firebase';
import {updatePassword, signOut, updateProfile} from 'firebase/auth';
import axios from 'axios';
import {useAuth} from '../utilities/context';
import env from '../env';
import showToast from '../components/core/toast';

const Profile = ({navigation}) => {
  const {user} = useAuth();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [changedPassword, setChangedPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  let {height} = Dimensions.get('screen');

  const handleSignOut = async () => {
    try {
      signOut(auth)
        .then(() => {
          navigation.navigate('get-start');
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
          console.log(
            'displayName:',
            displayName,
            'contactNumber:',
            contactNumber,
          );
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
          showToast(toast, 'warning', 'Error in Update');
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
            showToast(toast, 'warning', 'Error in Password Updating!');
          });
      } else {
        showToast(toast, 'warning', 'Password does not match');
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView h={height} behavior={'a'}>
        <HStack
          style={{marginTop: 50, marginBottom: 20}}
          space={12}
          justifyContent="space-evenly">
          <Heading size="xl">{user?.displayName}</Heading>
          <Avatar
            bg="amber.500"
            size="lg"
            source={{
              uri: user?.photoURL,
            }}>
            <Avatar.Badge bg="yellow.500">
              <AddIcon size="4" color="pink.500" />
            </Avatar.Badge>
          </Avatar>
        </HStack>

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
              value={displayName}
              placeholder="Display name"
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
        <Center>
          <Button
            onPress={() => handleDetails(displayName, contactNumber)}
            style={{backgroundColor: '#FF4E83'}}>
            Update Details
          </Button>
        </Center>
        <FormControl mt={8} mb={2}>
          <Stack mx="4">
            <Heading style={{marginBottom: 10, color: '#e03183'}}>
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
        <Center>
          <Button
            onPress={handleChangePassword}
            style={{backgroundColor: '#FF4E83'}}>
            Change Password
          </Button>
        </Center>
        <View style={{width: '20%', marginLeft: 3}}>
          <Button onPress={handleSignOut} style={{backgroundColor: 'red'}}>
            Logout
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Profile;
