import { apiRequest, ApiError } from './apiClient';

export const MAX_QUESTION_LENGTH = 2000;

const HISTORY_PAGE_SIZE = 100;

const CONVERSATIONS_PAGE_SIZE = 20;

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
  const { conversations } = await listConversations(0, 1);
  return conversations[0] ?? null;
}

export async function listConversations(page = 0, size = CONVERSATIONS_PAGE_SIZE) {
  const response = await apiRequest('/api/v1/tutor/conversations', {
    method: 'GET',
    params: { page, size },
    networkErrorMessage: 'Não foi possível carregar suas conversas. Confira a conexão.',
  });
  const conversations = response?.content ?? [];
  return { conversations, hasMore: hasNextPage(response, page, size, conversations.length) };
}

export async function deleteConversation(conversationId) {
  await apiRequest(`/api/v1/tutor/conversations/${conversationId}`, {
    method: 'DELETE',
    networkErrorMessage: 'Não foi possível apagar a conversa. Confira a conexão.',
  });
}

// O Page do Spring pode vir com last/totalPages na raiz ou dentro de "page", conforme a versão.
function hasNextPage(response, page, size, received) {
  if (typeof response?.last === 'boolean') {
    return !response.last;
  }
  const info = response?.page ?? response;
  if (typeof info?.totalPages === 'number') {
    return page + 1 < info.totalPages;
  }
  return received === size;
}

export async function getConversationMessages(conversationId) {
  const page = await apiRequest(`/api/v1/tutor/conversations/${conversationId}/messages`, {
    method: 'GET',
    params: { page: 0, size: HISTORY_PAGE_SIZE },
  });
  return page?.content ?? [];
}
