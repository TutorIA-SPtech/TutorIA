import { apiRequest } from './apiClient';
import { getLocalAccount, saveLocalAccount } from './localAccountStorage';
import { rotaPendente } from './rotaPendente';

// Contrato completo em BACKEND-HANDOFF.md.
const ACCOUNT_PATH = '/api/v1/me/account';

// Retorna { name, nickname, email, pendenteNoBack }.
// pendenteNoBack = true quando o back ainda não tem a rota; aí usa a cópia local
// salva no login/cadastro.
export async function getAccount() {
  try {
    const conta = await apiRequest(ACCOUNT_PATH, {
      method: 'GET',
      networkErrorMessage: 'Não foi possível carregar seus dados. Confira a conexão.',
    });
    await saveLocalAccount(conta).catch(() => {});
    return { ...conta, pendenteNoBack: false };
  } catch (error) {
    if (!rotaPendente(error)) throw error;
    const local = await getLocalAccount().catch(() => null);
    return {
      name: local?.name ?? '',
      nickname: local?.nickname ?? null,
      email: local?.email ?? '',
      pendenteNoBack: true,
    };
  }
}

// PATCH /api/v1/me/account  { name, nickname } -> { name, nickname, email }
export async function updateAccount({ name, nickname }) {
  const conta = await apiRequest(ACCOUNT_PATH, {
    method: 'PATCH',
    data: { name, nickname: nickname || null },
    networkErrorMessage: 'Não foi possível salvar seus dados. Confira a conexão.',
  });
  await saveLocalAccount(conta).catch(() => {});
  return conta;
}

// PUT /api/v1/me/account/email  { newEmail, currentPassword }
// -> { accessToken, tokenType, account }  (token novo porque o e-mail costuma ser o "subject" do JWT)
export async function updateEmail({ newEmail, currentPassword }) {
  const resposta = await apiRequest(`${ACCOUNT_PATH}/email`, {
    method: 'PUT',
    data: { newEmail: newEmail.trim(), currentPassword },
    unauthorizedMessage: 'Senha atual incorreta.',
    networkErrorMessage: 'Não foi possível alterar o e-mail. Confira a conexão.',
  });
  if (resposta?.account) {
    await saveLocalAccount(resposta.account).catch(() => {});
  }
  return resposta;
}
