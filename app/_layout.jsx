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

  return <Stack screenOptions={{ headerShown: false }} />;
}