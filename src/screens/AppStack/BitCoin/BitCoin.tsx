import '../../../../shim';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {AppScreenProps} from '../AppRoutes';
import CurrencyCard from '../../../components/CurrencyCard/CurrencyCard';
import {API_ENDPOINTS, BTC_URI, USDT_URI} from '../../../constants/Constants';
import {Transaction, Networks, Unit} from 'bitcore-lib';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../../store';
import InputField from '../../../components/InputField/InputField';
import ECPairFactory from 'ecpair';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import * as bitcoin from 'bitcoinjs-lib';
import {isValidWIFPrivateKey} from '../../../utils/validators';
import Loader from '../../../components/Loader/Loader';
import makeAlert, {
  alertProps,
} from '../../../components/CustomAlert/CustpmAlert';

const ECPair = ECPairFactory(ecc);

type Data = {
  id: string;
  uri: string;
  label: string;
  subLabel: string;
  price: number;
};

const BitCoin = observer((props: AppScreenProps<'/app/bitcoin'>) => {
  const rootstore = useStore();
  const [privateKey, setPrivateKey] = useState('');
  const [sourceAddress, setSourceAddress] = useState('');
  const [raddress, setRaddress] = useState('');
  const [amount, setAmount] = useState('');

  const {loading, btc_price, usdt_price} = rootstore.btcClasses;

  const DATA: Data[] = [
    {
      id: 'BTC',
      uri: BTC_URI,
      label: 'BTC',
      subLabel: 'Bitcoin',
      price: btc_price,
    },
    {
      id: 'USDT',
      uri: USDT_URI,
      label: 'USDT',
      subLabel: 'TetherUS',
      price: usdt_price,
    },
  ];

  useEffect(() => {
    rootstore.btcClasses.getBTCPrice();
    rootstore.btcClasses.getUSDTPrice();
  }, []);

  const importWallet = () => {
    if (isValidWIFPrivateKey(privateKey)) {
      const decoded = ECPair.fromWIF(privateKey, bitcoin.networks.testnet);
      const keyPair = decoded;
      const {address} = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: bitcoin.networks.testnet,
      });
      if (address) {
        setSourceAddress(address);
        rootstore.btcClasses.getUTXO(address);
      }
    }
  };

  const btcSend = async () => {
    if (!raddress) {
      Alert.alert('Error', 'Enter address');
      return;
    }
    await rootstore.btcClasses.validateBitcoinAddress(raddress);

    if (rootstore.btcClasses.isAddressValid) {
      try {
        await rootstore.btcClasses.getUTXO(sourceAddress);
        const utxos = rootstore.btcClasses.utxo;

        if (Array.isArray(utxos) && utxos.length) {
          const recieverAddress = raddress;
          const minerFee = Unit?.fromBTC(0.000027)?.toSatoshis(); //average time
          const transactionAmount = Unit?.fromBTC(Number(amount))?.toSatoshis();
          const balance = rootstore.btcClasses.balance;

          let inputs: Transaction.UnspentOutput[];

          if (balance - transactionAmount - minerFee > 0) {
            //create a new transaction
            try {
              for (const utxo of utxos) {
                await rootstore.btcClasses.getUTXODetails(utxo);
                const utxoDetails = rootstore.btcClasses.utxoDetails;
                const unspentOutputs = utxos.map(utxo => {
                  return new Transaction.UnspentOutput({
                    address: sourceAddress,
                    txId: utxo.txid,
                    outputIndex: utxo.vout,
                    script: utxoDetails,
                    satoshis: utxo.value,
                  });
                });
                inputs = unspentOutputs;
              }
              if (Array.isArray(inputs)) {
                const bitcore_transaction = new Transaction(Networks.testnet)
                  .from(inputs)
                  .to(recieverAddress, transactionAmount)
                  .fee(minerFee)
                  .change(sourceAddress)
                  .sign(privateKey)
                  .serialize();
                await rootstore.btcClasses.postTransaction(bitcore_transaction);

                const txID = rootstore.btcClasses.transactionID;

                const makeBlockURL = `${API_ENDPOINTS.blokStream}${txID}`;

                const alertData: alertProps = {
                  message: {
                    label: 'Success',
                    subLabel: 'Transaction Sent',
                  },
                  btnData: {
                    negativeLabel: 'OK',
                    negativeAction: () => {},
                    positiveLabel: 'See On Explorer',
                    positiveAction: () => {
                      Linking.openURL(makeBlockURL);
                    },
                  },
                };

                makeAlert(alertData);
              }
            } catch (error) {
              console.log(error, '...errored');
            }
          } else {
            Alert.alert(
              'Error',
              'You dont have enough Satoshis to cover the miner fee.',
            );
          }
        }
      } catch (error) {
        console.log('btc error', error);
      }
    } else {
      Alert.alert('Error', 'Invalid Address');
    }
  };

  return (
    <ScrollView
      style={{backgroundColor: 'white', flex: 1, paddingHorizontal: 16}}>
      <Loader loading={loading} />

      <View
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'pink',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
            Your Balance:{' '}
            {Unit.fromSatoshis(rootstore.btcClasses.balance).toBTC()} TBTCs
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: 8,
            }}
            selectable>
            Your Address: {sourceAddress || ''}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 16}}>
        {DATA.map(item => {
          return (
            <CurrencyCard
              key={item.id}
              uri={item.uri}
              label={item.label}
              subLabel={item.subLabel}
              value={item.price}
            />
          );
        })}
      </View>

      <View style={{marginBottom: 20, marginTop: 20}}>
        <Text style={{color: 'black', fontSize: 20}}>
          Import Bitcoin Wallet
        </Text>
        <InputField
          label="Private Key WIF"
          onChange={text => {
            setPrivateKey(text);
          }}
          defaultValue={privateKey}
        />
        <TouchableOpacity
          onPress={importWallet}
          style={{
            backgroundColor: 'blue',
            height: 52,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 20}}>Import</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={{color: 'black', fontSize: 20}}>Send Amount</Text>
        <InputField
          label="Address to send to"
          onChange={text => {
            setRaddress(text);
          }}
        />
        <InputField
          label="Amount in BTC"
          onChange={text => {
            setAmount(text);
          }}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          onPress={() => {
            btcSend();
          }}
          style={{
            backgroundColor: 'blue',
            height: 52,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 20}}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
});

export default BitCoin;
