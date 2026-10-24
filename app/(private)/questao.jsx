import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/Button';
import DotGridBackground from '../../components/DotGridBackground';
import { styles } from '../../styles/questao';

// Dados de exemplo enquanto não há integração com a API
const SESSAO = {
  questaoAtual: 4,
  totalQuestoes: 6,
  // resultado das questões já respondidas, na ordem
  resultados: ['acerto', 'erro', 'acerto'],
  tempoInicialSegundos: 80,
};

const QUESTAO = {
  tema: 'Reagente limitante',
  prova: 'FUVEST 2019',
  enunciado:
    'Foram misturados 4 g de H₂ com 32 g de O₂ para formar água. Considerando a reação completa, qual é a massa de água obtida?',
  opcoes: [
    { letra: 'A', texto: '18 g' },
    { letra: 'B', texto: '32 g' },
    { letra: 'C', texto: '36 g' },
    { letra: 'D', texto: '40 g' },
    { letra: 'E', texto: '72 g' },
  ],
};

const COR_SEGMENTO = {
  acerto: '#57DDA9',
  erro: '#FF8A65',
  atual: '#9FA8FF',
  pendente: '#202538',
};

const formatarTempo = (total) => {
  const minutos = String(Math.floor(total / 60)).padStart(2, '0');
  const segundos = String(total % 60).padStart(2, '0');
  return `${minutos}:${segundos}`;
};

const statusDoSegmento = (index) => {
  if (index < SESSAO.resultados.length) return SESSAO.resultados[index];
  if (index === SESSAO.questaoAtual - 1) return 'atual';
  return 'pendente';
};

export default function QuestaoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selecionada, setSelecionada] = useState(null);
  const [segundos, setSegundos] = useState(SESSAO.tempoInicialSegundos);

  useEffect(() => {
    const intervalo = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, []);

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
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Questão {SESSAO.questaoAtual} / {SESSAO.totalQuestoes}
          </Text>
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{formatarTempo(segundos)}</Text>
          </View>
        </View>

        {/* Progresso da sessão */}
        <View style={styles.segmentosRow}>
          {Array.from({ length: SESSAO.totalQuestoes }).map((_, index) => (
            <View
              key={index}
              style={[styles.segmento, { backgroundColor: COR_SEGMENTO[statusDoSegmento(index)] }]}
            />
          ))}
        </View>

        {/* Tema e prova */}
        <View style={styles.metaRow}>
          <View style={styles.temaPill}>
            <Text style={styles.temaText}>{QUESTAO.tema}</Text>
          </View>
          <Text style={styles.provaText}>{QUESTAO.prova}</Text>
        </View>

        {/* Enunciado */}
        <Text style={styles.enunciado}>{QUESTAO.enunciado}</Text>

        {/* Alternativas */}
        <View style={styles.opcoesList}>
          {QUESTAO.opcoes.map((opcao) => {
            const ativa = selecionada === opcao.letra;

            return (
              <TouchableOpacity
                key={opcao.letra}
                style={[styles.opcaoCard, ativa && styles.opcaoCardSelecionada]}
                activeOpacity={0.8}
                onPress={() => setSelecionada(opcao.letra)}
              >
                <View style={[styles.opcaoLetraWrapper, ativa && styles.opcaoLetraWrapperSelecionada]}>
                  <Text style={[styles.opcaoLetra, ativa && styles.opcaoLetraSelecionada]}>
                    {opcao.letra}
                  </Text>
                </View>
                <Text style={styles.opcaoTexto}>{opcao.texto}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Rodapé fixo */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.dicaButton}
          activeOpacity={0.8}
          onPress={() => console.log('Dica')}
        >
          <Ionicons name="bulb-outline" size={18} color="#8A91A6" />
          <Text style={styles.dicaText}>Dica</Text>
        </TouchableOpacity>

        <View
          style={[styles.responderWrapper, !selecionada && styles.responderDesabilitado]}
          pointerEvents={selecionada ? 'auto' : 'none'}
        >
          <PrimaryButton title="Responder" onPress={() => console.log(`Responder ${selecionada}`)} />
        </View>
      </View>
    </View>
  );
}