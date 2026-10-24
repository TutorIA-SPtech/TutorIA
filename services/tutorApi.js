import { apiRequest, ApiError } from './apiClient';

// Pedido livre ao Tuti. Consome 1 da cota FREE_REQUEST do dia (429 quando acabar).
export async function askTutor(question) {
  const response = await apiRequest('/api/v1/tutor/requests', {
    method: 'POST',
    data: { question: question.trim() },
    // A resposta depende do provedor de IA e pode demorar mais que o timeout padrão.
    timeout: 60000,
    networkErrorMessage: 'Não foi possível falar com o Tuti agora. Confira a conexão e tente novamente.',
  });

  if (typeof response?.answer !== 'string') {
    throw new ApiError('O Tuti não conseguiu responder agora. Tente novamente.');
  }

  return response.answer;
}
