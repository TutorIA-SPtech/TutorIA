import { apiRequest } from './apiClient';

export function getProgress() {
  return apiRequest('/api/v1/me/progress', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar seu progresso. Confira a conexão.',
  });
}

export function getMastery() {
  return apiRequest('/api/v1/me/mastery', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar seu domínio por área. Confira a conexão.',
  });
}
