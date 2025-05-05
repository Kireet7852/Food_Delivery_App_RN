import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC, memo, useCallback, useRef} from 'react';
import {foodStyles} from '@unistyles/foodStyles';
import {useStyles} from 'react-native-unistyles';
import CustomText from '@components/global/CustomText';
import {Colors} from '@unistyles/Constants';
import {ScalePress} from '@components/ui/ScalePress';
import Icon from '@components/global/Icon';
import {RFValue} from 'react-native-responsive-fontsize';
import AnimatedNumber from 'react-native-animated-numbers';
import {useAppDispatch, useAppSelector} from '@states/reduxHook';
import { addItemToCart, removeCustomizableItem, removeItemFromCart, selectRestaurantCartItem } from '@states/reducers/cartSlices';
import CustomModal from '@components/modal/CustomModal';
import AddItemModal from '@components/modal/AddItemModal';
import RepeatItemModal from '@components/modal/RepeatItemModal';
import RemoveItemModal from '@components/modal/RemoveItemModal';

const AddButton: FC<{item: any; restaurant: any}> = ({item, restaurant}) => {
  const dispatch = useAppDispatch();
  const {styles} = useStyles(foodStyles);
  const cart = useAppSelector(selectRestaurantCartItem(restaurant?.id, item?.id));
  const modalRef = useRef<any>(null);

  const openAddModal = () => {
    modalRef?.current?.openModal(
      <AddItemModal
        item={item}
        onClose={() => modalRef?.current?.closeModal()}
        restaurant={restaurant} 
        />
    );
  }

  const openRepeatModal = () => {
    modalRef?.current?.openModal(
      <RepeatItemModal
        item={item}
        onClose={() => modalRef?.current?.closeModal()}
        restaurant={restaurant} 
        />
    );
  }

  const openRemoveModal = () => {
    modalRef?.current?.openModal(
      <RemoveItemModal
        item={item}
        onClose={() => modalRef?.current?.closeModal()}
        restaurant={restaurant} 
        />
    );
  }

  const addCardHandler = useCallback(() => {
    if (item?.isCustomizable) {
        if(cart != null){
          openRepeatModal();
          return ;
        }
        openAddModal();
    } else {
        dispatch(
            addItemToCart({
                restaurant: restaurant,
                item: {...item, customizations: []},
            })
        )
    }
  }, [dispatch, item, restaurant, cart]);
  const removeCartHandler = useCallback(() => {
    if (item?.isCustomizable) {
      if(cart?.customizations && cart?.customizations.length > 1){
        openRemoveModal();
        return ;
      }
      dispatch(
        removeCustomizableItem({
            restaurant_id: restaurant?.id,
            customizationsId: cart?.customizations![0]?.id,
            itemId: item?.id,
        })
      )
    } else {
        dispatch(
            removeItemFromCart({
                restaurant_id: restaurant?.id,
                itemId: item?.id,
            })
        )
    }
  }, [dispatch, item, restaurant, cart]);

  return (
    <>
    <CustomModal ref={modalRef} />
      <View style={styles.addButtonContainer(cart !== null)}>
        {cart ? (
          <View style={styles.selectedContainer}>
            <ScalePress onPress={removeCartHandler}>
              <Icon
                iconFamily="MaterialCommunityIcons"
                color="#fff"
                name="minus-thick"
                size={RFValue(13)}
              />
            </ScalePress>
            <AnimatedNumber
              includeComma={false}
              animationDuration={300}
              animateToNumber={cart?.quantity}
              fontStyle={styles.animatedCount}
            />
            <ScalePress onPress={addCardHandler}>
              <Icon
                iconFamily="MaterialCommunityIcons"
                color="#fff"
                name="plus-thick"
                size={RFValue(13)}
              />
            </ScalePress>
          </View>
        ) : (
          <TouchableOpacity
            onPress={addCardHandler}
            style={styles.addToCollectionContainer}
            activeOpacity={0.6}
            accessibilityLabel="Add item to cart">
            <CustomText
              fontFamily="Okra-Bold"
              variant="h5"
              color={Colors.primary}>
              Add
            </CustomText>
            <CustomText
              variant="h5"
              color={Colors.primary}
              style={styles.plusSmallIcon}>
              +
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
      {item?.isCustomizable && (
        <CustomText fontFamily="Okra-Medium" style={styles.customizeText}>
          Customisable
        </CustomText>
      )}
    </>
  );
};

export default memo(AddButton);
