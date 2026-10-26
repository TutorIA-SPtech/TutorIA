const INITIAL_PROGRESS = {
  currentStreakDays: 12,
  bestStreakDays: 18,
  lastStudyDate: '2026-10-24',
};

const INITIAL_MASTERY = {
  areas: [
    {
      areaId: 1,
      areaName: 'Matemática',
      averageProbability: 0.64,
      subjects: [
        { subjectId: 11, subjectName: 'Funções', probability: 0.72 },
        { subjectId: 12, subjectName: 'Geometria', probability: 0.56 },
      ],
    },
    {
      areaId: 2,
      areaName: 'Ciências da natureza',
      averageProbability: 0.41,
      subjects: [
        { subjectId: 21, subjectName: 'Estequiometria', probability: 0.41 },
      ],
    },
    {
      areaId: 3,
      areaName: 'Humanas',
      averageProbability: 0.57,
      subjects: [
        { subjectId: 31, subjectName: 'Brasil Colônia', probability: 0.57 },
      ],
    },
  ],
};

const INITIAL_AI_USAGE = [
  { category: 'EXPLANATION', used: 2, limit: 15 },
  { category: 'MATERIAL_READING', used: 1, limit: 5 },
  { category: 'FREE_REQUEST', used: 3, limit: 8 },
  { category: 'PLAN_REVISION', used: 0, limit: 2 },
];

function parseRequestBody(config) {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data;
}

function createState() {
  return {
    studyProfile: null,
    aiUsage: INITIAL_AI_USAGE.map((category) => ({ ...category })),
  };
}

function demoAnswer(question) {
  const normalized = question.toLowerCase();
  if (normalized.includes('hess')) {
    return 'Modo demonstração: a Lei de Hess diz que a variação de entalpia depende apenas dos estados inicial e final. Você pode somar as equações termoquímicas para chegar à reação desejada.';
  }
  if (normalized.includes('funç')) {
    return 'Modo demonstração: uma boa forma de começar é identificar o que a questão pede, separar os dados e escolher a propriedade da função que se aplica. Quer praticar com um exemplo?';
  }
  return `Modo demonstração: recebi seu pedido sobre "${question.trim()}". A integração com o provedor de IA ainda está pendente; esta resposta é uma fixture local para testar a conversa.`;
}

export function installMockApi(api, MockAdapter) {
  const state = createState();
  const mock = new MockAdapter(api, { delayResponse: 350, onNoMatch: 'throwException' });

  mock.onAny(/\/api\/v1\/auth\//).passThrough();

  mock.onGet('/api/v1/me/progress').reply(200, INITIAL_PROGRESS);
  mock.onGet('/api/v1/me/mastery').reply(200, INITIAL_MASTERY);

  mock.onGet('/api/v1/me/study-profile').reply(() => (
    state.studyProfile
      ? [200, state.studyProfile]
      : [404, { code: 'STUDY_PROFILE_NOT_FOUND', message: 'Perfil de estudo ainda não configurado.' }]
  ));
  mock.onPut('/api/v1/me/study-profile').reply((config) => {
    const body = parseRequestBody(config);
    state.studyProfile = {
      examDate: body.examDate,
      dailyMinutes: body.dailyMinutes,
      studyDays: body.studyDays ?? [],
      targetCourse: body.targetCourseId
        ? {
          id: body.targetCourseId,
          name: 'Engenharia Civil',
          institutionName: 'UFPE',
        }
        : null,
    };
    return [200, state.studyProfile];
  });

  mock.onGet('/api/v1/me/ai-usage').reply(() => [200, {
    usageDate: new Date().toISOString().slice(0, 10),
    categories: state.aiUsage.map((category) => ({ ...category })),
  }]);
  mock.onPost('/api/v1/tutor/requests').reply((config) => {
    const { question = '' } = parseRequestBody(config);
    const usage = state.aiUsage.find((category) => category.category === 'FREE_REQUEST');
    if (usage.used >= usage.limit) {
      return [429, { code: 'AI_LIMIT_EXCEEDED', message: 'Limite diário de demonstração atingido.' }];
    }
    usage.used += 1;
    return [200, { answer: demoAnswer(question) }];
  });

  mock.onAny().reply((config) => [
    501,
    {
      code: 'MOCK_ENDPOINT_NOT_CONFIGURED',
      message: `Ainda não há fixture para ${String(config.method).toUpperCase()} ${config.url}.`,
    },
  ]);

  return mock;
}
