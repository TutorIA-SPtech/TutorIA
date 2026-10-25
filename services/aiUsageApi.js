import { apiRequest } from './apiClient';

// Uso do dia por categoria: { usageDate, categories: [{ category, used, limit }] }.
// Categorias: EXPLANATION, MATERIAL_READING, FREE_REQUEST, PLAN_REVISION.
export function getAiUsage() {
  return apiRequest('/api/v1/me/ai-usage', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar seu uso da IA. Confira a conexão.',
  });
}
