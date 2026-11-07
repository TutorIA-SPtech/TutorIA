import { useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useMensagem } from '../components/CaixaMensagem';
import { signOutGoogle } from '../services/googleAuth';

const TITULO_SAIDA = 'Sair da conta?';
const MENSAGEM_SAIDA = 'Você voltará para a tela de entrada. Seu progresso salvo continua na sua conta.';

export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { mostrarMensagem, confirmar } = useMensagem();
  const saidaEmAndamento = useRef(false);

  const logout = useCallback(async () => {
    if (saidaEmAndamento.current) {
      return;
    }
    saidaEmAndamento.current = true;

    try {
      await signOutGoogle();
      await signOut();

      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/welcome');
    } catch {
      mostrarMensagem({ tipo: 'erro', titulo: 'Não foi possível sair', mensagem: 'Tente novamente.' });
    } finally {
      saidaEmAndamento.current = false;
    }
  }, [router, signOut, mostrarMensagem]);

  const confirmarSaida = useCallback(async () => {
    const confirmou = await confirmar({
      titulo: TITULO_SAIDA,
      mensagem: MENSAGEM_SAIDA,
      textoConfirmar: 'Sair',
      destrutivo: true,
    });
    if (confirmou) {
      logout();
    }
  }, [confirmar, logout]);

  return { logout, confirmarSaida };
}
