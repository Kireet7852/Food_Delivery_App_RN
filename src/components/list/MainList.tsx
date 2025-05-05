import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  ViewToken,
} from 'react-native';
import React, {FC, use, useRef, useState} from 'react';
import ExploreList from '@components/list/ExploreList';
import RestaurantList from './RestaurantList';
import {useStyles} from 'react-native-unistyles';
import {restaurantStyles} from '@unistyles/restuarantStyles';
import {useSharedState} from '@features/tabs/SharedContext';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import BackToTopButton from '@components/ui/BackToTopButton';
import { filtersOption } from '@utils/dummyData';
import SortingAndFilter from '@components/home/SortingAndFilter';

const sectionedData = [
  {title: 'Explore', data: [{}], renderItem: () => <ExploreList />},
  {title: 'Restaurants', data: [{}], renderItem: () => <RestaurantList />},
];

const MainList: FC = () => {
  const {styles} = useStyles(restaurantStyles);
  const {scrollY, scrollToTop, scrollYGlobal} = useSharedState();
  const previousScrollYTopButton = useRef<number>(0);
  const prevScrollY = useRef(0);
  const sectionListRef = useRef<SectionList>(null);

  const [isRestaurantVisible, setIsRestaurantsVisible] = useState(false);
  const [isNearEnd, setIsNearEnd] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentScrollY > prevScrollY.current;

    scrollY.value = isScrollingDown
      ? withTiming(1, {duration: 300})
      : withTiming(0, {duration: 300});

    scrollYGlobal.value = currentScrollY;
    prevScrollY.current = currentScrollY;

    const containerHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event?.nativeEvent?.layoutMeasurement?.height;
    const offset = event?.nativeEvent?.contentOffset?.y;

    setIsNearEnd(offset + layoutHeight >= containerHeight - 500);
  };

  const handleScrollToTop = async () => {
    scrollToTop();
    sectionListRef.current?.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 0,
      viewPosition: 0,
    });
  };

  const backToTopStyle = useAnimatedStyle(() => {
    const isScollingUp =
      scrollYGlobal.value < previousScrollYTopButton.current &&
      scrollYGlobal.value > 180;
    const opacity = withTiming(
      isScollingUp && (isRestaurantVisible || isNearEnd) ? 1 : 0,
      {duration: 300},
    );
    const translateY = withTiming(
      isScollingUp && (isRestaurantVisible || isNearEnd) ? 0 : 10,
      {duration: 300},
    );
    previousScrollYTopButton.current = scrollToTop.value;

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const viewabilityItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    const restaurantVisible = viewableItems.some(
      item => item?.section?.title === 'Restaurants' && item?.isViewable,
    );

    setIsRestaurantsVisible(restaurantVisible);
  };
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <>
     <Animated.View style={[styles.backToTopButton, backToTopStyle ]}>
        <BackToTopButton onPress={handleScrollToTop} />
     </Animated.View>
      <SectionList 
      overScrollMode='always'
      onScroll={handleScroll}
      ref={sectionListRef}
      scrollEventThrottle={16}
      sections={sectionedData} 
      bounces={false}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
      stickySectionHeadersEnabled={true}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewabilityItemsChanged}
      renderSectionHeader={({section}) => {
        if(section.title === 'Restaurants') {
            return null;
        }
        return (
            <Animated.View style={[isRestaurantVisible || isNearEnd ? styles.shadowBottom : null,]}>
                <SortingAndFilter menuTitle="Sort" options={filtersOption} />
            </Animated.View>
        )
      }}
      />
    </>
  );
};

export default MainList;
