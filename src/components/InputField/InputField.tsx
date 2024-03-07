import {FC, memo} from 'react';
import * as React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import styles from './styles';

interface Props {
  value?: string;
  label?: string;
  icon?: React.JSX.Element;
  error?: string;
  touched?: boolean;
  onIconPress?: () => void;
  secureTextEntry?: boolean;
  editable?: boolean;
  defaultValue?: string;
  onSubmitEditing?: any;
  keyboardType?: KeyboardTypeOptions;
  rightIcon?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  onChange?: (text: string) => void;
  onBlur?: () => void;
}

const InputField: FC<Props> = ({
  value,
  label,
  icon,
  error,
  onIconPress,
  secureTextEntry,
  editable,
  defaultValue,
  onSubmitEditing,
  keyboardType,
  rightIcon,
  style,
  onChange,
  onBlur,
  touched,
}: Props) => {
  const wrapperStyle: StyleProp<ViewStyle> = {
    alignItems: icon ? 'center' : 'baseline',
  };

  return (
    <View style={styles.inputContainer}>
      {!!label && <Text style={{color: 'black'}}>{label}</Text>}
      <View style={[styles.wrapper, wrapperStyle]}>
        {!!icon && (
          <View>
            <View>{icon}</View>
          </View>
        )}
        <TextInput
          style={[styles.textInput, style, {color: 'black'}]}
          onChangeText={onChange}
          defaultValue={defaultValue}
          value={value}
          onBlur={onBlur}
          placeholderTextColor={'black'}
          editable={editable}
          selectTextOnFocus={editable}
          onEndEditing={onSubmitEditing}
          blurOnSubmit={false}
          keyboardType={keyboardType}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
        />
        {!!rightIcon && (
          <TouchableOpacity onPress={onIconPress}>
            <View>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

export default memo(InputField);
