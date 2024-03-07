import {createContext, useContext} from 'react';
import {AsyncTrunk} from 'mobx-sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PolygonStore} from './PolygonStore';
import {BtcStore} from './BtcStore';

export class RootStore {
  btcClasses: BtcStore;
  polygonClasses: PolygonStore;

  constructor() {
    this.btcClasses = new BtcStore();
    this.polygonClasses = new PolygonStore();
  }
}

export const rootStore = new RootStore();

export const trunk = new AsyncTrunk(rootStore, {
  storage: AsyncStorage,
});

export const StoreContext = createContext(rootStore);
export const StoreProvider = StoreContext.Provider;
export const useStore = () => useContext(StoreContext);
