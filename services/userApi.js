import { apiRequest } from './apiClient';

export function getCurrentUser() {
  return apiRequest('/api/v1/me', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar sua conta. Confira a conexão.',
  });
}
