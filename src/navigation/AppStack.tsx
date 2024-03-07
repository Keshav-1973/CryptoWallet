import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FeatureRoutes} from './ScreenTypes';
import BitCoin from '../screens/AppStack/BitCoin/BitCoin';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Polygon from '../screens/AppStack/Polygon/Polygon';
import {Text} from 'react-native';

const {Navigator, Screen} = createNativeStackNavigator<any>();

const Tab = createBottomTabNavigator<any>();

const AppStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={FeatureRoutes.APPBOARDING.TAB} component={TabNavigator} />
      <Screen name={FeatureRoutes.APPBOARDING.BITCOIN} component={BitCoin} />
    </Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={FeatureRoutes.APPBOARDING.BITCOIN}>
      <Tab.Screen
        name={FeatureRoutes.APPBOARDING.BITCOIN}
        component={BitCoin}
        options={{
          title: 'Bitcoin',
          tabBarLabel: 'Bitcoin',
          tabBarIcon: ({color, size}) => (
            <Text style={{color: color, fontSize: size}}>B</Text>
          ),
        }}
      />
      <Tab.Screen
        name={FeatureRoutes.APPBOARDING.POLYGON}
        component={Polygon}
        options={{
          title: 'Polygon',
          tabBarLabel: 'Polygon',
          tabBarIcon: ({color, size}) => (
            <Text style={{color: color, fontSize: size}}>P</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
