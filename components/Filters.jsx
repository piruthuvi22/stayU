import React from 'react';

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
