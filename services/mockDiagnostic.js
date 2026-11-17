// Fixtures do diagnóstico para o modo demonstração. Segue o contrato do back (tutoria/docs/diagnostico-contrato.md):
// mesmas rotas, mesmos códigos de erro e a mesma idempotência, para o app se comportar igual com mock ou API real.
//
// As 20 questões abaixo são as que antes viviam hardcoded na tela do questionário.
// Diferença proposital em relação ao back: aqui a ordem é fixa (o mock não faz seleção adaptativa).

const TOTAL_QUESTIONS = 20;
const INITIAL_MASTERY = 0.3;

const AREAS = [
  { id: 1, name: 'Matemática', color: '#9FA8FF' },
  { id: 2, name: 'Linguagens', color: '#57DDA9' },
  { id: 3, name: 'Ciências da natureza', color: '#FF8A65' },
  { id: 4, name: 'Humanas', color: '#B39DFF' },
];

const AREA_BY_SUBJECT = {
  Matemática: 'Matemática',
  Literatura: 'Linguagens',
  Física: 'Ciências da natureza',
  Biologia: 'Ciências da natureza',
  Química: 'Ciências da natureza',
  História: 'Humanas',
  Geografia: 'Humanas',
  Filosofia: 'Humanas',
  Sociologia: 'Humanas',
};

const LEGACY_QUESTIONS = [
  {
    "id": 1,
    "subject": "Matemática",
    "text": "O lucro de uma empresa, em milhares de reais, é L(x) = –2x² + 12x – 10. Qual quantidade gera o lucro máximo?",
    "options": [
      "2 unidades",
      "3 unidades",
      "5 unidades",
      "6 unidades"
    ],
    "correct": "3 unidades"
  },
  {
    "id": 2,
    "subject": "História",
    "text": "A principal atividade econômica do Brasil no século XVI, impulsionada pelo uso do trabalho escravo africano, foi a:",
    "options": [
      "Mineração",
      "Pecuária",
      "Extração de pau-brasil",
      "Produção açucareira"
    ],
    "correct": "Produção açucareira"
  },
  {
    "id": 3,
    "subject": "Física",
    "text": "Um carro viaja a 90 km/h constantes. Qual é a distância percorrida após 2 horas de viagem?",
    "options": [
      "180 km",
      "90 km",
      "45 km",
      "200 km"
    ],
    "correct": "180 km"
  },
  {
    "id": 4,
    "subject": "Biologia",
    "text": "Qual organela celular é responsável pela respiração celular e produção de ATP?",
    "options": [
      "Ribossomo",
      "Complexo de Golgi",
      "Mitocôndria",
      "Lisossomo"
    ],
    "correct": "Mitocôndria"
  },
  {
    "id": 5,
    "subject": "Química",
    "text": "A ligação química formada pela transferência definitiva de elétrons entre átomos é chamada de:",
    "options": [
      "Covalente polar",
      "Iônica",
      "Metálica",
      "Covalente apolar"
    ],
    "correct": "Iônica"
  },
  {
    "id": 6,
    "subject": "Geografia",
    "text": "O bloco econômico formado originalmente por Brasil, Argentina, Paraguai e Uruguai é o:",
    "options": [
      "Nafta",
      "União Europeia",
      "Mercosul",
      "Pacto Andino"
    ],
    "correct": "Mercosul"
  },
  {
    "id": 7,
    "subject": "Literatura",
    "text": "A Semana de Arte Moderna de 1922 ocorreu em qual cidade brasileira?",
    "options": [
      "Rio de Janeiro",
      "São Paulo",
      "Belo Horizonte",
      "Salvador"
    ],
    "correct": "São Paulo"
  },
  {
    "id": 8,
    "subject": "Matemática",
    "text": "Um produto que custava R$ 200,00 sofreu um desconto de 15%. Qual o novo valor do produto?",
    "options": [
      "R$ 185,00",
      "R$ 170,00",
      "R$ 150,00",
      "R$ 190,00"
    ],
    "correct": "R$ 170,00"
  },
  {
    "id": 9,
    "subject": "Filosofia",
    "text": "Qual filósofo grego é famoso pela máxima 'Só sei que nada sei'?",
    "options": [
      "Aristóteles",
      "Platão",
      "Sócrates",
      "Pitágoras"
    ],
    "correct": "Sócrates"
  },
  {
    "id": 10,
    "subject": "História",
    "text": "O sistema econômico, político e social que predominou na Europa Ocidental durante a Idade Média foi o:",
    "options": [
      "Capitalismo",
      "Mercantilismo",
      "Feudalismo",
      "Socialismo"
    ],
    "correct": "Feudalismo"
  },
  {
    "id": 11,
    "subject": "Física",
    "text": "A transferência de calor que ocorre através do movimento de fluidos (líquidos e gases) é chamada de:",
    "options": [
      "Condução",
      "Irradiação",
      "Evaporação",
      "Convecção"
    ],
    "correct": "Convecção"
  },
  {
    "id": 12,
    "subject": "Biologia",
    "text": "Os cromossomos sexuais que determinam o sexo biológico feminino em humanos são:",
    "options": [
      "XY",
      "YY",
      "XX",
      "X0"
    ],
    "correct": "XX"
  },
  {
    "id": 13,
    "subject": "Química",
    "text": "Qual das substâncias abaixo é considerada uma mistura homogênea?",
    "options": [
      "Água e óleo",
      "Soro fisiológico",
      "Granito",
      "Sangue"
    ],
    "correct": "Soro fisiológico"
  },
  {
    "id": 14,
    "subject": "Sociologia",
    "text": "O conceito sociológico que descreve o choque ou aversão cultural em relação a hábitos diferentes dos próprios é o:",
    "options": [
      "Relativismo",
      "Etnocentrismo",
      "Aculturação",
      "Sincretismo"
    ],
    "correct": "Etnocentrismo"
  },
  {
    "id": 15,
    "subject": "Geografia",
    "text": "O clima predominante na região central do Brasil, caracterizado por duas estações bem definidas (seca e chuvosa), é o:",
    "options": [
      "Tropical",
      "Equatorial",
      "Semiárido",
      "Subtropical"
    ],
    "correct": "Tropical"
  },
  {
    "id": 16,
    "subject": "Matemática",
    "text": "Ao lançar um dado comum de 6 faces, qual a probabilidade de cair um número primo?",
    "options": [
      "1/6",
      "1/3",
      "1/2",
      "2/3"
    ],
    "correct": "1/2"
  },
  {
    "id": 17,
    "subject": "História",
    "text": "A Constituição outorgada em 1937, que deu início ao Estado Novo no Brasil, ficou conhecida como:",
    "options": [
      "Cidadã",
      "Polaca",
      "Mandioca",
      "Republicana"
    ],
    "correct": "Polaca"
  },
  {
    "id": 18,
    "subject": "Física",
    "text": "A Segunda Lei de Newton (Princípio Fundamental da Dinâmica) é expressa pela fórmula:",
    "options": [
      "F = m/a",
      "F = m + a",
      "F = m * a",
      "F = a / m"
    ],
    "correct": "F = m * a"
  },
  {
    "id": 19,
    "subject": "Biologia",
    "text": "A relação ecológica onde duas espécies se beneficiam, mas a união não é obrigatória para a sobrevivência, chama-se:",
    "options": [
      "Mutualismo",
      "Protocooperação",
      "Comensalismo",
      "Parasitismo"
    ],
    "correct": "Protocooperação"
  },
  {
    "id": 20,
    "subject": "Literatura",
    "text": "A obra 'Iracema', considerada um romance indianista do Romantismo brasileiro, foi escrita por:",
    "options": [
      "Machado de Assis",
      "José de Alencar",
      "Álvares de Azevedo",
      "Castro Alves"
    ],
    "correct": "José de Alencar"
  }
];

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const subjectIds = new Map();
const CATALOG = LEGACY_QUESTIONS.map((question) => {
  if (!subjectIds.has(question.subject)) subjectIds.set(question.subject, subjectIds.size + 1);
  const area = AREAS.find((candidate) => candidate.name === AREA_BY_SUBJECT[question.subject]);
  return {
    id: question.id,
    statement: question.text,
    source: 'MOCK',
    year: 2024,
    subjectId: subjectIds.get(question.subject),
    subjectName: question.subject,
    areaId: area.id,
    areaName: area.name,
    options: question.options.map((text, index) => ({
      id: question.id * 10 + index + 1,
      letter: LETTERS[index],
      text,
      correct: text === question.correct,
    })),
  };
});

const bodyOf = (config) => {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data;
};

const idFrom = (config, pattern) => Number(pattern.exec(config.url)?.[1]);
const notFound = (message) => [404, { code: 'RESOURCE_NOT_FOUND', message }];
const unprocessable = (code, message) => [422, { code, message }];
const percent = (probability) => Math.max(0, Math.min(100, Math.round(probability * 100)));
const average = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

export function registerDiagnosticMock(mock) {
  let nextDiagnosticId = 1;
  let nextAnswerId = 1;
  let diagnostic = null;

  const startDiagnostic = () => {
    diagnostic = {
      id: nextDiagnosticId,
      sessionId: nextDiagnosticId * 100,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: new Map(), // questionId -> { answerId, selectedOptionId, correct, skipped, subjectId }
      mastery: new Map(), // subjectId -> probabilidade estimada
      result: null,
    };
    nextDiagnosticId += 1;
  };

  const present = (current) => ({
    id: current.id,
    sessionId: current.sessionId,
    startedAt: current.startedAt,
    completedAt: current.completedAt,
    answeredCount: current.answers.size,
    totalQuestions: TOTAL_QUESTIONS,
  });

  const masteryOf = (subjectId) => diagnostic.mastery.get(subjectId) ?? INITIAL_MASTERY;

  const feedback = (question, answer, masteryBefore, masteryAfter) => ({
    answerId: answer.answerId,
    correct: answer.correct,
    correctOptionId: question.options.find((option) => option.correct).id,
    correctLetter: question.options.find((option) => option.correct).letter,
    masteryBefore,
    masteryAfter,
  });

  // "Não sei" e erros contam como respostas válidas e derrubam o domínio da matéria; acertos o aumentam.
  const buildResult = (current) => {
    const rows = new Map();
    CATALOG.forEach((question) => {
      const answer = current.answers.get(question.id);
      if (!answer) return;
      const row = rows.get(question.subjectId) ?? {
        subjectId: question.subjectId,
        subjectName: question.subjectName,
        areaId: question.areaId,
        areaName: question.areaName,
        answered: 0,
        correct: 0,
        skipped: 0,
      };
      row.answered += 1;
      if (answer.correct) row.correct += 1;
      if (answer.skipped) row.skipped += 1;
      rows.set(question.subjectId, row);
    });

    const subjects = [...rows.values()]
      .map((row) => ({ ...row, wrong: row.answered - row.correct - row.skipped }))
      .sort((a, b) => b.answered - b.correct - (a.answered - a.correct) || a.subjectId - b.subjectId);
    const withMastery = subjects.map((row) => ({ ...row, mastery: current.mastery.get(row.subjectId) ?? INITIAL_MASTERY }));

    const areas = AREAS.map((area) => {
      const inArea = withMastery.filter((row) => row.areaId === area.id);
      return inArea.length
        ? { areaId: area.id, name: area.name, color: area.color, score: percent(average(inArea.map((row) => row.mastery))) }
        : null;
    }).filter(Boolean);

    const weakest = [...withMastery].sort((a, b) => a.mastery - b.mastery || a.subjectId - b.subjectId)[0];
    return {
      id: current.id,
      overallMastery: Number(average(withMastery.map((row) => row.mastery)).toFixed(4)),
      completedAt: current.completedAt,
      answeredCount: subjects.reduce((sum, row) => sum + row.answered, 0),
      correctCount: subjects.reduce((sum, row) => sum + row.correct, 0),
      areas,
      priority: weakest
        ? { subjectId: weakest.subjectId, subjectName: weakest.subjectName, areaName: weakest.areaName, score: percent(weakest.mastery) }
        : null,
      subjects: subjects.map(({ areaId, ...row }) => row),
    };
  };

  mock.onPost('/api/v1/diagnostics').reply(() => {
    if (!diagnostic || diagnostic.completedAt) startDiagnostic();
    return [201, present(diagnostic)];
  });

  mock.onGet('/api/v1/diagnostics/current').reply(() =>
    diagnostic && !diagnostic.completedAt ? [200, present(diagnostic)] : notFound('No diagnostic in progress'),
  );

  mock.onGet(/\/api\/v1\/diagnostics\/\d+\/next-question$/).reply((config) => {
    if (!diagnostic || diagnostic.id !== idFrom(config, /diagnostics\/(\d+)\//)) return notFound('Diagnostic not found');
    if (diagnostic.completedAt) return unprocessable('DIAGNOSTIC_ALREADY_COMPLETED', 'Diagnostic is already completed');
    if (diagnostic.answers.size >= TOTAL_QUESTIONS) {
      return unprocessable('DIAGNOSTIC_NO_MORE_QUESTIONS', 'All questions were answered; complete the diagnostic');
    }
    const next = CATALOG.find((question) => !diagnostic.answers.has(question.id));
    if (!next) return unprocessable('NO_QUESTION_AVAILABLE', 'No more questions available for the diagnostic');
    return [
      200,
      {
        id: next.id,
        statement: next.statement,
        source: next.source,
        year: next.year,
        subjectName: next.subjectName,
        areaName: next.areaName,
        options: next.options.map(({ id, letter, text }) => ({ id, letter, text })),
      },
    ];
  });

  mock.onPost(/\/api\/v1\/sessions\/\d+\/answers$/).reply((config) => {
    if (!diagnostic || diagnostic.sessionId !== idFrom(config, /sessions\/(\d+)\//)) return notFound('Study session not found');
    const { questionId, selectedOptionId = null } = bodyOf(config);
    const question = CATALOG.find((candidate) => candidate.id === questionId);
    if (!question) return notFound('Question not found');

    const existing = diagnostic.answers.get(question.id);
    if (existing) {
      // Reenvio: devolve a mesma resposta sem mexer no domínio (igual ao back).
      const current = masteryOf(question.subjectId);
      return [201, feedback(question, existing, current, current)];
    }
    if (diagnostic.completedAt) return unprocessable('DIAGNOSTIC_ALREADY_COMPLETED', 'Diagnostic is already completed');

    const option = selectedOptionId === null ? null : question.options.find((candidate) => candidate.id === selectedOptionId);
    if (selectedOptionId !== null && !option) {
      return unprocessable('OPTION_NOT_IN_QUESTION', 'Option does not belong to this question');
    }

    const correct = option?.correct === true;
    const before = masteryOf(question.subjectId);
    const after = Math.max(0.02, Math.min(0.98, before + (correct ? 0.18 : -0.08)));
    diagnostic.mastery.set(question.subjectId, after);
    const answer = { answerId: nextAnswerId, selectedOptionId: option?.id ?? null, correct, skipped: option === null };
    nextAnswerId += 1;
    diagnostic.answers.set(question.id, answer);
    return [201, feedback(question, answer, before, after)];
  });

  mock.onPost(/\/api\/v1\/diagnostics\/\d+\/completion$/).reply((config) => {
    if (!diagnostic || diagnostic.id !== idFrom(config, /diagnostics\/(\d+)\//)) return notFound('Diagnostic not found');
    if (!diagnostic.completedAt) {
      if (diagnostic.answers.size < TOTAL_QUESTIONS) {
        return unprocessable('DIAGNOSTIC_INCOMPLETE', `Diagnostic requires ${TOTAL_QUESTIONS} answers`);
      }
      diagnostic.completedAt = new Date().toISOString();
      diagnostic.result = buildResult(diagnostic);
    }
    return [200, diagnostic.result];
  });
}
