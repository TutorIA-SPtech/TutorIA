import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// O back ainda não tem campo para o lembrete (pendência P16), então ele fica salvo no aparelho.
const REMINDER_STORAGE_KEY = 'tutoria.lembrete';
const HORARIO_VALIDO = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function getStoredReminder() {
  const storedValue = Platform.OS === 'web'
    ? window.localStorage.getItem(REMINDER_STORAGE_KEY)
    : await SecureStore.getItemAsync(REMINDER_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const reminder = JSON.parse(storedValue);
    if (typeof reminder?.ativo !== 'boolean' || !HORARIO_VALIDO.test(reminder?.horario)) {
      return null;
    }
    return reminder;
  } catch {
    return null;
  }
}

export async function saveStoredReminder({ ativo, horario }) {
  const value = JSON.stringify({ ativo, horario });

  if (Platform.OS === 'web') {
    window.localStorage.setItem(REMINDER_STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(REMINDER_STORAGE_KEY, value);
}
