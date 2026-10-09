import axios from 'axios';
import { getStoredAuth } from './authStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

const fieldMessages = {
  name: 'Confira o nome informado (obrigatório, até 120 caracteres).',
  email: 'Informe um e-mail válido.',
  password: 'A senha é obrigatória e deve ter entre 8 e 72 caracteres.',
};

export class ApiError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.fieldErrors = fieldErrors;
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

function getApiError(status, problem) {
  if (problem?.code === 'EMAIL_ALREADY_REGISTERED') {
    return new ApiError('Este e-mail já está cadastrado.', {
      email: 'Este e-mail já está cadastrado.',
    });
  }

  if (status === 401) {
    return new ApiError('E-mail ou senha incorretos.');
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
      return Promise.reject(getApiError(error.response.status, error.response.data));
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(new ApiError(
        'Não foi foi possível realizar o cadastro. Tente novamente mais tarde.',
      ));
    }

    return Promise.reject(error);
  },
);

export async function apiRequest(path, { authenticated = true, ...options } = {}) {
  try {
    const response = await api.request({
      ...options,
      url: path,
      authenticated,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Não foi possível concluir a solicitação. Tente novamente.');
  }
}
