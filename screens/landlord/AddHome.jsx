import {
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Dimensions,
  Text as RNText,
} from 'react-native';
import {
  Box,
  VStack,
  FormControl,
  Stack,
  Input,
  Icon,
  Text,
  HStack,
  TextArea,
  Actionsheet,
  Checkbox,
  useDisclose,
  Radio,
  Pressable,
  KeyboardAvoidingView,
  useToast,
  Button,
} from 'native-base';
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from '@expo/vector-icons';
import {SliderBox} from 'react-native-image-slider-box';
import React, {useState, useEffect} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storage} from '../../utilities/firebase';
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from 'firebase/storage';
import {v4 as uuid} from 'uuid';
import axios from 'axios';
import env from '../../env';
import showToast from '../../components/core/toast';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '../../utilities/context';
import {ToastAndroid} from 'react-native';

export default function AddHome({navigation, route}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rent, setRent] = useState('');
  const {isOpen, onOpen, onClose} = useDisclose();
  const [roomType, setRoomType] = useState('');
  const [facilitiesValue, setFacilitiesValue] = useState([]);
  const [meals, setMeals] = useState(false);
  const [washroom, setWashroom] = useState([]);
  const [images, setImages] = useState([]);
  const [payment, setPayment] = useState('monthly');
  const [noOfBeds, setNoOfBeds] = useState('');
  const [imageDetails, setImageDetails] = useState([]);
  const toast = useToast();
  const {user} = useAuth();
  let {height, width} = Dimensions.get('screen');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  // const captureImage = async type => {
  //   let options = {
  //     mediaType: type,
  //     maxWidth: 300,
  //     maxHeight: 550,
  //     quality: 1,
  //     videoQuality: 'low',
  //     durationLimit: 30, //Video max duration in seconds
  //     saveToPhotos: true,
  //   };
  //   let isCameraPermitted = await requestCameraPermission();
  //   let isStoragePermitted = await requestExternalWritePermission();
  //   if (isCameraPermitted && isStoragePermitted) {
  //     launchCamera(options, response => {
  //       console.log('Response = ', response);

  //       if (response.didCancel) {
  //         alert('User cancelled camera picker');
  //         return;
  //       } else if (response.errorCode == 'camera_unavailable') {
  //         alert('Camera not available on device');
  //         return;
  //       } else if (response.errorCode == 'permission') {
  //         alert('Permission not satisfied');
  //         return;
  //       } else if (response.errorCode == 'others') {
  //         alert(response.errorMessage);
  //         return;
  //       }
  //       console.log('base64 -> ', response.base64);
  //       console.log('uri -> ', response.uri);
  //       console.log('width -> ', response.width);
  //       console.log('height -> ', response.height);
  //       console.log('fileSize -> ', response.fileSize);
  //       console.log('type -> ', response.type);
  //       console.log('fileName -> ', response.fileName);
  //       setFilePath(response);
  //     });
  //   }
  // };
  const chooseFile = async type => {
    let options = {
      mediaType: type,
      quality: 1,
      selectionLimit: 6,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

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
      const details = {
        filePath: response?.assets[0]?.uri,
        width: response?.assets[0]?.width,
        height: response?.assets[0]?.height,
      };
      setImageDetails([...imageDetails, details]);
      const filePath = response?.assets[0]?.uri;
      fireStoreUpload(response);
      const newImages = [...images, response?.assets[0]?.uri];
      setImages([...images, response?.assets[0]?.uri]);
      // storeImages(newImages);
    });
  };
  // const storeImages = async newImages => {
  //   try {
  //     await AsyncStorage.setItem('upload-images', JSON.stringify(newImages));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
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
      'landlordImages/' + 'user1/' + fireStoreImage?.assets[0]?.fileName,
    );
    let blob = await uriToBlob(fireStoreImage?.assets[0]?.uri);
    const uploadTask = uploadBytes(storageRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadURL => {
          console.log('File available at', downloadURL);
        });
      })
      .catch(err => console.log(err));

    // uploadTask.on(
    //   'state_changed',
    //   snapshot => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log('Upload is ' + progress + '% done');
    //     switch (snapshot.state) {
    //       case 'paused':
    //         console.log('Upload is paused');
    //         break;
    //       case 'running':
    //         console.log('Upload is running');
    //         break;
    //     }
    //   },
    //   error => {
    //     switch (error.code) {
    //       case 'storage/unauthorized':
    //         // User doesn't have permission to access the object
    //         console.log("User doesn't have permission to access the object");
    //         break;
    //       case 'storage/canceled':
    //         // User canceled the upload
    //         console.log('User canceled the upload');
    //         break;
    //       case 'storage/unknown':
    //         // Unknown error occurred, inspect error.serverResponse
    //         console.log('Unknown error occurred, inspect error.serverResponse');
    //         break;
    //     }
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
    //       console.log('File available at', downloadURL);
    //     });
    //   },
    // );
  };

  // const getImages = async () => {
  //   // await AsyncStorage.clear();
  //   const uploadedimages = await AsyncStorage.getItem('upload-images');
  //   if (!uploadedimages) return;
  //   const uploaded = JSON.parse(uploadedimages);
  //   setImages(uploaded);
  // };
  // useEffect(() => {
  //   getImages();
  // }, []);
  const handleSubmit = () => {
    console.log(
      title,
      description,
      rent,
      facilitiesValue,
      meals,
      washroom,
      noOfBeds,
      roomType,
      payment,
    );
    const beds = noOfBeds === '' ? 0 : parseInt(noOfBeds, 10);
    const rentAmount = rent === '' ? 0 : parseInt(rent, 10);

    if (isNaN(beds) || isNaN(rentAmount)) {
      isNaN(beds)
        ? showToast(toast, 'warning', 'No of beds must be a number!')
        : showToast(toast, 'warning', 'Rent amount must be a number!');
    } else {
      if (route.params?.location === undefined)
        return showToast(toast, 'warning', 'Please select location!');
      if (roomType === '')
        return showToast(toast, 'warning', 'Please select room type!');
      if (images.length === 0)
        return showToast(toast, 'warning', 'Please select image!');
      axios
        .post(env.api + '/places/add-place', {
          LandlordEmail: user?.email,
          PlaceTitle: title,
          PlaceDescription: description,
          Cost: rentAmount,
          Coordinates: route.params?.location,
          Facilities: {
            RoomType: roomType,
            NoOfBeds: beds,
            WashRoomType: washroom,
            OfferingMeals: meals,
            Facilities: facilitiesValue,
            Payment: payment,
          },
        })
        .then(res => {
          console.log(res.data);
          showToast(toast, 'success', 'Successfully added!');
          setTitle('');
          setDescription('');
          setRent('');
          setRoomType('');
          setFacilitiesValue([]);
          setMeals(false);
          setWashroom([]);
          setImages([]);
          setPayment('monthly');
          setNoOfBeds('');
          setImageDetails([]);
        })
        .catch(err => {
          console.log(err);
          showToast(toast, 'warning', 'Error in adding!');
        });
    }
  };

  return (
    <KeyboardAvoidingView h={height} behavior={'a'}>
      <ScrollView>
        <Box
          py="12"
          px="4"
          _text={{
            fontSize: 'md',
            fontWeight: 'medium',
            color: 'warmGray.50',
            textAlign: 'center',
          }}>
          {/* <Box alignItems={'flex-start'} mb={4}>
            <Pressable
              android_ripple={{color: '#ddd'}}
              onPress={() => navigation.navigate('home-landlord')}>
              <Ionicons name="chevron-back-outline" size={36} color="#FF4E83" />
            </Pressable>
          </Box> */}
          <VStack>
            <FormControl>
              <Input
                _focus={{
                  borderWidth: '2',
                  borderColor: '#FF4E83',
                  backgroundColor: '#FF4E83:alpha.5',
                }}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="title" />}
                    size={5}
                    ml="2"
                    color="pink.400"
                  />
                }
                type="text"
                defaultValue={''}
                value={title}
                placeholder="Title"
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
                onChangeText={e => setTitle(e)}
              />
              <TextArea
                my={5}
                _focus={{
                  borderWidth: '1',
                  borderColor: '#FF4E83',
                  backgroundColor: '#FF4E83:alpha.5',
                }}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="description" />}
                    size={5}
                    ml="2"
                    color="pink.400"
                  />
                }
                placeholder="Description"
                value={description}
                onChangeText={e => setDescription(e)}
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
              />

              <Input
                _focus={{
                  borderWidth: '2',
                  borderColor: '#FF4E83',
                  backgroundColor: '#FF4E83:alpha.5',
                }}
                InputLeftElement={
                  <Icon
                    as={<FontAwesome name="dollar" />}
                    size={5}
                    ml="2"
                    color="pink.400"
                  />
                }
                type="text"
                defaultValue={''}
                value={rent}
                placeholder="Rent Amount"
                backgroundColor={'#FF4E83:alpha.10'}
                borderColor={'#FF4E83'}
                focusOutlineColor={'red'}
                fontSize={'md'}
                color={'#666'}
                onChangeText={e => setRent(e)}
              />
              <HStack mt={5} mb={1} space={2}>
                <Button
                  size="sm"
                  colorScheme="secondary"
                  variant={`${images.length > 0 ? 'subtle' : 'outline'}`}
                  leftIcon={
                    <Icon
                      mt={1}
                      as={<MaterialIcons name="add-a-photo" />}
                      size={5}
                      ml="2"
                      color="pink.300"
                    />
                  }>
                  <Text
                    fontSize="lg"
                    // onPress={() => captureImage('photo')}>
                    onPress={() => chooseFile('photo')}>
                    Upload Photos
                  </Text>
                </Button>
              </HStack>
              <Box width={150}>
                <SliderBox
                  images={images}
                  // sliderBoxHeight={305}
                  // parentWidth={305}
                  onCurrentImagePressed={index =>
                    console.log(`image ${index} pressed`)
                  }
                />
              </Box>
              {/* <Image source={{uri: filePath.uri}} style={styles.imageStyle} /> */}
              <HStack mt={5}>
                <Button
                  size="sm"
                  colorScheme="secondary"
                  variant={`${
                    route?.params?.locationName ? 'subtle' : 'outline'
                  }`}
                  leftIcon={
                    <Icon
                      as={<MaterialIcons name="add-location" />}
                      size={7}
                      ml="2"
                      color="pink.300"
                    />
                  }>
                  <Text
                    fontSize="lg"
                    onPress={() => navigation.navigate('LocationPicker')}>
                    Pick Location
                  </Text>
                </Button>
                {route?.params?.locationName && (
                  <HStack alignItems={'center'}>
                    <RNText
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 12,
                        marginHorizontal: 6,
                        color: '#666',
                      }}>
                      {route?.params?.locationName}
                    </RNText>
                    <MaterialIcons name="check" size={18} color="green" />
                  </HStack>
                )}
              </HStack>
              <HStack space={2} my={5}>
                <Button
                  size="sm"
                  colorScheme="secondary"
                  variant={`${roomType !== '' ? 'subtle' : 'outline'}`}
                  leftIcon={
                    <Icon
                      onPress={onOpen}
                      as={<AntDesign name="antdesign" />}
                      size={7}
                      ml="2"
                      color="pink.300"
                    />
                  }>
                  <Text fontSize="lg" onPress={onOpen}>
                    Add Facilities
                  </Text>
                </Button>
              </HStack>
              <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content bgColor="#2D3D4C">
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{width: '100%'}}>
                    <Actionsheet.Item bgColor="#2D3D4C">
                      <VStack mx={2}>
                        <Text style={styles.categoryTitle}>Room Type</Text>
                        <Radio.Group
                          defaultValue={roomType}
                          accessibilityLabel="pick an item"
                          onChange={values => setRoomType(values)}>
                          <Radio
                            value="single"
                            my="0.5"
                            _text={{style: styles.filterValues}}>
                            Single
                          </Radio>
                          <Radio
                            value="shared"
                            my="0.5"
                            _text={{style: styles.filterValues}}>
                            Shared
                          </Radio>
                          <Radio
                            value="house"
                            my="0.5"
                            _text={{style: styles.filterValues}}>
                            House
                          </Radio>
                        </Radio.Group>
                      </VStack>
                    </Actionsheet.Item>
                    <Actionsheet.Item bgColor="#2D3D4C">
                      <VStack mx={2} mb={7}>
                        <Text style={styles.categoryTitle}>Facilities</Text>
                        <Checkbox.Group
                          accessibilityLabel="pick an item"
                          defaultValue={facilitiesValue}
                          onChange={prev => setFacilitiesValue(prev || [])}>
                          <Checkbox
                            value="furniture"
                            my="0.5"
                            size={'sm'}
                            _text={{style: styles.filterValues}}>
                            Furniture
                          </Checkbox>
                          <Checkbox
                            value="bed"
                            my="0.5"
                            size={'sm'}
                            _text={{style: styles.filterValues}}>
                            Bed & Mattress
                          </Checkbox>
                          <Checkbox
                            value="ac"
                            my="0.5"
                            size={'sm'}
                            _text={{style: styles.filterValues}}>
                            AC
                          </Checkbox>
                          <Checkbox
                            value="fan"
                            my="0.5"
                            size={'sm'}
                            _text={{style: styles.filterValues}}>
                            Celing fan, Wall fan, Table fan
                          </Checkbox>
                          <Checkbox
                            value="cooking"
                            my="0.5"
                            size={'sm'}
                            _text={{style: styles.filterValues}}>
                            Cooking facilities
                          </Checkbox>
                        </Checkbox.Group>
                      </VStack>

                      <VStack mx={2} mb={7}>
                        <Text style={styles.categoryTitle}>No of beds</Text>
                        <Input
                          variant="underlined"
                          value={noOfBeds}
                          placeholder="No of beds"
                          style={styles.filterValues}
                          onChangeText={value => setNoOfBeds(value)}
                        />
                      </VStack>

                      <VStack mx={2} mb={7}>
                        <Text style={styles.categoryTitle}>Offering Meals</Text>
                        <Radio.Group
                          defaultValue={meals}
                          accessibilityLabel="pick an item"
                          onChange={values => setMeals(values)}>
                          <Radio
                            value={true}
                            size={'sm'}
                            my="0.5"
                            _text={{style: styles.filterValues}}>
                            Yes
                          </Radio>
                          <Radio
                            value={false}
                            size={'sm'}
                            my="0.5"
                            _text={{style: styles.filterValues}}>
                            No
                          </Radio>
                        </Radio.Group>
                      </VStack>

                        <VStack mx={2}>
                          <Text style={styles.categoryTitle}>
                            Wash room type
                          </Text>
                          <Checkbox.Group
                            defaultValue={washroom}
                            accessibilityLabel="pick an item"
                            onChange={values => setWashroom(values)}>
                            <Checkbox
                              value="traditional"
                              my="0.5"
                              size={'sm'}
                              _text={{style: styles.filterValues}}>
                              Traditional
                            </Checkbox>
                            <Checkbox
                              value="western"
                              my="0.5"
                              size={'sm'}
                              _text={{style: styles.filterValues}}>
                              Western
                            </Checkbox>
                            <Checkbox
                              value="attached"
                              my="0.5"
                              size={'sm'}
                              _text={{style: styles.filterValues}}>
                              Attached
                            </Checkbox>
                            <Checkbox
                              value="common"
                              my="0.5"
                              size={'sm'}
                              _text={{style: styles.filterValues}}>
                              Common
                            </Checkbox>
                          </Checkbox.Group>
                        </VStack>
                      </Actionsheet.Item>
                      <Actionsheet.Item bgColor="#2D3D4C">
                        <VStack mx={2} mb={0}>
                          <Text style={styles.categoryTitle}>Payment </Text>
                          <Radio.Group
                            defaultValue={payment}
                            accessibilityLabel="pick an item"
                            onChange={values => setPayment(values)}>
                            <Radio
                              value="monthly"
                              my="0.5"
                              _text={{style: styles.filterValues}}>
                              Monthly
                            </Radio>
                            <Radio
                              value="annually"
                              my="0.5"
                              _text={{style: styles.filterValues}}>
                              Annually
                            </Radio>
                          </Radio.Group>
                        </VStack>
                      </Actionsheet.Item>
                    </ScrollView>
                  </Actionsheet.Content>
                </Actionsheet>
                <HStack space={2} my={5} style={styles.buttonContainer}>
                  <Button onPress={handleSubmit} backgroundColor={'#FF4E83'}>
                    <HStack space={1}>
                      <MaterialIcons
                        name="add-business"
                        size={24}
                        color="white"
                      />
                      <Text
                        color={'#fff'}
                        fontSize={17}
                        fontWeight={'bold'}
                        fontFamily={'Poppins-Regular'}>
                        Submit
                      </Text>
                    </HStack>
                  </Button>
                </HStack>
           
            </FormControl>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#eee',
    padding: 5,
  },
  head: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#5C5A6F',
  },
  currentLocation: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#A0A0A0',
  },

  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FF4E83',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryTitle: {
    fontSize: 20,
    color: '#FF4E83',
    fontFamily: 'Poppins-Medium',
  },
  slideVal: {
    color: '#737373',
    fontFamily: 'Poppins-Medium',
  },
  filterValues: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
