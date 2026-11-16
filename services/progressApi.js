import { apiRequest, ApiError } from './apiClient';
import { rotaPendente } from './rotaPendente';
import { EXEMPLO_CHANCE, EXEMPLO_DOMINIO, EXEMPLO_PROGRESSO, EXEMPLO_SEMANAL } from './dadosExemplo';

// Sequência de estudo: { currentStreakDays, bestStreakDays, lastStudyDate }.
// Back fora do ar: devolve EXEMPLO_PROGRESSO com exemplo: true.
export async function getProgress() {
  try {
    return await apiRequest('/api/v1/me/progress', {
      method: 'GET',
      networkErrorMessage: 'Não foi possível carregar seu progresso. Confira a conexão.',
    });
  } catch (error) {
    if (deveUsarExemplo(error)) return { ...EXEMPLO_PROGRESSO, exemplo: true };
    throw error;
  }
}

// Domínio (0 a 1) por área e assunto: { areas: [{ areaId, areaName, averageProbability, subjects }] }.
// Vem vazio enquanto o aluno não respondeu nenhuma questão (isso é dado real, não troca por exemplo).
// Back fora do ar: devolve EXEMPLO_DOMINIO com exemplo: true.
export async function getMastery() {
  try {
    return await apiRequest('/api/v1/me/mastery', {
      method: 'GET',
      networkErrorMessage: 'Não foi possível carregar seu domínio por área. Confira a conexão.',
    });
  } catch (error) {
    if (deveUsarExemplo(error)) return { ...EXEMPLO_DOMINIO, exemplo: true };
    throw error;
  }
}

// Usa o exemplo quando a rota não existe (404/405/501) ou o back não respondeu (sem status).
function deveUsarExemplo(error) {
  return rotaPendente(error) || (error instanceof ApiError && error.status == null);
}

// Histórico semanal (contrato em BACKEND-HANDOFF.md):
// { weeks: [{ weekStart, averageProbability }], masteryDelta30Days, areas: [{ areaId, areaName, delta30Days }] }
// Sem rota no back: devolve EXEMPLO_SEMANAL com exemplo: true.
export async function getWeeklyEvolution() {
  try {
    return await apiRequest('/api/v1/me/progress/weekly', {
      method: 'GET',
      networkErrorMessage: 'Não foi possível carregar sua evolução. Confira a conexão.',
    });
  } catch (error) {
    if (deveUsarExemplo(error)) return { ...EXEMPLO_SEMANAL, exemplo: true };
    throw error;
  }
}

// Chance de ingresso no curso escolhido (contrato em BACKEND-HANDOFF.md):
// { course: { name, institutionName }, examDate, probability, projectedScore, cutoffScore, cutoffYears,
//   levers: [{ areaId, areaName, from, to, points }] }
// Sem rota no back: devolve EXEMPLO_CHANCE com exemplo: true.
export async function getAdmissionChance() {
  try {
    return await apiRequest('/api/v1/me/admission-chance', {
      method: 'GET',
      networkErrorMessage: 'Não foi possível carregar sua estimativa. Confira a conexão.',
    });
  } catch (error) {
    if (deveUsarExemplo(error)) return { ...EXEMPLO_CHANCE, exemplo: true };
    throw error;
  }
}
