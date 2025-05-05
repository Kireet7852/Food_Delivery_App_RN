/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DeliveryScreen from '@features/delivery/DeliveryScreen';
import ReorderScreen from '@features/reorder/ReorderScreen';
import DiningScreen from '@features/dining/DiningScreen';
import LiveScreen from '@features/live/LiveScreen';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const UserBottomTab: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen name="Delivery" component={DeliveryScreen} />
      <Tab.Screen name="Reorder" component={ReorderScreen} />
      <Tab.Screen name="Dining" component={DiningScreen} />
      <Tab.Screen name="Live" component={LiveScreen} />
    </Tab.Navigator>
  );
};

export default UserBottomTab;
