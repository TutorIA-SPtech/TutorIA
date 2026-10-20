import { apiRequest, ApiError } from './apiClient';

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

export function signUp({ name, email, password }) {
  return authenticate('/api/v1/auth/sign-up', { name, email, password });
}

export function login({ email, password }) {
  return authenticate('/api/v1/auth/login', { email, password });
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
