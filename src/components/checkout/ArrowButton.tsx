/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {FC} from 'react';
import {Colors} from '@unistyles/Constants';
import {StyleSheet} from 'react-native';
import CustomText from '@components/global/CustomText';
import Icon from '@components/global/Icon';
import {RFValue} from 'react-native-responsive-fontsize';

interface ArrowButtonProps {
  title: string;
  onPress?: () => void;
  price?: number;
  loading?: boolean;
}

const ArrowButton: FC<ArrowButtonProps> = ({
  loading,
  title,
  onPress,
  price,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[
        styles.bin,
        {justifyContent: price !== 0 ? 'space-between' : 'center'},
      ]}>
      {price != 0 && price && (
        <View>
          <CustomText
            variant="h6"
            style={{color: '#fff'}}
            fontFamily="Okra-Bold">
            Rs {price + 34}.0
          </CustomText>
          <CustomText
            fontSize={9}
            style={{color: '#fff'}}
            fontFamily="Okra-Medium">
            TOTAL
          </CustomText>
        </View>
      )}

      <View style={styles.flexRow}>
        <CustomText
          fontSize={12}
          style={{color: '#fff', top: -1}}
          fontFamily="Okra-Bold">
          {title}
        </CustomText>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="white"
            style={{marginHorizontal: 5}}
          />
        ) : (
          <Icon
            name="arrow-right"
            color="#fff"
            size={RFValue(18)}
            iconFamily="MaterialIcons"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  bin: {
    backgroundColor: Colors.active,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
