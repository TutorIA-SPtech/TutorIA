import { Platform } from 'react-native';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
const GENERIC_GOOGLE_ERROR = 'Não foi possível entrar com o Google. Verifique a conexão e tente novamente.';

let isConfigured = false;

export class GoogleAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

function configureGoogleSignin() {
  if (isConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId,
    ...(iosClientId ? { iosClientId } : {}),
  });
  isConfigured = true;
}

export async function getGoogleIdToken() {
  if (!webClientId) {
    throw new GoogleAuthError(
      'O login com Google não está configurado. Defina EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID no arquivo .env e reinicie o Expo.',
    );
  }

  if (Platform.OS === 'ios' && !iosClientId) {
    throw new GoogleAuthError(
      'O login com Google no iOS não está configurado. Defina EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID no arquivo .env e gere novamente o app nativo.',
    );
  }

  let response;
  try {
    configureGoogleSignin();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    response = await GoogleSignin.signIn();
  } catch (error) {
    if (__DEV__) {
      console.warn('[GoogleAuth] Falha no login Google:', error?.code || 'UNKNOWN');
    }
    throw new GoogleAuthError(GENERIC_GOOGLE_ERROR);
  }

  if (response.type === 'cancelled') {
    return null;
  }

  if (!isSuccessResponse(response) || typeof response.data.idToken !== 'string' || !response.data.idToken) {
    throw new GoogleAuthError('Não foi possível obter um token válido do Google. Tente novamente.');
  }

  return response.data.idToken;

}

export async function signOutGoogle() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    configureGoogleSignin();
    await GoogleSignin.signOut();
  } catch {
  }
}
