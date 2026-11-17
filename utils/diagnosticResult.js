// Traduz o que o back devolve (/completion e /next-question) para o que as telas exibem.

const AREA_COLORS = {
  Matemática: '#9FA8FF',
  Linguagens: '#57DDA9',
  'Ciências da natureza': '#FF8A65',
  Humanas: '#B39DFF',
};
const FALLBACK_COLOR = '#9FA8FF';

const clampPercent = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
const plural = (count, singular, pluralForm) => (count === 1 ? singular : pluralForm);

// "Matemática" quando matéria e área coincidem; senão "Física • Ciências da natureza".
export function formatQuestionCategory(question) {
  const { subjectName, areaName } = question;
  if (!subjectName) return areaName ?? '';
  return !areaName || areaName === subjectName ? subjectName : `${subjectName} • ${areaName}`;
}

// Justifica a prioridade com o que o aluno de fato fez nessa matéria (erros e "não sei" contam).
export function buildPriorityReason(priority, subjects = []) {
  const stats = subjects.find((subject) => subject.subjectId === priority.subjectId);
  const wrong = stats?.wrong ?? 0;
  const skipped = stats?.skipped ?? 0;
  const mastery = `domínio estimado de ${clampPercent(priority.score)}%`;
  if (!stats || wrong + skipped === 0) {
    return `${mastery} — é o ponto de partida mais importante do seu plano.`;
  }
  const parts = [];
  if (wrong > 0) parts.push(`${wrong} ${plural(wrong, 'erro', 'erros')}`);
  if (skipped > 0) parts.push(`${skipped} “não sei”`);
  return `${parts.join(' e ')} em ${stats.answered} ${plural(stats.answered, 'questão', 'questões')} — ${mastery}.`;
}

export function toResultViewModel(result) {
  if (!result) return null;
  return {
    overallScore: clampPercent((Number(result.overallMastery) || 0) * 100),
    totalQuestions: result.answeredCount ?? 0,
    areas: (result.areas ?? []).map((area) => ({
      key: String(area.areaId ?? area.name),
      name: area.name,
      score: clampPercent(area.score),
      color: isHexColor(area.color) ? area.color : AREA_COLORS[area.name] ?? FALLBACK_COLOR,
    })),
    priority: result.priority
      ? {
          subject: result.priority.subjectName,
          reason: buildPriorityReason(result.priority, result.subjects),
        }
      : null,
    subjects: result.subjects ?? [],
  };
}
