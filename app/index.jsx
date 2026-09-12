import { Redirect } from "expo-router";

export default function Index() {
  // Mais para frente, aqui entra a lógica: se tiver token, vai pro App; se não, vai pro Welcome.
  return <Redirect href="/welcome" />;
}