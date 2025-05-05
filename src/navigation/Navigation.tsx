import SplashScreen from '@features/auth/SplashScreen';
import {FC} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@features/auth/LoginScreen';
import {navigationRef} from '@utils/NavigationUtils';
import AnimatedTabs from '@features/tabs/AnimatedTabs';
import RestaurantScreen from '@features/restaurants/RestaurantScreen';
import CheckoutScreen from '@features/checkout/CheckoutScreen';
import OrderSuccessScreen from '@features/checkout/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="RestaurantScreen" component={RestaurantScreen} />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{animation: 'fade'}}
          name="UserBottomTab"
          component={AnimatedTabs}
        />
      </Stack.Navigator>
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccessScreens" component={OrderSuccessScreen} />
    </NavigationContainer>
  );
};

export default Navigation;
