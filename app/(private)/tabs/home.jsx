import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedCircleProgress from '../../../components/AnimatedCircleProgress';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/tabs/home';

// Dados de exemplo enquanto não há integração com a API
const USUARIO = {
  nome: 'Marina',
  iniciais: 'MS',
  prova: 'ENEM 2026',
  diasParaProva: 75,
  sequencia: 12,
};

const TRILHA_HOJE = {
  minutos: 55,
  modulo: 'Estequiometria',
  parte: 'Módulo 2 · parte 1 de 3',
  progresso: 43,
  topicos: 3,
  questoes: 12,
};

const DOMINIO = [
  { area: 'Matemática', valor: 64, tendencia: 'up', corBarra: '#9FA8FF', corValor: '#57DDA9' },
  { area: 'Ciências da natureza', valor: 41, tendencia: 'down', corBarra: '#FF8A65', corValor: '#FF8A65' },
  { area: 'Humanas', valor: 57, tendencia: 'up', corBarra: '#9FA8FF', corValor: '#8A91A6' },
];

const REVISAO = {
  titulo: 'Revisar antes de esquecer',
  detalhe: 'Funções · há 9 dias',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <DotGridBackground />
      <LinearGradient
        colors={['rgba(28, 16, 80, 0.4)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.6 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(73, 23, 23, 0.5)', 'transparent']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.8, y: 0.4 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#C4B4FF', '#929CFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{USUARIO.iniciais}</Text>
          </LinearGradient>

          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Olá, {USUARIO.nome}</Text>
            <Text style={styles.greetingSub}>
              {USUARIO.prova} · {USUARIO.diasParaProva} dias
            </Text>
          </View>

          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color="#F0B95C" />
            <Text style={styles.streakText}>{USUARIO.sequencia}</Text>
          </View>
        </View>

        {/* Trilha de hoje */}
        <View style={styles.trilhaCard}>
          <View style={styles.trilhaHeader}>
            <Text style={styles.trilhaLabel}>TRILHA DE HOJE</Text>
            <Text style={styles.trilhaTempo}>{TRILHA_HOJE.minutos} MIN</Text>
          </View>

          <View style={styles.trilhaBody}>
            <View style={styles.trilhaTextWrap}>
              <Text style={styles.trilhaTitulo}>{TRILHA_HOJE.modulo}</Text>
              <Text style={styles.trilhaSub}>{TRILHA_HOJE.parte}</Text>
            </View>
            <AnimatedCircleProgress
              score={TRILHA_HOJE.progresso}
              size={72}
              strokeWidth={7}
              fontSize={15}
            />
          </View>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{TRILHA_HOJE.topicos} tópicos</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{TRILHA_HOJE.questoes} questões</Text>
            </View>
          </View>

          <PrimaryButton title="Continuar" onPress={() => console.log('Continuar trilha')} />
        </View>

        {/* Seu domínio */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>SEU DOMÍNIO</Text>
          <TouchableOpacity onPress={() => console.log('Ver tudo')}>
            <Text style={styles.sectionLink}>ver tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.areasList}>
          {DOMINIO.map((item) => (
            <View key={item.area} style={styles.areaItem}>
              <View style={styles.areaHeader}>
                <Text style={styles.areaName}>{item.area}</Text>
                <View style={styles.areaValueRow}>
                  <Text style={[styles.areaScore, { color: item.corValor }]}>{item.valor}%</Text>
                  <Ionicons
                    name={item.tendencia === 'up' ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={item.corValor}
                  />
                </View>
              </View>
              <AnimatedProgressBar targetPercentage={item.valor} color={item.corBarra} />
            </View>
          ))}
        </View>

        {/* Revisar antes de esquecer */}
        <TouchableOpacity
          style={styles.revisaoCard}
          activeOpacity={0.8}
          onPress={() => console.log('Revisar conteúdo')}
        >
          <View style={styles.revisaoIconWrapper}>
            <Ionicons name="time-outline" size={20} color="#FF8A65" />
          </View>
          <View style={styles.revisaoTextWrap}>
            <Text style={styles.revisaoTitulo}>{REVISAO.titulo}</Text>
            <Text style={styles.revisaoDetalhe}>{REVISAO.detalhe}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FF8A65" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}