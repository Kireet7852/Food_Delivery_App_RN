import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC, use, useEffect} from 'react';
import {useAppSelector} from '@states/reduxHook';
import {selectRestaurantCartItem} from '@states/reducers/cartSlices';
import {modelStyles} from '@unistyles/modelStyles';
import {useStyles} from 'react-native-unistyles';
import CustomText from '@components/global/CustomText';
import {Colors} from '@unistyles/Constants';
import { ScrollView } from 'react-native-gesture-handler';
import MiniFoodCard from '@components/restaurant/MiniFoodCard';

const RepeatItemModal: FC<{
  item: any;
  restaurant: any;
  onOpenAddModal: () => void;
  closeModal: () => void;
}> = ({item, onOpenAddModal, restaurant, closeModal}) => {
  const cartItem = useAppSelector(
    selectRestaurantCartItem(restaurant?.id, item?.id),
  );
  const {styles} = useStyles(modelStyles);

  useEffect(() => {
    if (!cartItem) {
      closeModal();
    }
  }, [cartItem]);

  return (
    <View>
      <View style={styles.noShadowHeaderContainer}>
        <View style={styles.flexRowGap}>
          <CustomText fontFamily="Okra-Bold" fontSize={13}>
            Repeat last used customization?
          </CustomText>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainerWhiteBackground}>
          {
            cartItem?.customizations?.map((cus, index) => {
              return (
                <MiniFoodCard
                item={item}
                cus = {cus}
                key={index}
                restaurant={restaurant}/>
              )
            })
          }
        </ScrollView>

        <View style={styles.noShadowFooterContainer}>
          <TouchableOpacity onPress={closeModal}>
            <CustomText
              fontFamily="Okra-Bold"
              color={Colors.active}
              fontSize={11}>
              + Add nwe customization
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RepeatItemModal;
