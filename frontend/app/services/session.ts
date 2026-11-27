import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const ACCESS_TOKEN_KEY = '@doemais:token';
export const REFRESH_TOKEN_KEY = '@doemais:refreshToken';
export const USER_KEY = '@doemais:user';

const isWeb = Platform.OS === 'web';
const webSession = new Map<string, string>();

export const getSessionToken = async (key: typeof ACCESS_TOKEN_KEY | typeof REFRESH_TOKEN_KEY) =>
  isWeb && key === REFRESH_TOKEN_KEY ? null : isWeb ? webSession.get(key) ?? null : SecureStore.getItemAsync(key);

export const setSessionToken = async (
  key: typeof ACCESS_TOKEN_KEY | typeof REFRESH_TOKEN_KEY,
  value: string,
) => {
  if (isWeb) {
    if (key === REFRESH_TOKEN_KEY) return;
    webSession.set(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
};

export const removeSessionToken = async (key: typeof ACCESS_TOKEN_KEY | typeof REFRESH_TOKEN_KEY) => {
  if (isWeb) {
    if (key === REFRESH_TOKEN_KEY) return;
    webSession.delete(key);
    return AsyncStorage.removeItem(key);
  }
  return SecureStore.deleteItemAsync(key);
};

export const getStoredUser = async () =>
  isWeb ? webSession.get(USER_KEY) ?? null : SecureStore.getItemAsync(USER_KEY);

export const setStoredUser = async (user: string) => {
  if (isWeb) {
    webSession.set(USER_KEY, user);
    return;
  }
  return SecureStore.setItemAsync(USER_KEY, user);
};

export const removeStoredUser = async () => {
  if (isWeb) {
    webSession.delete(USER_KEY);
    return AsyncStorage.removeItem(USER_KEY);
  }
  return SecureStore.deleteItemAsync(USER_KEY);
};

export const clearStoredSession = async () => {
  await Promise.all([
    removeSessionToken(ACCESS_TOKEN_KEY),
    removeSessionToken(REFRESH_TOKEN_KEY),
    removeStoredUser(),
  ]);
};
