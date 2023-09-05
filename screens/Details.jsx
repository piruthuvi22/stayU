import React, {useState, useEffect, useCallback} from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  VStack,
  Actionsheet,
  useDisclose,
  Spinner,
  useToast,
} from 'native-base';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  StatusBar,
  View,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {AntDesign, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import Comment from '../components/Comment';
import axios from 'axios';
import env from '../env';
import {FacilitiesDetails} from '../components/Facilities';
import {useFocusEffect} from '@react-navigation/native';
import showToast from '../components/core/toast';
import {useAuth} from '../utilities/context';
// import ImageSlider from "react-native-image-slider";

const Details = ({navigation, route}) => {
  const {
    _id,
    PlaceTitle,
    PlaceDescription,
    Cost,
    Rating,
    Facilities,
    uniLocation,
    status,
    Coordinates,
  } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const toast = useToast();
  const [images, setImages] = useState([
    'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014__340.jpg',
    'https://images.pexels.com/photos/15286/pexels-photo.jpg?cs=srgb&dl=pexels-luis-del-r%C3%ADo-15286.jpg&fm=jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg',
    'https://www.undp.org/sites/g/files/zskgke326/files/migration/cn/UNDP-CH-Why-Humanity-Must-Save-Nature-To-Save-Itself.jpeg',
  ]);

  const {
    isOpen: isOpenComm,
    onOpen: onOpenComm,
    onClose: onCloseComm,
  } = useDisclose();
  const {
    isOpen: isOpenFaci,
    onOpen: onOpenFaci,
    onClose: onCloseFaci,
  } = useDisclose();
  const {user} = useAuth();
  const userRole = route?.params?.userRole;
  const [landlord, setLandlord] = useState({});
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);

  // useFocusEffect(
  //   useCallback(() => {
  //     // Code to execute when the screen gains focus
  //     console.log('Screen has gained focus');
  //     getAdd;
  //     // You can place any code you want to run here

  //     return () => {
  //       // Code to clean up when the screen loses focus (optional)
  //       console.log('Screen has lost focus');
  //     };
  //   }, []),
  // );
  const getLandlord = () => {
    console.log('getLandlord:');
    axios
      .get(env.api + '/users/getLandlord', {
        params: {
          placeId: _id,
        },
      })
      .then(res => {
        setLandlord(res.data);
      })
      .catch(err => console.log(err));
  };
  const getStudent = () => {
    axios
      .get(env.api + '/users/getStudent', {
        params: {
          placeId: _id,
        },
      })
      .then(res => {
        setStudent(res.data);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    setLoading(true);
    console.log('Details userRole:', userRole);
    if (userRole === 'student') {
      getLandlord();
      axios
        .get(env.api + '/wish-list/get-status', {
          params: {
            placeId: _id,
            userEmail: user?.email,
          },
        })
        .then(res => {
          // console.log(res.data.status);
          res.data.status ? setIsSaved(true) : setIsSaved(false);
        })
        .catch(err => console.log("Can't get status", err));
      setLoading(false);
    } else {
      getStudent();
      setLoading(false);
    }
    return () => {
      setLandlord({});
      setStudent({});
    };
  }, [_id]);

  const handleSave = () => {
    axios
      .post(env.api + '/wish-list/add-remove-wishlist', {
        placeId: _id,
        userEmail: user?.email,
      })
      .then(res => {
        res.data.status === 'added' ? setIsSaved(true) : setIsSaved(false);
      })
      .catch(err => console.log(err));
  };

  const handleReserve = () => {
    setButtonLoading(true);
    axios
      .post(env.api + '/reservation/new', {
        PlaceId: _id,
        UserEmail: user?.email,
      })
      .then(res => {
        setButtonLoading(false);
        showToast(toast, 'success', 'Reservation Requested');
        navigation.navigate('TabNavigator', {screen: 'Browse'});
      })
      .catch(err => console.log(err));
  };
  const handleAccept = () => {
    setButtonLoading(true);
    axios
      .put(env.api + '/reservation/accepted', {
        PlaceId: _id,
      })
      .then(res => {
        setButtonLoading(false);
        showToast(toast, 'success', 'Reservation Accepted');
        navigation.navigate('home-landlord');
      })
      .catch(err => console.log(err));
  };
  const handleReject = () => {
    setButtonLoading(true);
    axios
      .put(env.api + '/reservation/rejected', {
        PlaceId: _id,
      })
      .then(res => {
        setButtonLoading(false);
        showToast(toast, 'warning', 'Reservation Rejected');
        navigation.navigate('home-landlord');
      })
      .catch(err => console.log(err));
  };

  const handleAvailable = () => {
    setButtonLoading(true);
    axios
      .put(env.api + '/reservation/available', {
        PlaceId: _id,
      })
      .then(res => {
        setButtonLoading(false);
        showToast(toast, 'success', 'Place is now available');
        navigation.navigate('home-landlord');
      })
      .catch(err => console.log(err));
  };

  return (
    <Box h={'full'}>
      {loading ? (
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
        <>
          <HStack
            px={3}
            pt={2}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <VStack>
              <Text style={styles.title}>{PlaceTitle}</Text>
              <Text style={styles.location}>{'Katubedda'}</Text>
            </VStack>
            <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={Rating}
              isDisabled
              size={18}
              selectedColor={'#F24E1E'}
              ratingBackgroundColor="blue"
              // onFinishRating={handleRating}
            />
            <Text style={styles.location}>{Rating}</Text>
          </HStack>
          <Divider />
          <ScrollView
            showsVerticalScrollIndicator={false}
            StickyHeaderComponent={() => <Text>Hello</Text>}
            style={{width: '100%', marginBottom: '60px'}}>
            {/* Description */}
            <Box px={3} py={2}>
              <Text style={styles.desc}>{PlaceDescription}</Text>
            </Box>

            {/* Images */}
            <Box px={3} pt={2}>
              <SliderBox
                images={images}
                sliderBoxHeight={200}
                parentWidth={337}
              />
            </Box>

            {/* Cost & Add to wishlist */}
            <HStack
              justifyContent={'space-between'}
              alignItems="baseline"
              px={3}>
              <HStack alignItems="baseline">
                <Text style={styles.money}>Rs. {Cost}/</Text>
                <Text style={styles.month}>
                  {Facilities?.Payment?.toLowerCase() === 'monthly'
                    ? 'Month'
                    : 'Year'}
                </Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-evenly">
                {/* <Pressable
            android_ripple={{
              color: "#F24E1E22",
              borderless: true,
              radius: 25,
              foreground: true,
            }}
          >
            <AntDesign name="sharealt" size={25} color="#F24E1E" />
          </Pressable> */}
                {userRole === 'student' && (
                  <Pressable
                    android_ripple={{
                      color: '#F24E1E22',
                      borderless: true,
                      radius: 25,
                      foreground: true,
                    }}
                    onPress={handleSave}>
                    <Ionicons
                      name={isSaved ? 'bookmarks' : 'bookmarks-outline'}
                      size={25}
                      color="#FF4E83"
                    />
                  </Pressable>
                )}
              </HStack>
            </HStack>

            <Divider />
            {userRole === 'student' && (
              <>
                <Text style={styles.userTitle}>Landlord</Text>
                <Box
                  style={{
                    paddingStart: 25,
                    flexWrap: 'wrap',
                    paddingBottom: 10,
                  }}>
                  <HStack>
                    <AntDesign name="user" size={17} color="black" />
                    <Text style={styles.landlordSubtitle}>
                      {landlord?.displayName}
                    </Text>
                  </HStack>
                  <HStack>
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={17}
                      color="black"
                    />
                    <Text style={styles.landlordSubtitle}>
                      {landlord?.email}
                    </Text>
                  </HStack>

                  <HStack>
                    <MaterialCommunityIcons
                      name="phone-outline"
                      size={17}
                      color="black"
                    />
                    <Text style={styles.landlordSubtitle}>
                      {landlord?.phoneNumber}
                    </Text>
                  </HStack>
                </Box>
              </>
            )}
            {userRole === 'landlord' &&
              (status === 'PENDING' || status === 'RESERVED') && (
                <>
                  <Text style={styles.userTitle}>Student</Text>
                  <Box
                    style={{
                      paddingStart: 25,
                      flexWrap: 'wrap',
                      paddingBottom: 10,
                    }}>
                    <HStack>
                      <AntDesign name="user" size={24} color="black" />
                      <Text style={styles.landlordSubtitle}>
                        {student?.displayName}
                      </Text>
                    </HStack>
                    <HStack>
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={24}
                        color="black"
                      />
                      <Text style={styles.landlordSubtitle}>
                        {student?.email}
                      </Text>
                    </HStack>

                    <HStack>
                      <MaterialCommunityIcons
                        name="phone-outline"
                        size={24}
                        color="black"
                      />
                      <Text style={styles.landlordSubtitle}>
                        {student?.phoneNumber}
                      </Text>
                    </HStack>
                  </Box>
                </>
              )}

            {/* Facilities bar */}
            {/* <HStack
          style={styles.facilities}
          my={2}
          px={3}
          alignItems="center"
          justifyContent={'space-between'}>
          <Text style={styles.location}>Faclities</Text>
        </HStack> */}
            <Divider />
            {/* Facilities */}
            <FacilitiesDetails info={route.params} />

            {/* Review bar */}
            <HStack
              style={styles.reviews}
              my={2}
              px={3}
              alignItems="center"
              justifyContent={'space-between'}>
              <Text style={styles.location}>Review</Text>
              <HStack alignItems="baseline" mx={1}>
                <AirbnbRating
                  isDisabled
                  showRating={false}
                  count={5}
                  defaultRating={Rating}
                  size={14}
                  selectedColor={'#F24E1E'}
                  ratingBackgroundColor="blue"
                  // onFinishRating={(r) => console.log(r)}
                />

                <AntDesign
                  name="down"
                  size={24}
                  color="#777"
                  onPress={onOpenComm}
                />
              </HStack>
            </HStack>
          </ScrollView>
          {/* Review actionsheet */}
          <Actionsheet isOpen={isOpenComm} onClose={onCloseComm}>
            <Actionsheet.Content>
              <ScrollView
                showsVerticalScrollIndicator={false}
                StickyHeaderComponent={() => <Text>Hello</Text>}
                style={{width: '100%'}}>
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
              </ScrollView>
            </Actionsheet.Content>
          </Actionsheet>
          {/* Bottom bar */}
          {userRole === 'student' ? (
            <Box style={styles.bottomBar}>
              <HStack
                alignItems={'center'}
                h="full"
                justifyContent={'flex-end'}
                px={3}
                w="full">
                <Button
                  mx={2}
                  px={6}
                  style={
                    status === 'RESERVED' || status === 'PENDING'
                      ? styles.disabled
                      : styles.reserve
                  }
                  disabled={
                    status === 'RESERVED' || status === 'PENDING' ? true : false
                  }
                  borderRadius={5}
                  android_ripple={{color: '#ffffff55'}}
                  onPress={handleReserve}>
                  <HStack space={2}>
                    {buttonLoading && <Spinner color="#fff" />}
                    <Text style={{color: '#fff', fontFamily: 'Poppins-Medium'}}>
                      Reserve
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </Box>
          ) : userRole === 'landlord' && status === 'PENDING' ? (
            <Box style={styles.bottomBar}>
              <HStack
                alignItems={'center'}
                h="full"
                justifyContent={'flex-end'}
                px={3}
                w="full">
                <Button
                  mx={2}
                  px={6}
                  style={styles.reject}
                  borderRadius={5}
                  android_ripple={{color: '#ffffff55'}}
                  onPress={handleReject}>
                  <HStack space={2}>
                    {buttonLoading && <Spinner color="#fff" />}
                    <Text style={{color: '#fff', fontFamily: 'Poppins-Medium'}}>
                      Reject
                    </Text>
                  </HStack>
                </Button>
                <Button
                  mx={2}
                  px={6}
                  style={styles.accept}
                  borderRadius={5}
                  android_ripple={{color: '#ffffff55'}}
                  onPress={handleAccept}>
                  <HStack space={2}>
                    {buttonLoading && <Spinner color="#fff" />}
                    <Text style={{color: '#fff', fontFamily: 'Poppins-Medium'}}>
                      Accept
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </Box>
          ) : (
            userRole === 'landlord' &&
            status === 'RESERVED' && (
              <Box style={styles.bottomBar}>
                <HStack
                  alignItems={'center'}
                  h="full"
                  justifyContent={'flex-end'}
                  px={3}
                  w="full">
                  <Button
                    mx={2}
                    px={6}
                    style={styles.available}
                    borderRadius={5}
                    android_ripple={{color: '#ffffff55'}}
                    onPress={handleAvailable}>
                    <HStack space={2}>
                      {buttonLoading && <Spinner color="#fff" />}
                      <Text
                        style={{color: '#fff', fontFamily: 'Poppins-Medium'}}>
                        Available
                      </Text>
                    </HStack>
                  </Button>
                </HStack>
              </Box>
            )
          )}
        </>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#223343',
  },
  location: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#666',
  },
  desc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 16,
  },
  money: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#223343',
  },
  month: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#223343',

    // paddingTop:20
  },
  bottomBar: {
    height: 60,
    width: '100%',
    backgroundColor: '#D8D8D8',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  compare: {
    backgroundColor: '#D8D8D8',
    borderColor: '#FD683D',
    borderWidth: 1,
  },
  reserve: {
    backgroundColor: '#ff638f',
    borderColor: '#f74c7d',
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: '#f9a7be',
    borderColor: '#fc97b4',
    color: '#000',
    borderWidth: 1,
  },
  accept: {
    backgroundColor: '#04a256',
    borderColor: '#027f43',
    borderWidth: 1,
  },
  available: {
    backgroundColor: '#ff638f',
    borderColor: '#f74c7d',
    borderWidth: 1,
  },
  reject: {
    backgroundColor: '#a20420',
    borderColor: '#9b031c',
    borderWidth: 1,
  },

  facilities: {
    backgroundColor: '#E9E9E9',
    height: 40,
  },
  reviews: {
    backgroundColor: '#E9E9E9',
    marginBottom: 60,
    height: 40,
  },
  username: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#F24E1E',
  },

  subtitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#666',
  },
  userTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#ff638f',
    paddingTop: 10,
    paddingStart: 10,
    marginStart: 8,
  },
  landlordSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
});
export default Details;
