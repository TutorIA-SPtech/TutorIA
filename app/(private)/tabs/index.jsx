import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedCircleProgress from '../../../components/AnimatedCircleProgress';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/tabs/home';

// Dados mockados preparados para receber injeção de uma API futura
const MOCK_API_RESPONSE = {
  usuario: { nome: 'Marina', iniciais: 'MS', prova: 'ENEM 2026', diasParaProva: 75, sequencia: 12 },
  trilha: { minutos: 55, modulo: 'Estequiometria', parte: 'Módulo 2 · parte 1 de 3', progresso: 43, topicos: 3, questoes: 12 },
  dominio: [
    { area: 'Matemática', valor: 64, tendencia: 'up', corBarra: '#9FA8FF', corValor: '#57DDA9' },
    { area: 'Ciências da natureza', valor: 41, tendencia: 'down', corBarra: '#FF8A65', corValor: '#FF8A65' },
    { area: 'Humanas', valor: 57, tendencia: 'up', corBarra: '#9FA8FF', corValor: '#8A91A6' },
  ],
  revisao: { titulo: 'Revisar antes de esquecer', detalhe: 'Funções · há 9 dias' }
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Estado que armazenará os dados da Home dinamicamente
  const [data, setData] = useState(MOCK_API_RESPONSE);

  return (
    <View style={styles.container}>
      <DotGridBackground />
      <LinearGradient colors={['rgba(28, 16, 80, 0.4)', 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0.2, y: 0.6 }} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <LinearGradient colors={['rgba(73, 23, 23, 0.5)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0.8, y: 0.4 }} style={StyleSheet.absoluteFill} pointerEvents="none" />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: 24 }]} showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <LinearGradient colors={['#C4B4FF', '#929CFE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
            <Text style={styles.avatarText}>{data.usuario.iniciais}</Text>
          </LinearGradient>
          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Olá, {data.usuario.nome}</Text>
            <Text style={styles.greetingSub}>{data.usuario.prova} · {data.usuario.diasParaProva} dias</Text>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={14} color="#F0B95C" />
            <Text style={styles.streakText}>{data.usuario.sequencia}</Text>
          </View>
        </View>

        {/* Trilha de hoje */}
        <View style={styles.trilhaCard}>
          <View style={styles.trilhaHeader}>
            <Text style={styles.trilhaLabel}>TRILHA DE HOJE</Text>
            <Text style={styles.trilhaTempo}>{data.trilha.minutos} MIN</Text>
          </View>
          <View style={styles.trilhaBody}>
            <View style={styles.trilhaTextWrap}>
              <Text style={styles.trilhaTitulo}>{data.trilha.modulo}</Text>
              <Text style={styles.trilhaSub}>{data.trilha.parte}</Text>
            </View>
            <AnimatedCircleProgress score={data.trilha.progresso} size={72} strokeWidth={7} fontSize={15} />
          </View>
          <View style={styles.chipsRow}>
            <View style={styles.chip}><Text style={styles.chipText}>{data.trilha.topicos} tópicos</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>{data.trilha.questoes} questões</Text></View>
          </View>
          {/* Navegação conectada dinamicamente */}
          <PrimaryButton title="Continuar" onPress={() => router.push('/tabs/plano')} />
        </View>

        {/* Seu domínio */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>SEU DOMÍNIO</Text>
          <TouchableOpacity onPress={() => console.log('Ver tudo')}><Text style={styles.sectionLink}>ver tudo</Text></TouchableOpacity>
        </View>
        <View style={styles.areasList}>
          {data.dominio.map((item) => (
            <View key={item.area} style={styles.areaItem}>
              <View style={styles.areaHeader}>
                <Text style={styles.areaName}>{item.area}</Text>
                <View style={styles.areaValueRow}>
                  <Text style={[styles.areaScore, { color: item.corValor }]}>{item.valor}%</Text>
                  <Ionicons name={item.tendencia === 'up' ? 'arrow-up' : 'arrow-down'} size={12} color={item.corValor} />
                </View>
              </View>
              <AnimatedProgressBar targetPercentage={item.valor} color={item.corBarra} />
            </View>
          ))}
        </View>

        {/* Revisar antes de esquecer */}
        <TouchableOpacity style={styles.revisaoCard} activeOpacity={0.8}>
          <View style={styles.revisaoIconWrapper}><Ionicons name="time-outline" size={20} color="#FF8A65" /></View>
          <View style={styles.revisaoTextWrap}>
            <Text style={styles.revisaoTitulo}>{data.revisao.titulo}</Text>
            <Text style={styles.revisaoDetalhe}>{data.revisao.detalhe}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FF8A65" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}