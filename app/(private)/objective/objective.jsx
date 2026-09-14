import React from 'react';

import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';

import { colors, styles, tint, gradients } from '../objective/objective_style';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react-native';


const AREAS = [
  { nome: 'Matemática', cor: colors.lavender, fundo: tint.lavender, linha: tint.lavenderLine },
  { nome: 'Linguagens', cor: colors.mint, fundo: tint.mint, linha: tint.mintLine },
  { nome: 'Natureza', cor: colors.coral, fundo: tint.coral, linha: tint.coralLine },
  { nome: 'Humanas', cor: colors.amber, fundo: tint.amber, linha: tint.amberLine },
  { nome: 'Redação', cor: colors.textSecondary, fundo: tint.neutral, linha: tint.neutralLine },
];

export const CURSO_EXEMPLO = {
  nome: 'Engenharia Civil',
  instituicao: 'UFPE',
  notaCorte: 712.4,
  anoNotaCorte: 2025,
};

const formatarNota = (nota) => nota.toFixed(1).replace('.', ',');

function IconeNotaCorte() {
  return (
    <View style={styles.notaIcone}>
      <View style={[styles.notaBarra, { height: 6 }]} />
      <View style={[styles.notaBarra, { height: 10 }]} />
      <View style={[styles.notaBarra, { height: 14 }]} />
    </View>
  );
}
export default function ObjetivoScreen({
  curso = CURSO_EXEMPLO,
  dataProva = '08/11/2026',
  passoAtual = 1,
  totalPassos = 3,
  onBack,
  onSelecionarCurso,
  onContinuar,
}) {
  const podeContinuar = Boolean(curso);

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.brilho} pointerEvents="none" />

        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ArrowLeft size={20} color={colors.lavender} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle}>Objetivo</Text>
          <Text style={styles.headerStep}>
            {passoAtual} / {totalPassos}
          </Text>
        </View>

        <View style={styles.stepper}>
          {Array.from({ length: totalPassos }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepperSegment,
                index < passoAtual && styles.stepperSegmentActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sua prova é o ENEM</Text>
          <Text style={styles.subtitle}>
            Trabalhamos com um edital só. Diga o curso que você quer e eu uso a
            nota de corte dele para calibrar o peso de cada área.
          </Text>

          <View style={styles.provaCard}>
            <View style={styles.provaTexto}>
              <Text style={styles.provaNome}>ENEM</Text>
              <Text style={styles.provaDescricao}>
                4 áreas + redação · prova em {dataProva}
              </Text>
            </View>
            <View style={styles.provaCheck}>
              <Check size={20} color={colors.onAccent} strokeWidth={3} />
            </View>
          </View>

          <View style={styles.areas}>
            {AREAS.map((area) => (
              <View
                key={area.nome}
                style={[
                  styles.areaChip,
                  { backgroundColor: area.fundo, borderColor: area.linha },
                ]}
              >
                <Text style={[styles.areaChipText, { color: area.cor }]}>
                  {area.nome}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>CURSO PRETENDIDO</Text>

          <Pressable
            onPress={onSelecionarCurso}
            accessibilityRole="button"
            accessibilityLabel={
              curso
                ? `Curso pretendido: ${curso.nome}, ${curso.instituicao}. Toque para trocar`
                : 'Escolher curso pretendido'
            }
            style={({ pressed }) => [
              styles.cursoRow,
              !curso && styles.cursoRowVazio,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.cursoNome}>
              {curso ? `${curso.nome} · ${curso.instituicao}` : 'Escolher curso'}
            </Text>
            <ChevronRight size={20} color={colors.textMuted} strokeWidth={2.5} />
          </Pressable>

          {curso ? (
            <View style={styles.notaCorteCard}>
              <View style={styles.notaCorteHeader}>
                <IconeNotaCorte />
                <Text style={styles.notaCorteLabel}>
                  NOTA DE CORTE {curso.anoNotaCorte}
                </Text>
              </View>
              <Text style={styles.notaCorteTexto}>
                {formatarNota(curso.notaCorte)} na ampla concorrência. Vou mirar
                nisso ao distribuir seu tempo.
              </Text>
            </View>
          ) : (
            <Text style={styles.notaCorteVazia}>
              Sem curso escolhido eu distribuo seu tempo igualmente entre as áreas.
            </Text>
          )}
        </ScrollView>

      <View style={styles.footer}>
  <View style={styles.continuarWrapper}>
    <View style={[styles.continuarGlow, !podeContinuar && styles.continuarGlowDisabled]} pointerEvents="none" />
    <Pressable
      onPress={onContinuar}
      disabled={!podeContinuar}
      accessibilityRole="button"
      accessibilityState={{ disabled: !podeContinuar }}
      style={({ pressed }) => [styles.continuarButton, pressed && podeContinuar && styles.pressed]}
    >
      {podeContinuar ? (
        <LinearGradient
          colors={gradients.continuar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <Text style={[styles.continuarText, !podeContinuar && styles.continuarTextDisabled]}>
        Continuar
      </Text>
      <View style={styles.continuarSeta}>
        <ArrowRight
          size={18}
          color={podeContinuar ? colors.onAccent : colors.textMuted}
          strokeWidth={2.5}
        />
      </View>
    </Pressable>
  </View>
</View>
      </SafeAreaView>
    </View>
  );
}
