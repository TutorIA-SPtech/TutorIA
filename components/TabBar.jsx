import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// "name" é o nome do arquivo dentro de app/(private)/(tabs)/.
// Abas sem arquivo ainda ficam visíveis, mas sem ação, até a tela ser criada.
const ABAS = [
  { name: 'index', label: 'Início', icon: 'home-outline' },
  { name: 'plano', label: 'Plano', icon: 'book-outline' },
  { name: 'ia', label: 'IA', icon: 'star-outline' },
  { name: 'progresso', label: 'Progresso', icon: 'stats-chart-outline' },
  { name: 'perfil', label: 'Perfil', icon: 'person-outline' },
];

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const rotaAtiva = state.routes[state.index]?.name;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {ABAS.map((aba) => {
        const rota = state.routes.find((item) => item.name === aba.name);
        const ativa = rotaAtiva === aba.name;

        const handlePress = () => {
          if (!rota) return;

          const evento = navigation.emit({
            type: 'tabPress',
            target: rota.key,
            canPreventDefault: true,
          });

          if (!ativa && !evento.defaultPrevented) {
            navigation.navigate(rota.name, rota.params);
          }
        };

        return (
          <Pressable
            key={aba.name}
            style={styles.tab}
            onPress={handlePress}
            disabled={!rota}
            accessibilityRole="button"
            accessibilityLabel={aba.label}
            accessibilityState={{ selected: ativa, disabled: !rota }}
          >
            <View style={[styles.iconWrapper, ativa && styles.iconWrapperActive]}>
              <Ionicons name={aba.icon} size={22} color={ativa ? '#9FA8FF' : '#5C668A'} />
            </View>
            <Text style={[styles.label, ativa && styles.labelActive]}>{aba.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0A0D14',
    borderTopWidth: 1,
    borderTopColor: '#202538',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 52,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(159, 168, 255, 0.16)',
  },
  label: {
    color: '#5C668A',
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});