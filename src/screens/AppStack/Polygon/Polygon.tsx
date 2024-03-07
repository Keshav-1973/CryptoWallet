import '@ethersproject/shims';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {AppScreenProps} from '../AppRoutes';
import CurrencyCard from '../../../components/CurrencyCard/CurrencyCard';
import InputField from '../../../components/InputField/InputField';
import {
  API_ENDPOINTS,
  MTC_PRV_KEY,
  USDT_URI,
} from '../../../constants/Constants';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../../store';
import {
  isValidEthPrivateKey,
  isValidEthereumAddress,
} from '../../../utils/validators';
import Loader from '../../../components/Loader/Loader';
import {convertUSDTToMatic} from '../../../utils/helperMethods';
import makeAlert, {
  alertProps,
} from '../../../components/CustomAlert/CustpmAlert';

type Data = {
  id: string;
  uri: string;
  label: string;
  subLabel: string;
  price: number;
};
const Polygon = observer((props: AppScreenProps<'/app/polygon'>) => {
  const [privateKey, setPrivateKey] = useState(MTC_PRV_KEY);
  const [amount, setAmount] = useState('');
  const [raddress, setRaddress] = useState('');
  const rootStore = useStore();

  const {loading, maticPrice} = rootStore.polygonClasses;
  const {usdt_price} = rootStore.btcClasses;

  const DATA: Data[] = [
    {
      id: 'USDT',
      uri: USDT_URI,
      label: 'USDT',
      subLabel: 'TetherUS',
      price: rootStore.btcClasses.usdt_price,
    },
  ];

  const importPolygonWallet = (privateKey: string) => {
    if (isValidEthPrivateKey(privateKey)) {
      rootStore.polygonClasses.getEtherBalance(privateKey);
    } else {
      Alert.alert('Error', 'Invalid private key');
    }
  };

  const sendPolygonTransaction = async () => {
    if (!privateKey) {
      Alert.alert('Error', 'Import Wallet First');
      return;
    }

    if (!amount || !raddress) {
      Alert.alert('Error', 'Enter correct details');
      return;
    }
    if (isValidEthPrivateKey(privateKey) && isValidEthereumAddress(raddress)) {
      await rootStore.polygonClasses.sendPolygonTransaction(
        privateKey,
        amount,
        raddress,
      );

      const hash = rootStore?.polygonClasses?.txDetails?.hash;
      if (hash) {
        const makeBlockURL = `${API_ENDPOINTS.mombaiPoly}${hash}`;

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
    }
  };

  useEffect(() => {
    rootStore.btcClasses.getUSDTPrice();
    rootStore.polygonClasses.getMaticPrice();
  }, []);

  const getConvertedPrice = () => {
    const value = Number(amount);
    return convertUSDTToMatic(value, maticPrice, usdt_price);
  };

  return (
    <ScrollView
      bounces={false}
      overScrollMode="never"
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
        <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
          Your Balance: {rootStore.polygonClasses.etherBalance.toFixed(4)} MATIC
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
          Your Address: {rootStore.polygonClasses.address}
        </Text>
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
          Import Polygon Wallet
        </Text>
        <InputField
          label="Private Key"
          onChange={text => {
            setPrivateKey(text);
          }}
          defaultValue={MTC_PRV_KEY}
        />
        <TouchableOpacity
          onPress={() => {
            importPolygonWallet(privateKey);
          }}
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

        <Text style={{color: 'black', fontSize: 12}}>
          {getConvertedPrice()} in Matic
        </Text>
        <InputField
          label="Amount in USDT"
          onChange={text => {
            setAmount(text);
          }}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          onPress={() => {
            sendPolygonTransaction();
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

export default Polygon;
