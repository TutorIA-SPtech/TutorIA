import axios from 'axios';
import { getStoredAuth } from './authStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

const fieldMessages = {
  name: 'Confira o nome informado (obrigatório, até 120 caracteres).',
  email: 'Informe um e-mail válido.',
  password: 'A senha é obrigatória e deve ter entre 8 e 72 caracteres.',
  newPassword: 'A senha deve ter entre 8 e 72 caracteres.',
  token: 'Informe o código recebido por e-mail.',
};

export class ApiError extends Error {
  constructor(message, fieldErrors = {}, code = null) {
    super(message);
    this.name = 'ApiError';
    this.fieldErrors = fieldErrors;
    this.code = code;
  }
}

function getFieldErrors(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return {};
  }

  return Object.keys(fields).reduce((errors, field) => {
    if (fieldMessages[field]) {
      errors[field] = fieldMessages[field];
    }
    return errors;
  }, {});
}

function getApiError(status, problem, unauthorizedMessage) {
  if (problem?.code === 'EMAIL_ALREADY_REGISTERED') {
    return new ApiError('Este e-mail já está cadastrado.', {
      email: 'Este e-mail já está cadastrado.',
    }, problem.code);
  }

  if (problem?.code === 'INVALID_RESET_TOKEN') {
    return new ApiError('Código inválido ou expirado.', {}, problem.code);
  }

  if (status === 401) {
    return new ApiError(unauthorizedMessage || 'E-mail ou senha incorretos.');
  }

  if (status === 400) {
    return new ApiError('Confira os dados informados.', getFieldErrors(problem?.fields));
  }

  if (status >= 500) {
    return new ApiError('O serviço está indisponível no momento. Tente novamente mais tarde.');
  }

  return new ApiError('Não foi possível concluir a solicitação. Tente novamente.');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (!API_BASE_URL) {
    throw new ApiError('A URL da API não está configurada. Defina EXPO_PUBLIC_API_URL e reinicie o Expo.');
  }

  if (config.authenticated !== false) {
    const auth = await getStoredAuth();
    if (auth) {
      config.headers.Authorization = `${auth.tokenType} ${auth.accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    if (axios.isAxiosError(error) && error.response) {
      const apiError = getApiError(
        error.response.status,
        error.response.data,
        error.config?.unauthorizedMessage,
      );
      apiError.status = error.response.status;
      return Promise.reject(apiError);
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(new ApiError(
        error.config?.networkErrorMessage
          || 'Não foi possível concluir a solicitação. Tente novamente.',
      ));
    }

    return Promise.reject(error);
  },
);

export async function apiRequest(
  path,
  { authenticated = true, unauthorizedMessage, networkErrorMessage, ...options } = {},
) {
  try {
    const response = await api.request({
      ...options,
      url: path,
      authenticated,
      unauthorizedMessage,
      networkErrorMessage,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Não foi possível concluir a solicitação. Tente novamente.');
  }
}
