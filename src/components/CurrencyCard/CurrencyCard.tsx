import React from 'react';
import {View, Text, Image} from 'react-native';

type Props = {
  uri: string;
  label: string;
  subLabel: string;
  value: string | number;
};

const CurrencyCard = (props: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'grey',
      }}>
      <Image
        style={{width: 50, height: 50, borderRadius: 50, marginBottom: 5}}
        source={{
          uri: props?.uri,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}>
        <View
          style={{
            paddingLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
            {props?.label}
          </Text>
          <Text style={{color: 'black', fontSize: 14, fontWeight: '200'}}>
            {props?.subLabel}
          </Text>
        </View>
        <Text style={{color: 'black', fontSize: 14, fontWeight: '200'}}>
          {props?.value} $
        </Text>
      </View>
    </View>
  );
};

export default CurrencyCard;
