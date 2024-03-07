import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default MainNavigator;
