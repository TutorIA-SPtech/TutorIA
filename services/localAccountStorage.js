import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Cópia local de { name, nickname, email } para o Perfil abrir rápido
// e funcionar enquanto o back não tem GET /api/v1/me/account.
const ACCOUNT_STORAGE_KEY = 'tutoria.conta';

export async function getLocalAccount() {
  const storedValue = Platform.OS === 'web'
    ? window.localStorage.getItem(ACCOUNT_STORAGE_KEY)
    : await SecureStore.getItemAsync(ACCOUNT_STORAGE_KEY);

  if (!storedValue) return null;

  try {
    const conta = JSON.parse(storedValue);
    return typeof conta === 'object' && conta ? conta : null;
  } catch {
    return null;
  }
}

export async function saveLocalAccount({ name = '', nickname = null, email = '' }) {
  const value = JSON.stringify({ name, nickname, email });

  if (Platform.OS === 'web') {
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(ACCOUNT_STORAGE_KEY, value);
}
