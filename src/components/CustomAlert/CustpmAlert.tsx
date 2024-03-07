import React from 'react';
import {Alert} from 'react-native';

export type alertProps = {
  message: {
    label: string;
    subLabel: string;
  };
  btnData: {
    negativeLabel: string;
    negativeAction: () => void;
    positiveLabel: string;
    positiveAction: () => void;
  };
};

const makeAlert = (props: alertProps) => {
  Alert.alert(props.message.label, props.message.subLabel, [
    {
      text: props.btnData.negativeLabel,
      onPress: props.btnData.negativeAction,
      style: 'cancel',
    },
    {
      text: props.btnData.positiveLabel,
      onPress: props.btnData.positiveAction,
    },
  ]);
};

export default makeAlert;
