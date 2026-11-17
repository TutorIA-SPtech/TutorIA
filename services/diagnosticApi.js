// Camada HTTP do diagnóstico. Contrato completo no back: tutoria/docs/diagnostico-contrato.md
//
// ATENÇÃO: ajuste esta linha se o seu cliente axios tiver outro caminho/nome de export.
import api from './api';

const unwrap = (response) => response.data;

export const diagnosticApi = {
  // Idempotente: devolve o diagnóstico em andamento ou cria um novo.
  start: () => api.post('/api/v1/diagnostics').then(unwrap),

  // 404 quando não há diagnóstico em andamento.
  current: () => api.get('/api/v1/diagnostics/current').then(unwrap),

  // Devolve sempre a mesma questão até que ela seja respondida.
  nextQuestion: (diagnosticId) =>
    api.get(`/api/v1/diagnostics/${diagnosticId}/next-question`).then(unwrap),

  // selectedOptionId: null = "Não sei responder" (resposta válida, conta como errada).
  // Idempotente por (sessão, questão): reenviar é seguro.
  answer: (sessionId, { questionId, selectedOptionId, responseTimeMs, hintUsed = false }) =>
    api
      .post(`/api/v1/sessions/${sessionId}/answers`, {
        questionId,
        selectedOptionId,
        responseTimeMs,
        hintUsed,
      })
      .then(unwrap),

  // Idempotente: chamar de novo devolve o mesmo resultado.
  complete: (diagnosticId) => api.post(`/api/v1/diagnostics/${diagnosticId}/completion`).then(unwrap),
};

export const apiErrorCode = (error) => error?.response?.data?.code ?? null;
export const apiErrorStatus = (error) => error?.response?.status ?? null;
