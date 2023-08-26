import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Image,
  VStack,
  Actionsheet,
  useDisclose,
} from 'native-base';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import Comment from '../components/Comment';
import axios from 'axios';
import env from '../env';
import {FacilitiesDetails} from '../components/Facilities';
// import ImageSlider from "react-native-image-slider";

const Details = ({route}) => {
  const {_id, PlaceTitle, Cost, Rating, Facilities, uniLocation, Coordinates} =
    route.params;
  const [isSaved, setIsSaved] = useState(false);
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

  useEffect(() => {
    console.log('Details');
    axios
      .get(env.api + '/wish-list/get-status/' + _id)
      .then(res => {
        console.log(res.data.status);
        res.data.status ? setIsSaved(true) : setIsSaved(false);
      })
      .catch(err => console.log(err));
  }, [_id]);

  const handleSave = () => {
    axios
      .post(env.api + '/wish-list/add-remove-wishlist/' + _id)
      .then(res => {
        res.data.status === 'added' ? setIsSaved(true) : setIsSaved(false);
      })
      .catch(err => console.log(err));
  };

  const handleReserve = async () => {
    try {
      let response = await axios.post(env.api + '/reservation/new/', {
        PlaceId: _id,
        Username: 'user1',
      });
      console.log('Reservation Done', response.data);
    } catch (error) {
      console.log('error', error.response.data.msg);
    }
  };
  return (
    <Box h={'full'}>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        StickyHeaderComponent={() => <Text>Hello</Text>}
        style={{width: '100%', marginBottom: '60px'}}>
        {/* Description */}
        <Box px={3}>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur,
            ipsa repudiandae ullam earum minima ducimus dolorem ut dolores quas
            sapiente, similique dicta itaque veniam deserunt neque illo, quae
            deleniti aliquam! Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Dolorem obcaecati molestias error ullam ab exercitationem.
            Quam autem, quis fuga qui rerum ducimus officiis aliquam laudantium
            enim tenetur temporibus Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ea, nam earum itaque maxime deleniti magnam
            reiciendis unde enim? Porro non dolores similique possimus
            consectetur nulla, praesentium maiores voluptatum quo delectus
            repellat accusamus ad quis provident impedit, earum quae rerum
            velit.
          </Text>
        </Box>

        {/* Images */}
        <Box px={3} pt={2}>
          <SliderBox images={images} sliderBoxHeight={200} />
        </Box>

        {/* Cost & Add to wishlist */}
        <HStack justifyContent={'space-between'} alignItems="baseline" px={3}>
          <HStack alignItems="baseline">
            <Text style={styles.money}>Rs. {Cost}/</Text>
            <Text style={styles.month}>Month</Text>
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
                color="#F24E1E"
              />
            </Pressable>
          </HStack>
        </HStack>

        <Divider />

        {/* Facilities bar */}
        <HStack
          style={styles.facilities}
          my={2}
          px={3}
          alignItems="center"
          justifyContent={'space-between'}>
          <Text style={styles.location}>Faclities</Text>
        </HStack>

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
            style={styles.compare}
            borderRadius={5}
            _text={{
              style: {color: '#FD683D', fontFamily: 'Poppins-Medium'},
            }}
            android_ripple={{color: '#ffffff55'}}>
            Compare
          </Button>
          <Button
            mx={2}
            px={6}
            style={styles.reserve}
            borderRadius={5}
            _text={{style: {color: '#fff', fontFamily: 'Poppins-Medium'}}}
            android_ripple={{color: '#ffffff55'}}
            onPress={handleReserve}>
            Reserve
          </Button>
        </HStack>
      </Box>
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
    fontSize: 13,
    color: '#777',
    lineHeight: 16,
  },
  money: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#223343',
  },
  month: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
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
    backgroundColor: '#FD683D',
    borderColor: '#FD683D',
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
});
export default Details;
