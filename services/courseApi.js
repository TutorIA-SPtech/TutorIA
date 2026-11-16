import { apiRequest, ApiError } from './apiClient';

const COURSE_PAGE_SIZE = 200;
const COURSE_DEGREES_PATH = '/api/v1/courses/degrees';
const COURSES_PATH = '/api/v1/courses';
const COURSE_CUTOFF_STATISTICS_PATH = '/api/v1/courses/cutoff-statistics';

export async function getCourseDegrees() {
  const degrees = await apiRequest(COURSE_DEGREES_PATH, {
    networkErrorMessage: 'Não foi possível carregar os tipos de curso. Confira a conexão.',
  });

  if (!Array.isArray(degrees) || degrees.some((degree) => typeof degree !== 'string')) {
    throw new ApiError('A lista de tipos de curso recebida é inválida.');
  }

  return degrees;
}

export async function getCoursesByDegree(degree) {
  if (!degree?.trim()) {
    throw new ApiError('Selecione um tipo de curso para carregar os cursos.');
  }

  const courses = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await apiRequest(COURSES_PATH, {
      params: { degree, page, size: COURSE_PAGE_SIZE },
      networkErrorMessage: 'Não foi possível carregar os cursos. Confira a conexão.',
    });

    if (
      !Array.isArray(response?.content)
      || !Number.isInteger(response.totalPages)
      || response.totalPages < 0
      || response.content.some((course) => (
        typeof course?.name !== 'string' || typeof course?.degree !== 'string'
      ))
    ) {
      throw new ApiError('A lista de cursos recebida é inválida.');
    }

    if (page === 0) totalPages = response.totalPages;
    courses.push(...response.content);
    page += 1;
  }

  return courses;
}

export async function getCourseCutoffStatistics(name, degree) {
  if (!name?.trim() || !degree?.trim()) {
    throw new ApiError('Selecione um tipo e um curso para consultar as notas de corte.');
  }

  const statistics = await apiRequest(COURSE_CUTOFF_STATISTICS_PATH, {
    params: { name, degree },
    networkErrorMessage: 'Não foi possível carregar as notas de corte. Confira a conexão.',
  });

  const validInstitutions = (institutions) => (
    Array.isArray(institutions)
    && institutions.every((institution) => typeof institution === 'string')
  );
  const hasValidScores = statistics?.sampleSize === 0
    ? statistics.minimumScore === null
      && statistics.medianScore === null
      && statistics.maximumScore === null
    : Number.isFinite(Number(statistics?.minimumScore))
      && Number.isFinite(Number(statistics?.medianScore))
      && Number.isFinite(Number(statistics?.maximumScore));

  if (
    !Number.isInteger(statistics?.sampleSize)
    || statistics.sampleSize < 0
    || !hasValidScores
    || !validInstitutions(statistics.minimumInstitutions)
    || !validInstitutions(statistics.maximumInstitutions)
  ) {
    throw new ApiError('As estatísticas de notas de corte recebidas são inválidas.');
  }

  return statistics;
}
