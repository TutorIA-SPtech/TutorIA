import { apiRequest, ApiError } from './apiClient';

const STUDY_PROFILE_PATH = '/api/v1/me/study-profile';

// Retorna null quando o usuário ainda não salvou o perfil de estudo.
export async function getStudyProfile() {
  try {
    return await apiRequest(STUDY_PROFILE_PATH, {
      method: 'GET',
      networkErrorMessage: 'Não foi possível carregar sua rotina. Confira a conexão.',
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// O PUT substitui o perfil inteiro (upsert), então todos os campos precisam ir juntos.
export function saveStudyProfile({ examDate, dailyMinutes, studyDays, targetCourseId }) {
  return apiRequest(STUDY_PROFILE_PATH, {
    method: 'PUT',
    data: {
      examDate,
      dailyMinutes,
      studyDays,
      targetCourseId: targetCourseId ?? null,
    },
    networkErrorMessage: 'Não foi possível salvar sua rotina. Confira a conexão e tente novamente.',
  });
}
