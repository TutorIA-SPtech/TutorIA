import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import { styles } from '../../../styles/module/questao';

export const MOCK_QUESTOES = [
  {
    id: 1,
    tema: 'Reagente limitante',
    prova: 'FUVEST 2019',
    textoBase:
      'Foram misturados 4 g de H₂ com 32 g de O₂ para formar água. Considerando a reação completa, qual é a massa de água obtida?',
    opcoes: [
      { letra: 'A', texto: '18 g' },
      { letra: 'B', texto: '32 g' },
      { letra: 'C', texto: '36 g' },
      { letra: 'D', texto: '40 g' },
    ],
    correta: 'B',
    explicacaoCerta:
      'Você converteu massa em mol antes de comparar e viu que o H₂ acaba primeiro. O limitante define o produto: 32 g de água.',
    explicacaoErro:
      'Você somou as massas dos reagentes. Isso só valeria se os dois fossem consumidos; o O₂ está em excesso.',
    teoriaFaltante:
      'Limitante é o reagente que acaba primeiro. É preciso converter massa em mol antes de comparar.',
  },
  {
    id: 2,
    tema: 'Balanceamento',
    prova: 'ENEM 2024',
    textoBase: 'Qual é a soma dos coeficientes mínimos da reação 2H₂ + O₂ → 2H₂O?',
    opcoes: [
      { letra: 'A', texto: '3' },
      { letra: 'B', texto: '4' },
      { letra: 'C', texto: '5' },
      { letra: 'D', texto: '6' },
    ],
    correta: 'C',
    explicacaoCerta: 'A equação já está balanceada com coeficientes 2, 1 e 2, cuja soma é 5.',
    explicacaoErro: 'A soma deve considerar os coeficientes mínimos de todas as substâncias da reação.',
    teoriaFaltante: 'Uma equação balanceada conserva a quantidade de átomos de cada elemento.',
  },
];

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

const statusDoSegmento = (index, questaoAtual) => {
  if (index === questaoAtual) return 'atual';
  return 'pendente';
};

export default function QuestaoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { index: indexParam } = useLocalSearchParams();
  const index = Number(indexParam) || 0;
  const questaoAtual = MOCK_QUESTOES[index] || MOCK_QUESTOES[0];
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [segundos, setSegundos] = useState(0);
  const totalQuestoes = MOCK_QUESTOES.length;

  useEffect(() => {
    const intervalo = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const responder = () => {
    const acertou = opcaoSelecionada === questaoAtual.correta;
    const opcaoMarcada = questaoAtual.opcoes.find(
      (opcao) => opcao.letra === opcaoSelecionada
    );
    const payload = {
      acertou,
      questaoAtual: index + 1,
      totalQuestoes,
      opcaoMarcada,
      explicacao: acertou ? questaoAtual.explicacaoCerta : questaoAtual.explicacaoErro,
      teoriaFaltante: questaoAtual.teoriaFaltante,
      opcaoCorreta: questaoAtual.opcoes.find(
        (opcao) => opcao.letra === questaoAtual.correta
      ),
      isUltimaQuestao: index === totalQuestoes - 1,
      proximoIndex: index + 1,
    };

    router.push({
      pathname: acertou
        ? '/(private)/module/resposta'
        : '/(private)/module/resposta-erro',
      params: { payload: JSON.stringify(payload) },
    });
  };

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
            Questão {index + 1} / {totalQuestoes}
          </Text>
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{formatarTempo(segundos)}</Text>
          </View>
        </View>

        {/* Progresso da sessão */}
        <View style={styles.segmentosRow}>
          {Array.from({ length: totalQuestoes }).map((_, segmentoIndex) => (
            <View
              key={segmentoIndex}
              style={[
                styles.segmento,
                { backgroundColor: COR_SEGMENTO[statusDoSegmento(segmentoIndex, index)] },
              ]}
            />
          ))}
        </View>

        {/* Tema e prova */}
        <View style={styles.metaRow}>
          <View style={styles.temaPill}>
            <Text style={styles.temaText}>{questaoAtual.tema}</Text>
          </View>
          <Text style={styles.provaText}>{questaoAtual.prova}</Text>
        </View>

        {/* Enunciado */}
        <Text style={styles.enunciado}>{questaoAtual.textoBase}</Text>

        {/* Alternativas */}
        <View style={styles.opcoesList}>
          {questaoAtual.opcoes.map((opcao) => {
            const ativa = opcaoSelecionada === opcao.letra;

            return (
              <TouchableOpacity
                key={opcao.letra}
                style={[styles.opcaoCard, ativa && styles.opcaoCardSelecionada]}
                activeOpacity={0.8}
                onPress={() => setOpcaoSelecionada(opcao.letra)}
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
          style={[styles.responderWrapper, !opcaoSelecionada && styles.responderDesabilitado]}
          pointerEvents={opcaoSelecionada ? 'auto' : 'none'}
        >
          <PrimaryButton title="Responder" onPress={responder} />
        </View>
      </View>
    </View>
  );
}