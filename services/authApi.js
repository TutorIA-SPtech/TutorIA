import { apiRequest, ApiError } from './apiClient';
import { getLocalAccount, saveLocalAccount } from './localAccountStorage';

async function authenticate(path, credentials, requestMessages = {}) {
  const response = await apiRequest(path, {
    method: 'POST',
    authenticated: false,
    data: credentials,
    ...requestMessages,
  });

  if (
    typeof response?.accessToken !== 'string'
    || !response.accessToken
    || response?.tokenType !== 'Bearer'
  ) {
    throw new ApiError('A resposta da API de autenticação é inválida. Tente novamente.');
  }

  return {
    accessToken: response.accessToken,
    tokenType: response.tokenType,
  };
}

// Guarda nome/e-mail no aparelho para o Perfil. Nunca derruba o login se falhar.
async function lembrarConta({ name, email }) {
  try {
    const local = await getLocalAccount();
    const mesmoUsuario = local?.email?.toLowerCase() === email.trim().toLowerCase();
    await saveLocalAccount({
      name: name ?? (mesmoUsuario ? local.name : ''),
      nickname: mesmoUsuario ? local.nickname : null,
      email: email.trim(),
    });
  } catch {
    // ignorado de propósito
  }
}

export async function signUp({ name, email, password }) {
  const auth = await authenticate('/api/v1/auth/sign-up', { name, email, password });
  await lembrarConta({ name, email });
  return auth;
}

export async function login({ email, password }) {
  const auth = await authenticate('/api/v1/auth/login', { email, password });
  await lembrarConta({ email });
  return auth;
}

export function loginWithGoogle(idToken) {
  return authenticate('/api/v1/auth/google', { idToken }, {
    unauthorizedMessage: 'Não foi possível entrar com o Google. Tente novamente.',
    networkErrorMessage: 'Não foi possível entrar com o Google. Tente novamente.',
  });
}

export async function requestPasswordRecovery(email) {
  await apiRequest('/api/v1/auth/password/recovery', {
    method: 'POST',
    authenticated: false,
    data: { email: email.trim() },
  });
}

export async function verifyPasswordToken(email, token) {
  await apiRequest('/api/v1/auth/password/verify', {
    method: 'POST',
    authenticated: false,
    data: { email: email.trim(), token },
  });
}

export async function resetPassword({ email, token, newPassword }) {
  await apiRequest('/api/v1/auth/password/reset', {
    method: 'POST',
    authenticated: false,
    data: { email: email.trim(), token, newPassword },
  });
}
