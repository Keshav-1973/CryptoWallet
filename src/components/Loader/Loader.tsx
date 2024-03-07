import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

type props = {loading: boolean};

const Loader = (props: props) => {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        display: props.loading ? 'flex' : 'none',
      }}
      pointerEvents="auto">
      {props.loading && <ActivityIndicator size="large" color="blue" />}
    </View>
  );
};

export default Loader;
