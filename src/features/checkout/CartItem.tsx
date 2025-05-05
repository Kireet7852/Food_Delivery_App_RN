import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {FC, useMemo} from 'react';
import {useAppDispatch} from '@states/reduxHook';
import {useStyles} from 'react-native-unistyles';
import {clearRestaurantCart} from '@states/reducers/cartSlices';
import {cartStyles} from '@unistyles/cartStyles';
import CustomText from '@components/global/CustomText';
import {navigate} from '@utils/NavigationUtils';
import {Colors} from '@unistyles/Constants';
import Icon from '@components/global/Icon';

const CartItem: FC<{item: any}> = ({item}) => {
  const dispatch = useAppDispatch();
  const {styles} = useStyles(cartStyles);
  const deleteCart = async (id: any) => {
    dispatch(clearRestaurantCart({restaurant_id: id}));
  };

  const totalItems = useMemo(() => {
    return item?.items?.reduce((acc: any, item: any) => {
      acc += item.quantity;
      return acc;
    }, 0);
  }, [item?.items]);

  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.flexRowGap}>
        <Image
          source={{uri: item?.restaurant?.imageUrl}}
          style={styles.image}
        />
        <View>
          <CustomText fontFamily="Okra-Medium" fontSize={10}>
            {item?.restaurant?.name}
          </CustomText>

          <TouchableOpacity
            onPress={() => navigate('RestaurantScreen', {item: item})}
            style={styles.flexRow}>
            <CustomText
              fontFamily="Okra-Medium"
              fontSize={9}
              color={Colors.active}
              style={{top: -1}}>
              View Menu
            </CustomText>
            <Icon
              name="chevron-right"
              iconFamily="MaterialIcons"
              size={12}
              color={Colors.active}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
