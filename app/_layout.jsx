import { Stack } from 'expo-router';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="introduction/index" />
      <Stack.Screen name="account/index" />
      <Stack.Screen name="rotina/index" />
      <Stack.Screen name="convite/index" />
    </Stack>
  );
}