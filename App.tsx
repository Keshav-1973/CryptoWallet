import React, {useEffect, useState} from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import {rootStore, StoreProvider, trunk} from './src/store';
import {ActivityIndicator, View} from 'react-native';

function App(): JSX.Element {
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await trunk.init();
      setIsStoreLoaded(true);
    };
    rehydrate();
  }, []);

  if (!isStoreLoaded) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <StoreProvider value={rootStore}>
        <MainNavigator />
      </StoreProvider>
    );
  }
}

export default App;
