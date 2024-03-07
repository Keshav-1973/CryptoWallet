import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ValueOf} from './BasicNavigationTypes';
import {
  AppRoutes,
  AppScreensMetadata,
  AppScreenPropsType,
} from '../screens/AppStack/AppRoutes';

const allScreenRoutes = Object.assign({}, AppRoutes);

export const FeatureRoutes = {
  APPBOARDING: AppRoutes,
};

export const ScreensMetadata = {
  ...AppScreensMetadata,
};

export type CombinedScreenProps = AppScreenPropsType;

export type ScreenNavigationProps =
  NativeStackNavigationProp<CombinedScreenProps>;
export type ScreenProps<t extends ValueOf<typeof allScreenRoutes>> =
  NativeStackNavigationProp<
    CombinedScreenProps,
    ValueOf<typeof allScreenRoutes>
  >;
