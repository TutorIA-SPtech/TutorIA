// Estado do diagnóstico em andamento + fila de envio das respostas.
//
// Por que cada resposta é enviada na hora (e não só no final): o back escolhe a próxima questão com base nas
// respostas já gravadas. O array `answers` guarda tudo o que o aluno respondeu e funciona como fila (outbox):
// uma resposta nasce `pending`, vira `sent` quando o back confirma, e o que falhar fica na fila e é reenviado
// (o back é idempotente por questão, então reenviar nunca conta duas vezes).
//
// Sem dependências de React/RN: a lógica é testável em Node. O hook fica em hooks/useDiagnosticSession.js.
import { diagnosticApi, apiErrorCode, apiErrorStatus } from './diagnosticApi.js';

const RETRY_DELAYS_MS = [400, 1200];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const emptyState = () => ({
  diagnostic: null, // { id, sessionId, startedAt, totalQuestions, ... }
  answeredCount: 0, // respondidas, incluindo as ainda na fila
  questions: [], // todas as questões já recebidas, na ordem
  answers: [], // { questionId, selectedOptionId, responseTimeMs, status: 'pending' | 'sent', answerId?, correct? }
  result: null, // resposta do /completion
});

// Falha de rede, 429 ou 5xx: vale tentar de novo. 4xx de regra de negócio não.
const isTransient = (error) => {
  const status = apiErrorStatus(error);
  return status === null || status === 429 || status >= 500;
};

export function createDiagnosticSession(api = diagnosticApi, { retryDelaysMs = RETRY_DELAYS_MS, sleep = wait } = {}) {
  let state = emptyState();
  let flushing = null;
  const listeners = new Set();

  const setState = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };

  const withRetry = async (fn) => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await fn();
      } catch (error) {
        if (!isTransient(error) || attempt >= retryDelaysMs.length) throw error;
        await sleep(retryDelaysMs[attempt]);
      }
    }
  };

  const pendingAnswers = () => state.answers.filter((answer) => answer.status === 'pending');
  const markSent = (questionId, feedback = {}) =>
    setState({
      answers: state.answers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, status: 'sent', answerId: feedback.answerId ?? answer.answerId, correct: feedback.correct ?? answer.correct }
          : answer,
      ),
    });

  const session = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getState: () => state,

    reset() {
      flushing = null;
      setState(emptyState());
    },

    isComplete() {
      return state.diagnostic !== null && state.answeredCount >= state.diagnostic.totalQuestions;
    },

    // Inicia ou retoma. Se o back devolver outro diagnóstico, o estado local anterior não vale mais.
    async start() {
      const diagnostic = await withRetry(() => api.start());
      if (state.diagnostic?.id !== diagnostic.id) {
        state = emptyState();
      }
      setState({ diagnostic, answeredCount: diagnostic.answeredCount + pendingAnswers().length });
      return diagnostic;
    },

    // Devolve a próxima questão, ou null quando as perguntas acabaram. Envia o que estiver na fila antes.
    async loadNextQuestion() {
      await session.flush();
      if (session.isComplete()) return null;
      let question;
      try {
        question = await withRetry(() => api.nextQuestion(state.diagnostic.id));
      } catch (error) {
        if (apiErrorCode(error) === 'DIAGNOSTIC_NO_MORE_QUESTIONS') return null;
        throw error;
      }
      if (!state.questions.some((known) => known.id === question.id)) {
        setState({ questions: [...state.questions, question] });
      }
      return question;
    },

    // Registra na fila, sem rede. Chame flush() em seguida para enviar.
    // Repetir a chamada para a mesma questão não duplica nada.
    recordAnswer(question, selectedOptionId, responseTimeMs) {
      if (!state.answers.some((answer) => answer.questionId === question.id)) {
        setState({
          answers: [
            ...state.answers,
            { questionId: question.id, selectedOptionId: selectedOptionId ?? null, responseTimeMs, status: 'pending' },
          ],
          answeredCount: state.answeredCount + 1,
        });
      }
      return { done: session.isComplete() };
    },

    // Envia a fila em ordem. Uma chamada por vez: toques duplos reaproveitam o mesmo envio em andamento.
    // Se algo falhar, a resposta continua `pending` e o erro sobe para a tela oferecer "tentar de novo".
    flush() {
      if (flushing) return flushing;
      flushing = (async () => {
        for (let next = pendingAnswers()[0]; next; next = pendingAnswers()[0]) {
          try {
            const feedback = await withRetry(() =>
              api.answer(state.diagnostic.sessionId, {
                questionId: next.questionId,
                selectedOptionId: next.selectedOptionId,
                responseTimeMs: next.responseTimeMs,
              }),
            );
            markSent(next.questionId, feedback);
          } catch (error) {
            // Outra requisição igual já gravou essa resposta, ou o diagnóstico já foi fechado: nada a reenviar.
            const code = apiErrorCode(error);
            if (code === 'ANSWER_ALREADY_REGISTERED' || code === 'DIAGNOSTIC_ALREADY_COMPLETED') {
              markSent(next.questionId);
            } else {
              throw error;
            }
          }
        }
      })().finally(() => {
        // .finally encadeado (e não um try/finally dentro): com a fila vazia o corpo termina de forma síncrona
        // e limparia `flushing` antes de ele ser atribuído, deixando-o preso para sempre.
        flushing = null;
      });
      return flushing;
    },

    // Fecha o diagnóstico e guarda o resultado. Idempotente.
    async finish() {
      await session.flush();
      if (state.result) return state.result;
      const result = await withRetry(() => api.complete(state.diagnostic.id));
      setState({ result });
      return result;
    },
  };

  return session;
}

export const diagnosticSession = createDiagnosticSession();
