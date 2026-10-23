import { useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { signOutGoogle } from '../services/googleAuth';

const TITULO_SAIDA = 'Sair da conta?';
const MENSAGEM_SAIDA = 'Você voltará para a tela de entrada. Seu progresso salvo continua na sua conta.';

// Fluxo único de logout. Reutilizar na futura tela de Perfil.
export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const saidaEmAndamento = useRef(false);

  const logout = useCallback(async () => {
    if (saidaEmAndamento.current) {
      return;
    }
    saidaEmAndamento.current = true;

    try {
      // Nunca lança erro: falha no Google não impede o logout do app.
      await signOutGoogle();
      await signOut();

      // Remove as telas privadas da pilha para o voltar do Android não retornar a elas.
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/welcome');
    } catch {
      Alert.alert('Não foi possível sair', 'Tente novamente.');
    } finally {
      saidaEmAndamento.current = false;
    }
  }, [router, signOut]);

  const confirmarSaida = useCallback(() => {
    // Alert.alert não exibe nada na web.
    if (Platform.OS === 'web') {
      if (window.confirm(`${TITULO_SAIDA}\n\n${MENSAGEM_SAIDA}`)) {
        logout();
      }
      return;
    }

    Alert.alert(TITULO_SAIDA, MENSAGEM_SAIDA, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  return { logout, confirmarSaida };
}
