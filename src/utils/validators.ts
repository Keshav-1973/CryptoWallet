import {Alert} from 'react-native';
import ECPairFactory from 'ecpair';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import * as bitcoin from 'bitcoinjs-lib';

export function isValidEthereumAddress(address: string) {
  // Check if the address is a hexadecimal string
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    Alert.alert('Error', 'Invalid address');

    return false;
  }

  // Validate the length of the address
  if (address.length !== 42 && address.length !== 40) {
    Alert.alert('Error', 'Invalid address');
    return false;
  }

  return true;
}

export function isValidEthPrivateKey(privateKey: string) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(privateKey)) {
    return false;
  }

  if (privateKey.length !== 64 && privateKey.length !== 66) {
    return false;
  }

  return true;
}

export function isValidWIFPrivateKey(privateKeyWIF: string) {
  const ECPair = ECPairFactory(ecc);
  const keyPair = ECPair.makeRandom();
  try {
    ECPair.fromWIF(privateKeyWIF, bitcoin.networks.testnet);
    return true;
  } catch (error) {
    Alert.alert('Error', 'Invalid Key');
    return false;
  }
}
