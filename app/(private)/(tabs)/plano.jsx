import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/tabs/plano';

// Dados de exemplo enquanto não há integração com a API
const PLANO = {
  titulo: 'Plano · ENEM 2026',
  progressoGeral: 34,
  previsao: 'No ritmo atual você conclui 6 dias antes da prova.',
};

const MODULOS_INICIAIS = [
  { id: 1, titulo: 'Módulo 1 · Razão e proporção', status: 'concluido', acerto: 92 },
  { id: 2, titulo: 'Módulo 2 · Estequiometria', status: 'andamento', topicosConcluidos: 3, totalTopicos: 7 },
  { id: 3, titulo: 'Módulo 3 · Termoquímica', status: 'proximo', libera: 2 },
  { id: 4, titulo: 'Módulo 4 · Cinética', status: 'bloqueado' },
  { id: 5, titulo: 'Módulo 5 · Equilíbrio', status: 'bloqueado' },
];

// Cor da linha que sai de cada módulo em direção ao próximo
const COR_LINHA = {
  concluido: '#57DDA9',
  andamento: '#9FA8FF',
  proximo: '#202538',
  bloqueado: '#202538',
};

const detalheDoModulo = (modulo) => {
  switch (modulo.status) {
    case 'concluido':
      return `Concluído · ${modulo.acerto}% de acerto`;
    case 'andamento':
      return `Em andamento · ${modulo.topicosConcluidos} de ${modulo.totalTopicos} tópicos`;
    case 'proximo':
      return `Libera ao concluir o módulo ${modulo.libera}`;
    default:
      return 'Bloqueado';
  }
};

const NoModulo = ({ modulo }) => {
  if (modulo.status === 'concluido') {
    return (
      <View style={[styles.node, styles.nodeConcluido]}>
        <Ionicons name="checkmark" size={16} color="#0A0D14" />
      </View>
    );
  }

  if (modulo.status === 'andamento') {
    return (
      <View style={[styles.node, styles.nodeAndamento]}>
        <Text style={styles.nodeNumeroDark}>{modulo.id}</Text>
      </View>
    );
  }

  if (modulo.status === 'proximo') {
    return (
      <View style={[styles.node, styles.nodeProximo]}>
        <Text style={styles.nodeNumeroLight}>{modulo.id}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.node, styles.nodeBloqueado]}>
      <Ionicons name="lock-closed-outline" size={12} color="#5C668A" />
    </View>
  );
};

const ModuloItem = ({ modulo, ultimo }) => {
  const router = useRouter();
  const ativo = modulo.status === 'andamento';
  const detalhe = detalheDoModulo(modulo);

  return (
    <View style={styles.moduloRow}>
      <View style={[styles.nodeColumn, ativo && styles.nodeColumnActive]}>
        <NoModulo modulo={modulo} />
        {!ultimo && <View style={[styles.linha, { backgroundColor: COR_LINHA[modulo.status] }]} />}
      </View>

      <View
        style={[
          styles.moduloContent,
          ultimo && styles.moduloContentUltimo,
          modulo.status === 'concluido' && styles.moduloConcluido,
          modulo.status === 'bloqueado' && styles.moduloBloqueado,
        ]}
      >
        {ativo ? (
          <TouchableOpacity
            style={styles.moduloAtivoCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(private)/module/modulo')}
          >
            <Text style={styles.moduloTitulo}>{modulo.titulo}</Text>
            <Text style={styles.moduloDetalhe}>{detalhe}</Text>
            <View style={styles.moduloAtivoBarra}>
              <AnimatedProgressBar
                targetPercentage={Math.round((modulo.topicosConcluidos / modulo.totalTopicos) * 100)}
                height={6}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.moduloTitulo}>{modulo.titulo}</Text>
            <Text style={styles.moduloDetalhe}>{detalhe}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default function PlanoScreen() {
  const insets = useSafeAreaInsets();
  const [modulos] = useState(MODULOS_INICIAIS);

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
          <Text style={styles.pageTitle}>{PLANO.titulo}</Text>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => console.log('Editar plano')}
          >
            <Text style={styles.editButtonText}>editar</Text>
          </TouchableOpacity>
        </View>

        {/* Progresso geral */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>PROGRESSO GERAL</Text>
            <Text style={styles.progressValue}>{PLANO.progressoGeral}%</Text>
          </View>
          <AnimatedProgressBar targetPercentage={PLANO.progressoGeral} height={6} />
          <Text style={styles.progressText}>{PLANO.previsao}</Text>
        </View>

        {/* Módulos */}
        <View>
          {modulos.map((modulo, index) => (
            <ModuloItem key={modulo.id} modulo={modulo} ultimo={index === modulos.length - 1} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}