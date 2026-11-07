import { Stack } from 'expo-router';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { MensagemProvider } from '../components/CaixaMensagem';

export default function RootLayout() {
  const [fontesCarregadas] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
  });

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <AuthProvider>
      <MensagemProvider>
        <StatusBar style="light" backgroundColor="transparent" translucent={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(public)" />
        </Stack>
      </MensagemProvider>
    </AuthProvider>
  );
}