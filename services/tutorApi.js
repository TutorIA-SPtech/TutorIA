import { apiRequest, ApiError } from './apiClient';

export const MAX_QUESTION_LENGTH = 2000;

const HISTORY_PAGE_SIZE = 100;

export async function askTutor(question, conversationId = null) {
  const response = await apiRequest('/api/v1/tutor/requests', {
    method: 'POST',
    data: { question: question.trim(), conversationId },
    timeout: 60000,
    networkErrorMessage: 'Não foi possível falar com o Tuti agora. Confira a conexão e tente novamente.',
  });

  if (typeof response?.answer !== 'string') {
    throw new ApiError('O Tuti não conseguiu responder agora. Tente novamente.');
  }

  return {
    conversationId: response.conversationId ?? null,
    answer: response.answer,
    usage: response.usage ?? null,
  };
}

export async function getLatestConversation() {
  const page = await apiRequest('/api/v1/tutor/conversations', {
    method: 'GET',
    params: { page: 0, size: 1 },
  });
  return page?.content?.[0] ?? null;
}

export async function getConversationMessages(conversationId) {
  const page = await apiRequest(`/api/v1/tutor/conversations/${conversationId}/messages`, {
    method: 'GET',
    params: { page: 0, size: HISTORY_PAGE_SIZE },
  });
  return page?.content ?? [];
}
