import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { auth, isLoading, initializationError, retryAuthRestore } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container} accessibilityRole="progressbar">
        <ActivityIndicator color="#9FA8FF" />
      </View>
    );
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

  return <Redirect href={auth ? '/onboarding' : '/welcome'} />;
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
