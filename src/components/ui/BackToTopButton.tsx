import { TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import CustomText from '@components/global/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from '@components/global/Icon';

const BackToTopButton: FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
      <Icon
        name="arrow-up"
        iconFamily="Ionicons"
        color="#fff"
        size={RFValue(12)}
      />
      <CustomText variant="h6" style={{color: '#fff'}} fontFamily="Okra-Bold">
        Back to Top
      </CustomText>
    </TouchableOpacity>
  );
};

export default BackToTopButton;
