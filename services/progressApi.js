import { apiRequest } from './apiClient';

// Sequência de estudo: { currentStreakDays, bestStreakDays, lastStudyDate }.
export function getProgress() {
  return apiRequest('/api/v1/me/progress', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar seu progresso. Confira a conexão.',
  });
}

// Domínio (0 a 1) por área e assunto: { areas: [{ areaId, areaName, averageProbability, subjects }] }.
// Vem vazio enquanto o aluno não respondeu nenhuma questão.
export function getMastery() {
  return apiRequest('/api/v1/me/mastery', {
    method: 'GET',
    networkErrorMessage: 'Não foi possível carregar seu domínio por área. Confira a conexão.',
  });
}
