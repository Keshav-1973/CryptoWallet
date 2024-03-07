import axios from 'axios';
import {makeAutoObservable} from 'mobx';
import {API_ENDPOINTS} from '../constants/Constants';

type utxoData = {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
};

export class BtcStore {
  loading: boolean = false;
  usdt_price: number = 0;
  btc_price: number = 0;
  isAddressValid: boolean = false;
  utxo: Array<utxoData> = [];
  balance: number = 0;
  utxoDetails: any = null;
  transactionID: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  toJSON() {
    const {isAddressValid, balance, loading, utxoDetails, ...rest} = this;
    return rest;
  }

  getUSDTPrice = async () => {
    try {
      const usdtResponse = await axios.get(
        `${API_ENDPOINTS.coinGecko}price?ids=tether&vs_currencies=usd`,
      );
      const usdtData = usdtResponse?.data?.tether?.usd;
      this.setUSDT(usdtData);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  getBTCPrice = async () => {
    try {
      const bitcoinResponse = await axios.get(
        `${API_ENDPOINTS.coinGecko}price?ids=bitcoin&vs_currencies=usd`,
      );
      const usdtData = bitcoinResponse?.data?.bitcoin?.usd;
      this.setBTC(usdtData);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  validateBitcoinAddress = async (address: string) => {
    this.setLoading(true);
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.memPool}v1/validate-address/${address}`,
      );
      if (response?.data?.isvalid) {
        this.setValid(true);
      } else {
        this.setValid(false);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      this.setLoading(false);
    }
  };

  getUTXO = async (sourceAddress: string) => {
    this.setLoading(true);

    try {
      const utxos: {data: Array<utxoData>} = await axios.get(
        `${API_ENDPOINTS.memPool}address/${sourceAddress}/utxo`,
      );
      let balance = 0;

      utxos.data.forEach(utxo => {
        if (utxo?.status?.confirmed) {
          balance += utxo.value;
        }
      });

      this.setBalance(balance);
      this.setUTXO(utxos?.data);
    } catch (error) {
      console.error('Error fetching utxos:', error);
    } finally {
      this.setLoading(false);
    }
  };

  getUTXODetails = async (utxo: utxoData) => {
    try {
      const utxoDetails = await axios.get(
        `${API_ENDPOINTS.memPool}tx/${utxo.txid}`,
      );
      const outputs = utxoDetails?.data?.vout;
      const inputScriptPubKey = outputs[utxo?.vout]?.scriptpubkey;
      this.setUtxoDetails(inputScriptPubKey);
    } catch (error) {
      console.error('Error fetching utxos:', error);
    }
  };

  postTransaction = async (transaction: string) => {
    this.setLoading(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.memPool}tx`,
        transaction,
      );
      const output = response?.data;
      this.setTxID(output);
    } catch (error) {
      console.error('Error fetching utxos:', error);
    } finally {
      this.setLoading(false);
    }
  };

  // observables can be modifies by an action only

  setUSDT = (data: number) => {
    this.usdt_price = data;
  };
  setBTC = (data: number) => {
    this.btc_price = data;
  };
  setValid = (data: boolean) => {
    this.isAddressValid = data;
  };
  setUTXO = (data: Array<utxoData>) => {
    this.utxo = data;
  };
  setBalance = (data: number) => {
    this.balance = data;
  };
  setUtxoDetails = (data: any) => {
    this.utxoDetails = data;
  };
  setTxID = (data: any) => {
    this.transactionID = data;
  };
  setLoading = (data: boolean) => {
    this.loading = data;
  };
}
