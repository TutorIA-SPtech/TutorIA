// Dados de exemplo usados quando o back ainda não tem a rota (ou está fora do ar).
// Quando a rota existir e responder, o app mostra os dados reais automaticamente.

export const EXEMPLO_PROGRESSO = {
  currentStreakDays: 12,
  bestStreakDays: 18,
  lastStudyDate: '2026-10-24',
};

export const EXEMPLO_DOMINIO = {
  areas: [
    { areaId: 1, areaName: 'Matemática', averageProbability: 0.64, subjects: [{ subjectId: 11, subjectName: 'Funções', probability: 0.72 }, { subjectId: 12, subjectName: 'Geometria', probability: 0.56 }] },
    { areaId: 4, areaName: 'Linguagens', averageProbability: 0.73, subjects: [{ subjectId: 41, subjectName: 'Interpretação de texto', probability: 0.73 }] },
    { areaId: 2, areaName: 'Ciências da natureza', averageProbability: 0.41, subjects: [{ subjectId: 21, subjectName: 'Estequiometria', probability: 0.41 }] },
    { areaId: 3, areaName: 'Humanas', averageProbability: 0.57, subjects: [{ subjectId: 31, subjectName: 'Brasil Colônia', probability: 0.57 }] },
  ],
};

export const EXEMPLO_SEMANAL = {
  weeks: [
    { weekStart: '2026-09-07', averageProbability: 0.41 },
    { weekStart: '2026-09-14', averageProbability: 0.44 },
    { weekStart: '2026-09-21', averageProbability: 0.48 },
    { weekStart: '2026-09-28', averageProbability: 0.47 },
    { weekStart: '2026-10-05', averageProbability: 0.52 },
    { weekStart: '2026-10-12', averageProbability: 0.56 },
    { weekStart: '2026-10-19', averageProbability: 0.59 },
  ],
  masteryDelta30Days: 0.11,
  areas: [
    { areaId: 1, areaName: 'Matemática', delta30Days: 0.08 },
    { areaId: 4, areaName: 'Linguagens', delta30Days: 0.05 },
    { areaId: 2, areaName: 'Ciências da natureza', delta30Days: -0.03 },
    { areaId: 3, areaName: 'Humanas', delta30Days: 0.04 },
  ],
};

export const EXEMPLO_CHANCE = {
  course: { name: 'Engenharia Civil', institutionName: 'UFPE' },
  examDate: '2026-11-08',
  probability: 0.62,
  projectedScore: 698,
  cutoffScore: 712,
  cutoffYears: '2023–2025',
  levers: [
    { areaId: 2, areaName: 'Ciências da natureza', from: 0.41, to: 0.55, points: 9 },
    { areaId: 3, areaName: 'Humanas', from: 0.57, to: 0.65, points: 5 },
  ],
};
