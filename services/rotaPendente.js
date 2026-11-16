import { ApiError } from './apiClient';

// true quando a rota ainda não existe no back (ou no mock).
// Usado para mostrar um estado vazio em vez de erro enquanto o back não implementa.
export function rotaPendente(error) {
  return error instanceof ApiError
    && ([404, 405, 501].includes(error.status) || error.code === 'MOCK_ENDPOINT_NOT_CONFIGURED');
}
