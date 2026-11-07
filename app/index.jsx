import { useCallback, useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../services/apiClient';
import { homeRouteFor } from '../services/authApi';
import { getCurrentUser } from '../services/userApi';

export default function Index() {
  const router = useRouter();
  const { auth, isLoading, initializationError, retryAuthRestore, signOut } = useAuth();
  const [destino, setDestino] = useState(null);
  const [erroDestino, setErroDestino] = useState('');

  // Com a sessão restaurada, pergunta ao back se o onboarding já foi feito para não repetir o questionário.
  const decidirDestino = useCallback(async () => {
    setErroDestino('');
    setDestino(null);
    try {
      const usuario = await getCurrentUser();
      setDestino(homeRouteFor(usuario?.onboardingCompleted === true));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Token expirado ou inválido: volta para a entrada do app.
        await signOut();
        return;
      }
      setErroDestino(error instanceof ApiError
        ? error.message
        : 'Não foi possível carregar sua conta. Tente novamente.');
    }
  }, [signOut]);

  useEffect(() => {
    if (!isLoading && auth) {
      decidirDestino();
    }
  }, [auth, isLoading, decidirDestino]);

  if (isLoading) {
    return <Carregando />;
  }

  if (initializationError) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{initializationError}</Text>
        <TouchableOpacity onPress={retryAuthRestore} accessibilityRole="button">
          <Text style={styles.action}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/welcome')} accessibilityRole="button">
          <Text style={styles.action}>Continuar sem sessão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!auth) {
    return <Redirect href="/welcome" />;
  }

  if (erroDestino) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{erroDestino}</Text>
        <TouchableOpacity onPress={decidirDestino} accessibilityRole="button">
          <Text style={styles.action}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return destino ? <Redirect href={destino} /> : <Carregando />;
}

function Carregando() {
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color="#9FA8FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#0A0D14',
  },
  message: {
    color: '#F2F4F8',
    textAlign: 'center',
  },
  action: {
    color: '#9FA8FF',
    fontWeight: '600',
  },
});
