import {Animated, TouchableOpacity, ViewStyle} from 'react-native';
import React, {FC} from 'react';

interface ScalePressProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const ScalePress: FC<ScalePressProps> = ({
  onPress,
  onLongPress,
  children,
  style,
}) => {
  const scaleValue = new Animated.Value(1);
  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      activeOpacity={1}
      style={{...style}}
      >
        <Animated.View style={{transform:[{scale: scaleValue}], width: '100%'}}>
            {children}
        </Animated.View>
      </TouchableOpacity>
  )
};
