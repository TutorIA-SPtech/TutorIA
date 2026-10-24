import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/tabs/plano';

const PLANO_DADOS = {
  titulo: 'Plano · ENEM 2026',
  previsao: 'No ritmo atual você conclui 6 dias antes da prova.',
};

// Adicionado totalTopicos e topicosConcluidos em todos para a matemática do Progresso Geral funcionar
const MODULOS_INICIAIS = [
  { id: 1, titulo: 'Módulo 1 · Razão e proporção', status: 'concluido', acerto: 92, topicosConcluidos: 5, totalTopicos: 5 },
  { id: 2, titulo: 'Módulo 2 · Estequiometria', status: 'andamento', topicosConcluidos: 3, totalTopicos: 7 },
  { id: 3, titulo: 'Módulo 3 · Termoquímica', status: 'proximo', topicosConcluidos: 0, totalTopicos: 4, libera: 2 },
  { id: 4, titulo: 'Módulo 4 · Cinética', status: 'bloqueado', topicosConcluidos: 0, totalTopicos: 6 },
  { id: 5, titulo: 'Módulo 5 · Equilíbrio', status: 'bloqueado', topicosConcluidos: 0, totalTopicos: 5 },
];

const COR_LINHA = { concluido: '#57DDA9', andamento: '#9FA8FF', proximo: '#202538', bloqueado: '#202538' };

const detalheDoModulo = (modulo) => {
  switch (modulo.status) {
    case 'concluido': return `Concluído · ${modulo.acerto}% de acerto`;
    case 'andamento': return `Em andamento · ${modulo.topicosConcluidos} de ${modulo.totalTopicos} tópicos`;
    case 'proximo': return `Libera ao concluir o módulo ${modulo.libera}`;
    default: return 'Bloqueado';
  }
};

const NoModulo = ({ modulo }) => {
  if (modulo.status === 'concluido') {
    return <View style={[styles.node, styles.nodeConcluido]}><Ionicons name="checkmark" size={16} color="#0A0D14" /></View>;
  }
  if (modulo.status === 'andamento') {
    return <View style={[styles.node, styles.nodeAndamento]}><Text style={styles.nodeNumeroDark}>{modulo.id}</Text></View>;
  }
  if (modulo.status === 'proximo') {
    return <View style={[styles.node, styles.nodeProximo]}><Text style={styles.nodeNumeroLight}>{modulo.id}</Text></View>;
  }
  return <View style={[styles.node, styles.nodeBloqueado]}><Ionicons name="lock-closed-outline" size={12} color="#5C668A" /></View>;
};

// Atualizado para receber a função de clique
const ModuloItem = ({ modulo, ultimo, onCompletar }) => {
  const ativo = modulo.status === 'andamento';
  const detalhe = detalheDoModulo(modulo);

  return (
    <View style={styles.moduloRow}>
      {/* Transformado em Checkbox interativo */}
      <TouchableOpacity 
        style={[styles.nodeColumn, ativo && styles.nodeColumnActive]} 
        activeOpacity={0.7}
        onPress={onCompletar}
        disabled={modulo.status !== 'andamento'}
      >
        <NoModulo modulo={modulo} />
        {!ultimo && <View style={[styles.linha, { backgroundColor: COR_LINHA[modulo.status] }]} />}
      </TouchableOpacity>

      <View style={[styles.moduloContent, ultimo && styles.moduloContentUltimo, modulo.status === 'concluido' && styles.moduloConcluido, modulo.status === 'bloqueado' && styles.moduloBloqueado]}>
        {ativo ? (
          <View style={styles.moduloAtivoCard}>
            <Text style={styles.moduloTitulo}>{modulo.titulo}</Text>
            <Text style={styles.moduloDetalhe}>{detalhe}</Text>
            <View style={styles.moduloAtivoBarra}>
              <AnimatedProgressBar targetPercentage={Math.round((modulo.topicosConcluidos / modulo.totalTopicos) * 100)} height={6} />
            </View>
          </View>
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
  
  // Estado dinâmico dos módulos
  const [modulos, setModulos] = useState(MODULOS_INICIAIS);

  // Cálculo matemático do progresso geral (Substitui o valor fixo)
  const progressoGeral = useMemo(() => {
    const total = modulos.reduce((acc, mod) => acc + mod.totalTopicos, 0);
    const concluidos = modulos.reduce((acc, mod) => acc + mod.topicosConcluidos, 0);
    return total > 0 ? Math.round((concluidos / total) * 100) : 0;
  }, [modulos]);

  // Regra de Negócio: Avanço na Fila
  const handleCompletarModulo = (index) => {
    const novosModulos = [...modulos];
    
    // 1. Atualiza o módulo clicado
    novosModulos[index].status = 'concluido';
    novosModulos[index].topicosConcluidos = novosModulos[index].totalTopicos;
    novosModulos[index].acerto = Math.floor(Math.random() * (100 - 75 + 1)) + 75; // Simula uma nota
    
    // 2. Transforma o próximo em ativo
    if (index + 1 < novosModulos.length) {
      novosModulos[index + 1].status = 'andamento';
    }
    
    // 3. Libera a visualização ("claridade") do módulo seguinte
    if (index + 2 < novosModulos.length) {
      novosModulos[index + 2].status = 'proximo';
      novosModulos[index + 2].libera = novosModulos[index + 1].id;
    }

    setModulos(novosModulos);
  };

  return (
    <View style={styles.container}>
      <DotGridBackground />
      <LinearGradient colors={['rgba(28, 16, 80, 0.4)', 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0.2, y: 0.6 }} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <LinearGradient colors={['rgba(73, 23, 23, 0.5)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0.8, y: 0.4 }} style={StyleSheet.absoluteFill} pointerEvents="none" />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: 24 }]} showsVerticalScrollIndicator={false} bounces={false}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{PLANO_DADOS.titulo}</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}><Text style={styles.editButtonText}>editar</Text></TouchableOpacity>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>PROGRESSO GERAL</Text>
            <Text style={styles.progressValue}>{progressoGeral}%</Text>
          </View>
          {/* Progresso amarrado ao cálculo dinâmico */}
          <AnimatedProgressBar targetPercentage={progressoGeral} height={6} />
          <Text style={styles.progressText}>{PLANO_DADOS.previsao}</Text>
        </View>

        <View>
          {modulos.map((modulo, index) => (
            <ModuloItem 
              key={modulo.id} 
              modulo={modulo} 
              ultimo={index === modulos.length - 1} 
              onCompletar={() => handleCompletarModulo(index)} // Função repassada para o "Checkbox"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}