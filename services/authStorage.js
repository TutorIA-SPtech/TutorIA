import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_STORAGE_KEY = 'tutoria.auth';

function getWebStorage() {
  if (typeof window === 'undefined') {
    throw new Error('O armazenamento da sessão não está disponível.');
  }

  return window.sessionStorage;
}

export async function getStoredAuth() {
  const storedValue = Platform.OS === 'web'
    ? getWebStorage().getItem(AUTH_STORAGE_KEY)
    : await SecureStore.getItemAsync(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  let auth;
  try {
    auth = JSON.parse(storedValue);
  } catch {
    await clearStoredAuth();
    return null;
  }

  if (
    typeof auth?.accessToken !== 'string'
    || !auth.accessToken
    || auth?.tokenType !== 'Bearer'
  ) {
    await clearStoredAuth();
    return null;
  }

  return auth;
}

export async function saveStoredAuth(auth) {
  const value = JSON.stringify(auth);

  if (Platform.OS === 'web') {
    getWebStorage().setItem(AUTH_STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(AUTH_STORAGE_KEY, value);
}

export async function clearStoredAuth() {
  if (Platform.OS === 'web') {
    getWebStorage().removeItem(AUTH_STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
}
