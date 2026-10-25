import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/module/plano-atualizado';

// Dados de exemplo enquanto não há integração com a API
const PLANO = {
  titulo: 'Ajustei sua trilha',
  subtitulo: 'Nada muda sem você ver o quê e o porquê.',
  mudancas: [
    {
      id: 1,
      tipo: 'entrou',
      titulo: '2 sessões de reagente limitante',
      detalhe: 'Pré-requisito de 3 assuntos do seu edital',
    },
    {
      id: 2,
      tipo: 'adiado',
      titulo: 'Termoquímica → semana que vem',
      detalhe: null,
    },
    {
      id: 3,
      tipo: 'removido',
      titulo: 'Revisão de mol',
      detalhe: 'Domínio já em 94%',
    },
  ],
  impacto: {
    percentual: 34,
    conclusaoPrevista: '02/11',
    dentroDoPrazo: true,
  },
};

const TIPOS = {
  entrou: {
    rotulo: 'ENTROU',
    icone: 'add',
    cor: '#57DDA9',
    fundo: 'rgba(87, 221, 169, 0.08)',
    borda: 'rgba(87, 221, 169, 0.3)',
    badge: 'rgba(87, 221, 169, 0.16)',
  },
  adiado: {
    rotulo: 'ADIADO',
    icone: 'time-outline',
    cor: '#F0B95C',
    fundo: 'transparent',
    borda: '#202538',
    badge: 'rgba(240, 185, 92, 0.16)',
  },
  removido: {
    rotulo: 'REMOVIDO',
    icone: 'remove',
    cor: '#8A91A6',
    fundo: 'transparent',
    borda: '#202538',
    badge: 'rgba(138, 145, 166, 0.16)',
  },
};

const CardMudanca = ({ mudanca }) => {
  const tipo = TIPOS[mudanca.tipo];

  return (
    <View style={[styles.mudancaCard, { backgroundColor: tipo.fundo, borderColor: tipo.borda }]}>
      <View style={styles.mudancaHeader}>
        <View style={[styles.mudancaBadge, { backgroundColor: tipo.badge }]}>
          <Ionicons name={tipo.icone} size={16} color={tipo.cor} />
        </View>
        <Text style={[styles.mudancaTag, { color: tipo.cor }]}>{tipo.rotulo}</Text>
      </View>
      <Text style={styles.mudancaTitulo}>{mudanca.titulo}</Text>
      {mudanca.detalhe && <Text style={styles.mudancaSub}>{mudanca.detalhe}</Text>}
    </View>
  );
};

export default function PlanoAtualizadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { impacto } = PLANO;

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
        <Text style={styles.headerTitle}>Plano atualizado</Text>

        <View style={styles.heroRow}>
          <Image
            source={require('../../../assets/tuti.png')}
            style={styles.mascote}
            resizeMode="contain"
          />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitulo}>{PLANO.titulo}</Text>
            <Text style={styles.heroSub}>{PLANO.subtitulo}</Text>
          </View>
        </View>

        {/* Mudanças */}
        <View style={styles.mudancasList}>
          {PLANO.mudancas.map((mudanca) => (
            <CardMudanca key={mudanca.id} mudanca={mudanca} />
          ))}
        </View>

        {/* Impacto no prazo */}
        <View style={styles.impactoCard}>
          <View style={styles.impactoHeader}>
            <Text style={styles.impactoLabel}>IMPACTO NO PRAZO</Text>
            <Text style={styles.impactoValor}>{impacto.percentual}%</Text>
          </View>
          <AnimatedProgressBar targetPercentage={impacto.percentual} color="#9FA8FF" height={6} />
          <Text style={styles.impactoNota}>
            Conclusão prevista {impacto.conclusaoPrevista} ·{' '}
            {impacto.dentroDoPrazo ? 'dentro' : 'fora'} da data da prova.
          </Text>
        </View>
      </ScrollView>

      {/* Botões fixos no rodapé */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          title="Aceitar mudanças"
          onPress={() => router.replace('/(private)/tabs/plano')}
        />
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => router.replace('/(private)/tabs/plano')}
        >
          <Text style={styles.secondaryButtonTexto}>Manter meu plano atual</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}