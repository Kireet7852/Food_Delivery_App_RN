import {View, Text} from 'react-native';
import React from 'react';
import {cardStyles} from '@unistyles/cardStyles';
import {useStyles} from 'react-native-unistyles';
import RestaurantCard from './RestaurantCard';
import CustomText from '@components/global/CustomText';
import {FlatList} from 'react-native-gesture-handler';
import {recommendedListData} from '@utils/dummyData';

const RestaurantList = () => {
  const {styles} = useStyles(cardStyles);

  const renderItem = ({item}: any) => {
    return <RestaurantCard item={item} />;
  };
  return (
    <View>
      <CustomText
        style={styles.centerText}
        fontFamily="Okra-Bold"
        fontSize={12}>
        1823 restaurants delivering to you
      </CustomText>
      <CustomText
        style={styles.centerText}
        fontFamily="Okra-Medium"
        fontSize={12}>
        FEATURED
      </CustomText>

      <FlatList
        data={recommendedListData}
        scrollEventThrottle={16}
        bounces={false}
        showsVerticalScrollIndicator
        renderItem={renderItem}
        keyExtractor={item => item?.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={() => {
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.4,
              }}>
              <CustomText fontFamily="Okra-Medium" variant="h1">
                Made with ❤️
              </CustomText>
              <CustomText fontFamily="Okra-Medium" variant="h5">
                by - Kireet Verma
              </CustomText>
            </View>
          );
        }}
      />
    </View>
  );
};

export default RestaurantList;
