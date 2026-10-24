import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/Button';
import DotGridBackground from '../../components/DotGridBackground';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import { styles } from '../../styles/resposta';

// Dados de exemplo enquanto não há integração com a API
const RESPOSTA = {
  questaoAtual: 3,
  totalQuestoes: 6,
  marcada: { letra: 'B', texto: '32 g' },
  correta: true,
  tempoSegundos: 28,
  porqueCerta: {
    texto:
      'Você converteu massa em mol antes de comparar e viu que o H₂ acaba primeiro. É o limitante que define o produto: ',
    destaque: '32 g de água.',
  },
  atalho:
    'Na prova, compare direto a razão mol/coeficiente de cada reagente: o menor valor é o limitante. Economiza uma linha de conta.',
  plano: { mapaAntes: 42, mapaDepois: 49, sequencia: 3 },
};

const TEMAS = {
  verde: {
    cor: '#57DDA9',
    fundo: 'rgba(87, 221, 169, 0.08)',
    borda: 'rgba(87, 221, 169, 0.3)',
    badge: 'rgba(87, 221, 169, 0.16)',
  },
  lavanda: {
    cor: '#9FA8FF',
    fundo: 'rgba(159, 168, 255, 0.06)',
    borda: 'rgba(159, 168, 255, 0.3)',
    badge: 'rgba(159, 168, 255, 0.16)',
  },
  ambar: {
    cor: '#F0B95C',
    fundo: 'transparent',
    borda: '#202538',
    badge: 'rgba(240, 185, 92, 0.16)',
  },
};

const CardSecao = ({ numero, titulo, tema, children }) => {
  const cores = TEMAS[tema];

  return (
    <View style={[styles.secaoCard, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
      <View style={styles.secaoHeader}>
        <View style={[styles.secaoBadge, { backgroundColor: cores.badge }]}>
          <Text style={[styles.secaoBadgeNumero, { color: cores.cor }]}>{numero}</Text>
        </View>
        <Text style={[styles.secaoTitulo, { color: cores.cor }]}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
};

export default function RespostaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const acertou = RESPOSTA.correta;
  const corResultado = acertou ? '#57DDA9' : '#FF8A65';

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
            Questão {RESPOSTA.questaoAtual} / {RESPOSTA.totalQuestoes}
          </Text>
        </View>

        {/* Resultado */}
        <View
          style={[
            styles.resultadoCard,
            {
              backgroundColor: acertou ? 'rgba(87, 221, 169, 0.08)' : 'rgba(255, 138, 101, 0.08)',
              borderColor: acertou ? 'rgba(87, 221, 169, 0.3)' : 'rgba(255, 138, 101, 0.3)',
            },
          ]}
        >
          <View style={[styles.resultadoIcone, { backgroundColor: corResultado }]}>
            <Ionicons name={acertou ? 'checkmark' : 'close'} size={26} color="#0A0D14" />
          </View>
          <View style={styles.resultadoTextWrap}>
            <Text style={styles.resultadoTitulo}>
              Você marcou {RESPOSTA.marcada.letra} · {RESPOSTA.marcada.texto}
            </Text>
            <Text style={styles.resultadoSub}>
              {acertou ? 'Correta' : 'Incorreta'} · {RESPOSTA.tempoSegundos} s
            </Text>
          </View>
          <View style={[styles.confete, { top: 14, right: 18, width: 7, height: 7, backgroundColor: '#4FD1E8' }]} />
          <View style={[styles.confete, { top: 36, right: 34, width: 5, height: 5, backgroundColor: '#FF8A65' }]} />
        </View>

        {/* Explicações */}
        <View style={styles.secoesList}>
          <CardSecao numero={1} titulo="POR QUE ESTÁ CERTA" tema="verde">
            <Text style={styles.secaoTexto}>
              {RESPOSTA.porqueCerta.texto}
              <Text style={styles.secaoDestaque}>{RESPOSTA.porqueCerta.destaque}</Text>
            </Text>
          </CardSecao>

          <CardSecao numero={2} titulo="O ATALHO" tema="lavanda">
            <Text style={styles.secaoTexto}>{RESPOSTA.atalho}</Text>
          </CardSecao>

          <CardSecao numero={3} titulo="O QUE MUDA NO PLANO" tema="ambar">
            <View style={styles.mapaHeader}>
              <Text style={styles.mapaLabel}>SEU MAPA</Text>
              <Text style={styles.mapaValor}>
                {RESPOSTA.plano.mapaAntes}% → {RESPOSTA.plano.mapaDepois}%
              </Text>
            </View>
            <AnimatedProgressBar targetPercentage={RESPOSTA.plano.mapaDepois} color="#57DDA9" height={6} />

            <View style={styles.pillsRow}>
              <View style={[styles.pill, styles.pillAmbar]}>
                <Text style={[styles.pillText, styles.pillTextAmbar]}>
                  {RESPOSTA.plano.sequencia} seguidas
                </Text>
              </View>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.8}
                onPress={() => console.log('Ver questão difícil')}
              >
                <Text style={styles.pillText}>Ver questão difícil</Text>
              </TouchableOpacity>
            </View>
          </CardSecao>
        </View>
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton title="Próxima questão" onPress={() => console.log('Próxima questão')} />
      </View>
    </View>
  );
}