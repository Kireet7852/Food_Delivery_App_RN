import { View } from 'react-native'
import React, { FC } from 'react'
import { loginStyles } from '@unistyles/authStyles';
import { useStyles } from 'react-native-unistyles';
import CustomText from '@components/global/CustomText';

const BreakerText:FC<{text: string}> = ({text}) => {

    const {styles} = useStyles(loginStyles);

  return (
    <View style={styles.breakerContainer}>
      <View style={styles.horizontalLine}>
        <CustomText
        fontSize={12}
        fontFamily='Okra-Medium'
        style={styles.breakerText}>
            {text}
        </CustomText>
      </View>
    </View>
  )
}

export default BreakerText