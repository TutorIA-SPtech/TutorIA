import { apiRequest } from './apiClient';

export function getAiUsage() {
  return apiRequest('/api/v1/me/ai-usage', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar seu uso da IA. Confira a conexão.',
  });
}
