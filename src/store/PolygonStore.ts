import {ethers} from 'ethers';
import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
import {API_ENDPOINTS} from '../constants/Constants';
import axios from 'axios';

type data = {
  address: string;
  balance: number;
};

export class PolygonStore {
  loading: boolean = false;
  etherBalance: number = 0;
  address: string = '';
  txDetails = {} as ethers.providers.TransactionResponse;
  maticPrice: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  toJSON() {
    const {etherBalance, address, loading, txDetails, ...rest} = this;
    return rest;
  }

  getMaticPrice = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.coinGecko}price?ids=matic-network&vs_currencies=usd`,
      );

      const mtcData = response.data['matic-network'].usd;
      this.setMtcPrice(mtcData);
    } catch (error) {
      console.error('Error fetching Matic price:', error);
      return null;
    }
  };

  getEtherBalance = async (privateKey: string) => {
    this.setLoading(true);
    try {
      const wallet = new ethers.Wallet(privateKey);
      const provider = new ethers.providers.JsonRpcProvider(API_ENDPOINTS.rpcM);
      const connectedWallet = wallet.connect(provider);
      const address = await connectedWallet.getAddress();
      const balance = await connectedWallet.getBalance();
      const maticBalance = ethers.utils.formatEther(balance);
      const data: data = {
        address: address,
        balance: Number(maticBalance),
      };
      this.setData(data);
    } catch (error) {
      console.error('Error getting wallet balance:', error);
    } finally {
      this.setLoading(false);
    }
  };

  sendPolygonTransaction = async (
    privateKey: string,
    amount: string,
    raddress: string,
  ) => {
    this.setLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider(API_ENDPOINTS.rpcM);
      const wallet = new ethers.Wallet(privateKey, provider);
      const balance = this.etherBalance;

      if (balance < Number(amount)) {
        Alert.alert(
          'Error:',
          'enter amount less than or equal to your balance',
        );
      } else {
        const tx = {
          to: raddress,
          value: ethers.utils.parseEther(amount),
        };

        const txResponse = await wallet.sendTransaction(tx);

        this.setTxDetails(txResponse);
      }
    } catch (error) {
      Alert.alert('Error sending Polygon transaction:', JSON.stringify(error));
    } finally {
      this.setLoading(false);
    }
  };

  // observables can be modifies by an action only
  setData = (data: data) => {
    this.etherBalance = data.balance;
    this.address = data.address;
  };
  setLoading = (data: boolean) => {
    this.loading = data;
  };
  setTxDetails = (data: ethers.providers.TransactionResponse) => {
    this.txDetails = data;
  };
  setMtcPrice = (data: number) => {
    this.maticPrice = data;
  };
}
