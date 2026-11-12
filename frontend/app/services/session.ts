import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@doemais:token';
const REFRESH_TOKEN_KEY = '@doemais:refreshToken';
const USER_KEY = '@doemais:user';

export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN_KEY);
export const getUser = () => AsyncStorage.getItem(USER_KEY);
export const setAccessToken = (token: string) => AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
export const setUser = (user: unknown) => AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
export async function setSession(accessToken: string, user: unknown, refreshToken?: string) {
    await setAccessToken(accessToken);
    await setUser(user);
    if (refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}
export const clearSession = () => AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
