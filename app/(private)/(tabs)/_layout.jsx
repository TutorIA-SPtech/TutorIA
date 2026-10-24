import { Tabs } from 'expo-router';
import { TabBar } from '../../../components/TutoriaUI';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        lazy: false,
        sceneStyle: { backgroundColor: '#0A0D14' },
      }}
    >
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="ia" />
      <Tabs.Screen name="progresso" />
      <Tabs.Screen name="limite" options={{ href: null }} />
    </Tabs>
  );
}