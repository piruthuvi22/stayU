import {
  Box,
  Checkbox,
  HStack,
  Radio,
  Slider,
  VStack,
  Button,
} from 'native-base';
import React from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import Constants from 'expo-constants';

export default Filter = () => {
  return (
    <Box height={'full'} w={'full'} pt={Constants.statusBarHeight} px={2}>
      <VStack mx={2} mb={3}>
        <Text style={styles.categoryTitle}>Distance</Text>
        <Slider
          w="full"
          defaultValue={2}
          minValue={1}
          maxValue={5}
          accessibilityLabel="hello world"
          step={1}>
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>
        <HStack justifyContent={'space-between'}>
          <Text style={styles.slideVal}>{'<100m'}</Text>
          <Text style={styles.slideVal}>{'<200m'}</Text>
          <Text style={styles.slideVal}>{'<500m'}</Text>
          <Text style={styles.slideVal}>{'<1km'}</Text>
          <Text style={styles.slideVal}>{'>1km'}</Text>
        </HStack>
      </VStack>

      <VStack mx={2} mb={3}>
        <Text style={styles.categoryTitle}>Room type</Text>
        <Radio.Group
          defaultValue={['A', 'B']}
          accessibilityLabel="pick an item"
          onChange={values => {}}>
          <Radio value="single" my="0.5" _text={{style: styles.filterValues}}>
            Single
          </Radio>
          <Radio value="shared" my="0.5" _text={{style: styles.filterValues}}>
            Shared
          </Radio>
          <Radio value="house" my="0.5" _text={{style: styles.filterValues}}>
            House
          </Radio>
        </Radio.Group>
      </VStack>

      <VStack mx={2} mb={3}>
        <Text style={styles.categoryTitle}>Wash room type</Text>
        <Checkbox.Group
          // defaultValue={["A", "B"]}
          accessibilityLabel="pick an item"
          onChange={values => {}}>
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

      <VStack mx={2} mb={3}>
        <Text style={styles.categoryTitle}>Offering meals</Text>
        <Radio.Group
          defaultValue={['A', 'B']}
          accessibilityLabel="pick an item"
          onChange={values => {}}>
          <Radio
            value="yes"
            size={'sm'}
            my="0.5"
            _text={{style: styles.filterValues}}>
            Yes
          </Radio>
          <Radio
            value="no"
            size={'sm'}
            my="0.5"
            _text={{style: styles.filterValues}}>
            No
          </Radio>
          <Radio
            value="both"
            size={'sm'}
            my="0.5"
            _text={{style: styles.filterValues}}>
            Both
          </Radio>
        </Radio.Group>
      </VStack>

      <VStack mx={2} mb={3}>
        <Text style={styles.categoryTitle}>Facilities</Text>
        <Checkbox.Group
          // defaultValue={["A", "B"]}
          accessibilityLabel="pick an item"
          onChange={values => {}}>
          <Checkbox
            value="traditional"
            my="0.5"
            size={'sm'}
            _text={{style: styles.filterValues}}>
            Furniture
          </Checkbox>
          <Checkbox
            value="western"
            my="0.5"
            size={'sm'}
            _text={{style: styles.filterValues}}>
            {'Bed & Mattress'}
          </Checkbox>
          <Checkbox
            value="attached"
            my="0.5"
            size={'sm'}
            _text={{style: styles.filterValues}}>
            AC
          </Checkbox>
          <Checkbox
            value="common"
            my="0.5"
            size={'sm'}
            _text={{style: styles.filterValues}}>
            Celing fan, Wall fan, Table fan
          </Checkbox>
          <Checkbox
            value="common"
            my="0.5"
            size={'sm'}
            _text={{style: styles.filterValues}}>
            Cooking facilities
          </Checkbox>
        </Checkbox.Group>
      </VStack>

      <VStack mx={2} mb={3}>
        <Text style={styles.categoryTitle}>Payment</Text>
        <Radio.Group
          defaultValue={['A', 'B']}
          accessibilityLabel="pick an item"
          onChange={values => {}}>
          <Radio
            value="monthly"
            size={'sm'}
            my="0.5"
            _text={{style: styles.filterValues}}>
            Monthly
          </Radio>
          <Radio
            value="no"
            size={'sm'}
            my="0.5"
            _text={{style: styles.filterValues}}>
            Contract
          </Radio>
        </Radio.Group>
      </VStack>

      <HStack mx={2} mb={3} justifyContent={'flex-end'}>
        <Button
          p={2}
          title="Close drawer"
          width={20}
          _text={{style: {fontFamily: 'Poppins-Medium'}}}
          onPress={onClose}>
          Filter
        </Button>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    top: Constants.statusBarHeight,
    backgroundColor: '#eee',
    paddingBottom: 60,
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#eee',
    padding: 5,
    // height: 50,
    // zIndex: 3000,
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
  fab: {
    // position: "absolute",
    // bottom: 80,
    // right: 20,
  },
  fabBtn: {
    backgroundColor: '#223343',
    borderWidth: 1,
    borderColor: '#FF754E',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  categoryTitle: {
    fontSize: 20,
    color: '#FD683D',
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
});
