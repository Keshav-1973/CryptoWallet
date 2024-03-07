import React, { memo, useEffect, useState } from "react";
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import styles from "./styles";

export enum BtnTypes {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}
type Props = {
  onPress?: () => void;
  btnType: BtnTypes;
  title: string;
  loading?: boolean;
  loadingTitle?: string;
  disabled?: boolean;
  logo?: any;
  customStyles?: StyleProp<ViewStyle>;
  titleAfterLogo?: any;
  logoMid?: any;
  innerStyles?: StyleProp<ViewStyle>;
};

const CustomButton = ({
  onPress,
  btnType,
  title,
  loading,
  loadingTitle,
  disabled,
  logo,
  customStyles,
  titleAfterLogo,
  logoMid,
  innerStyles,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={customStyles}
      disabled={disabled ?? loading}
    >
      <View style={[styles.wrapper, innerStyles]}>
        {loading && (
          <ActivityIndicator
            animating={loading}
            color={"blue"}
            style={{ marginRight: 10 }}
          />
        )}

        <View style={styles.logoWrapper}>{!!logo && logo}</View>
        {<Text>{loading ? loadingTitle : title}</Text>}
        {!!logoMid && logoMid}
        {titleAfterLogo && <Text>{titleAfterLogo}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default memo(CustomButton);
