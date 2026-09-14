import { Stack } from 'expo-router';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';

export default function RootLayout() {
  // Carrega as fontes do Google
  const [fontesCarregadas] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
  });

  // Segura a renderização até que as fontes estejam prontas para evitar texto invisível
  if (!fontesCarregadas) {
    return null;
  }

  // Lógica de Renderização da estrutura de navegação
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(public)" /> 
    </Stack>
  );
}