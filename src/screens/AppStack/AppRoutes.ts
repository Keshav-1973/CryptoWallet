import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RouteMetadata, ValueOf} from '../../navigation/BasicNavigationTypes';

export const AppRoutes = {
  BITCOIN: '/app/bitcoin',
  POLYGON: '/app/polygon',
  TAB: '/app/tab',
} as const;

export const AppScreensMetadata: RouteMetadata<ValueOf<typeof AppRoutes>> = {
  [AppRoutes.BITCOIN]: {
    name: 'Bitcoin',
  },
  [AppRoutes.POLYGON]: {
    name: 'Polygon',
  },
  [AppRoutes.TAB]: {
    name: 'Tab',
  },
};

export type FindUserFormData = {
  userName: string;
  password: string;
};

export type RegisterFormData = {
  fullName: string;
  password: string;
};

export enum EmailScreenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

export type AppScreenPropsType = {
  [AppRoutes.BITCOIN]: {payload: string} | undefined;
  [AppRoutes.POLYGON]: {payload: string} | undefined;
  [AppRoutes.TAB]: {payload: string} | undefined;
};

export type AppScreenProps<t extends ValueOf<typeof AppRoutes>> =
  NativeStackScreenProps<AppScreenPropsType, t>;
