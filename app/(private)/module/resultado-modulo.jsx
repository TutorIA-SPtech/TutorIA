import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/module/resultado-modulo';

// Dados de exemplo enquanto não há integração com a API
const RESULTADO = {
  modulo: 2,
  notaMinima: 6,
  assuntos: [
    { nome: 'Mol e massa molar', acertos: 3, total: 3 },
    { nome: 'Balanceamento', acertos: 3, total: 4 },
    { nome: 'Reagente limitante', acertos: 1, total: 3 },
  ],
  recado: 'Vou reforçar reagente limitante nos próximos dias antes de liberar termoquímica.',
};

const COR_ACERTO = '#57DDA9';
const COR_ERRO = '#FF8A65';

// Assunto com 70% ou mais de acerto é considerado dominado
const corDoAssunto = (assunto) =>
  assunto.acertos / assunto.total >= 0.7 ? COR_ACERTO : COR_ERRO;

export default function ResultadoModuloScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Valores derivados dos assuntos
  const nota = RESULTADO.assuntos.reduce((soma, a) => soma + a.acertos, 0);
  const total = RESULTADO.assuntos.reduce((soma, a) => soma + a.total, 0);
  const erradas = total - nota;
  const aprovado = nota >= RESULTADO.notaMinima;
  const corStatus = aprovado ? COR_ACERTO : COR_ERRO;

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
        <Text style={styles.headerTitle}>Resultado do módulo {RESULTADO.modulo}</Text>

        {/* Nota */}
        <View
          style={[
            styles.notaCard,
            {
              backgroundColor: aprovado ? 'rgba(87, 221, 169, 0.08)' : 'rgba(255, 138, 101, 0.08)',
              borderColor: aprovado ? 'rgba(87, 221, 169, 0.3)' : 'rgba(255, 138, 101, 0.3)',
            },
          ]}
        >
          <View style={styles.notaTopRow}>
            <View style={styles.notaValorRow}>
              <Text style={styles.notaValor}>{nota}</Text>
              <Text style={styles.notaTotal}>/ {total}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: corStatus }]}>
              <Text style={styles.statusBadgeTexto}>{aprovado ? 'aprovado' : 'reprovado'}</Text>
            </View>
          </View>
          <Text style={styles.notaDescricao}>
            {aprovado ? 'Acima' : 'Abaixo'} do necessário para avançar ({RESULTADO.notaMinima}/{total})
          </Text>

          {aprovado && (
            <>
              <View style={[styles.confete, { top: 16, right: 62, width: 7, height: 7, backgroundColor: '#F0B95C' }]} />
              <View style={[styles.confete, { top: 12, right: 36, width: 5, height: 5, backgroundColor: '#9FA8FF' }]} />
              <View style={[styles.confete, { top: 30, right: 22, width: 6, height: 6, backgroundColor: '#4FD1E8' }]} />
            </>
          )}
        </View>

        {/* Acertos por assunto */}
        <Text style={styles.secaoLabel}>ACERTOS POR ASSUNTO</Text>
        <View style={styles.assuntosList}>
          {RESULTADO.assuntos.map((assunto) => {
            const cor = corDoAssunto(assunto);

            return (
              <View key={assunto.nome}>
                <View style={styles.assuntoHeader}>
                  <Text style={styles.assuntoNome}>{assunto.nome}</Text>
                  <Text style={[styles.assuntoPlacar, { color: cor }]}>
                    {assunto.acertos}/{assunto.total}
                  </Text>
                </View>
                <AnimatedProgressBar
                  targetPercentage={(assunto.acertos / assunto.total) * 100}
                  color={cor}
                  height={6}
                />
              </View>
            );
          })}
        </View>

        {/* Recado do Tuti */}
        <View style={styles.recadoCard}>
          <View style={styles.recadoIcone}>
            <Ionicons name="sad-outline" size={22} color={COR_ERRO} />
          </View>
          <Text style={styles.recadoTexto}>{RESULTADO.recado}</Text>
        </View>
      </ScrollView>

      {/* Botões fixos no rodapé */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          title="Ver plano atualizado"
          onPress={() => router.push('/(private)/module/plano-atualizado')}
        />
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => console.log('Revisar questões erradas')}
        >
          <Text style={styles.secondaryButtonTexto}>
            Revisar as {erradas} questões erradas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}