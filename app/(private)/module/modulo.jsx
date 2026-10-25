import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import { styles } from '../../../styles/module/modulo';

// Dados de exemplo enquanto não há integração com a API
const MODULO = {
  numero: 2,
  titulo: 'Estequiometria',
  descricao: 'Sequência definida pelos pré-requisitos que faltam no seu mapa.',
  totalTopicos: 7,
  minutosRestantes: 55,
};

const TOPICOS = [
  { id: 1, titulo: 'Mol e massa molar', duracao: '8 min', status: 'concluido' },
  { id: 2, titulo: 'Balanceamento', duracao: '10 min', status: 'concluido' },
  {
    id: 3,
    titulo: 'Cálculo com reagente limitante',
    duracao: '15 min',
    status: 'atual',
    detalhe: 'Teoria curta + 6 questões',
  },
  { id: 4, titulo: 'Rendimento e pureza', duracao: '12 min', status: 'pendente' },
  { id: 5, titulo: 'Cálculo com excesso', duracao: '10 min', status: 'pendente' },
  { id: 6, titulo: 'Avaliação do módulo', duracao: '10 q', status: 'avaliacao' },
];

const IconeTopico = ({ topico }) => {
  if (topico.status === 'concluido') {
    return (
      <View style={[styles.icone, styles.iconeConcluido]}>
        <Ionicons name="checkmark" size={18} color="#0A0D14" />
      </View>
    );
  }

  if (topico.status === 'atual') {
    return (
      <View style={[styles.icone, styles.iconeAtual]}>
        <Ionicons name="play" size={16} color="#0A0D14" style={{ marginLeft: 2 }} />
      </View>
    );
  }

  if (topico.status === 'avaliacao') {
    return (
      <View style={styles.icone}>
        <Ionicons name="star" size={22} color="#FF8A65" />
      </View>
    );
  }

  return (
    <View style={[styles.icone, styles.iconePendente]}>
      <Text style={styles.iconeNumero}>{topico.id}</Text>
    </View>
  );
};

const TopicoItem = ({ topico }) => {
  const atual = topico.status === 'atual';

  const router = useRouter();

  return (
    <TouchableOpacity
      style={[
        styles.topicoCard,
        topico.status === 'concluido' && styles.topicoConcluido,
        atual && styles.topicoAtual,
        topico.status === 'avaliacao' && styles.topicoAvaliacao,
      ]}
      activeOpacity={0.8}
      onPress={() => router.push({
              pathname: '/(private)/module/questao',
              params: { index: 0 },
            })}
    >
      <View style={styles.topicoLinha}>
        <IconeTopico topico={topico} />
        <View style={styles.topicoTextWrap}>
          <Text style={[styles.topicoTitulo, atual && styles.topicoTituloAtual]}>{topico.titulo}</Text>
        </View>
        <Text
          style={[
            styles.topicoDuracao,
            atual && styles.topicoDuracaoAtual,
            topico.status === 'avaliacao' && styles.topicoDuracaoAvaliacao,
          ]}
        >
          {topico.duracao}
        </Text>
      </View>

      {atual && topico.detalhe && <Text style={styles.topicoDetalhe}>{topico.detalhe}</Text>}
    </TouchableOpacity>
  );
};

export default function ModuloScreen() {
  const router = useRouter();
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
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Módulo {MODULO.numero}</Text>
        </View>

        <Text style={styles.title}>{MODULO.titulo}</Text>
        <Text style={styles.subtitle}>{MODULO.descricao}</Text>

        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{MODULO.totalTopicos} tópicos</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{MODULO.minutosRestantes} min restantes</Text>
          </View>
        </View>

        {/* Tópicos */}
        <View style={styles.topicosList}>
          {TOPICOS.map((topico) => (
            <TopicoItem key={topico.id} topico={topico} />
          ))}
        </View>
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          title="Continuar de onde parei"
          onPress={() =>
            router.push({
              pathname: '/(private)/module/questao',
              params: { index: 0 },
            })
          }
        />
      </View>
    </View>
  );
}