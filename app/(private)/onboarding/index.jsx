import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, styles, tint, gradients } from "../../../styles/onboarding";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  X,
} from "lucide-react-native";

import { useFocusEffect, useRouter } from "expo-router";
import { useLogout } from "../../../hooks/useLogout";
import { ApiError } from "../../../services/apiClient";
import {
  getCourseCutoffStatistics,
  getCourseDegrees,
  getCoursesByDegree,
} from "../../../services/courseApi";

const AREAS = [
  {
    nome: "Matemática",
    cor: colors.lavender,
    fundo: tint.lavender,
    linha: tint.lavenderLine,
  },
  {
    nome: "Linguagens",
    cor: colors.mint,
    fundo: tint.mint,
    linha: tint.mintLine,
  },
  {
    nome: "Natureza",
    cor: colors.coral,
    fundo: tint.coral,
    linha: tint.coralLine,
  },
  {
    nome: "Humanas",
    cor: colors.amber,
    fundo: tint.amber,
    linha: tint.amberLine,
  },
  {
    nome: "Redação",
    cor: colors.textSecondary,
    fundo: tint.neutral,
    linha: tint.neutralLine,
  },
];

const formatarNota = (nota) => Number(nota).toFixed(1).replace(".", ",");
const formatarGrau = (grau) => {
  const normalizado = grau.toLocaleLowerCase("pt-BR");
  return normalizado.charAt(0).toLocaleUpperCase("pt-BR") + normalizado.slice(1);
};

function IconeNotaCorte() {
  return (
    <View style={styles.notaIcone}>
      <View style={[styles.notaBarra, { height: 6 }]} />
      <View style={[styles.notaBarra, { height: 10 }]} />
      <View style={[styles.notaBarra, { height: 14 }]} />
    </View>
  );
}
export default function ObjetivoScreen() {
  const passoAtual = 1;
  const totalPassos = 3;
  const [graus, setGraus] = useState([]);
  const [grauSelecionado, setGrauSelecionado] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [estatisticas, setEstatisticas] = useState(null);
  const [seletorAberto, setSeletorAberto] = useState(null);
  const [busca, setBusca] = useState("");
  const [carregandoGraus, setCarregandoGraus] = useState(true);
  const [carregandoCursos, setCarregandoCursos] = useState(false);
  const [carregandoEstatisticas, setCarregandoEstatisticas] = useState(false);
  const [erroGraus, setErroGraus] = useState("");
  const [erroCursos, setErroCursos] = useState("");
  const [erroEstatisticas, setErroEstatisticas] = useState("");
  const [tentativaGraus, setTentativaGraus] = useState(0);
  const [tentativaCursos, setTentativaCursos] = useState(0);
  const [tentativaEstatisticas, setTentativaEstatisticas] = useState(0);
  const podeContinuar = Boolean(cursoSelecionado);
  const router = useRouter();
  const { confirmarSaida } = useLogout();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    let ativo = true;
    setCarregandoGraus(true);
    setErroGraus("");

    getCourseDegrees()
      .then((resultado) => {
        if (ativo) setGraus(resultado);
      })
      .catch((error) => {
        if (ativo) {
          setErroGraus(error instanceof ApiError
            ? error.message
            : "Não foi possível carregar os tipos de curso.");
        }
      })
      .finally(() => {
        if (ativo) setCarregandoGraus(false);
      });

    return () => {
      ativo = false;
    };
  }, [tentativaGraus]);

  useEffect(() => {
    if (!grauSelecionado) {
      setCursos([]);
      setCarregandoCursos(false);
      setErroCursos("");
      return undefined;
    }

    let ativo = true;
    setCursos([]);
    setCarregandoCursos(true);
    setErroCursos("");

    getCoursesByDegree(grauSelecionado)
      .then((resultado) => {
        if (ativo) setCursos(resultado);
      })
      .catch((error) => {
        if (ativo) {
          setErroCursos(error instanceof ApiError
            ? error.message
            : "Não foi possível carregar os cursos.");
        }
      })
      .finally(() => {
        if (ativo) setCarregandoCursos(false);
      });

    return () => {
      ativo = false;
    };
  }, [grauSelecionado, tentativaCursos]);

  useEffect(() => {
    if (!cursoSelecionado || !grauSelecionado) {
      setEstatisticas(null);
      setCarregandoEstatisticas(false);
      setErroEstatisticas("");
      return undefined;
    }

    let ativo = true;
    setEstatisticas(null);
    setCarregandoEstatisticas(true);
    setErroEstatisticas("");

    getCourseCutoffStatistics(cursoSelecionado, grauSelecionado)
      .then((resultado) => {
        if (ativo) setEstatisticas(resultado);
      })
      .catch((error) => {
        if (ativo) {
          setErroEstatisticas(error instanceof ApiError
            ? error.message
            : "Não foi possível carregar as notas de corte.");
        }
      })
      .finally(() => {
        if (ativo) setCarregandoEstatisticas(false);
      });

    return () => {
      ativo = false;
    };
  }, [cursoSelecionado, grauSelecionado, tentativaEstatisticas]);

  // Primeira tela privada: o que está antes na pilha é público (login/boas-vindas),
  // então voltar daqui significa sair da conta.
  function voltar() {
    confirmarSaida();
  }

  useFocusEffect(
    useCallback(() => {
      const assinatura = BackHandler.addEventListener("hardwareBackPress", () => {
        confirmarSaida();
        return true;
      });
      return () => assinatura.remove();
    }, [confirmarSaida])
  );

  const abrirSeletor = (tipo) => {
    setBusca("");
    setSeletorAberto(tipo);
  };

  const selecionarOpcao = (opcao) => {
    if (seletorAberto === "grau") {
      setGrauSelecionado(opcao.value);
      setCursoSelecionado("");
      setEstatisticas(null);
    } else {
      setCursoSelecionado(opcao.value);
    }
    setSeletorAberto(null);
  };

  const opcoesSeletor = seletorAberto === "grau"
    ? graus.map((grau) => ({ label: formatarGrau(grau), value: grau }))
    : cursos.map((curso) => ({ label: curso.name, value: curso.name }));
  const opcoesFiltradas = seletorAberto === "curso" && busca.trim()
    ? opcoesSeletor.filter((opcao) => opcao.label.toLocaleLowerCase("pt-BR")
      .includes(busca.trim().toLocaleLowerCase("pt-BR")))
    : opcoesSeletor;

  const continuar = () => {
    if (!cursoSelecionado) return;
    router.push({
      pathname: "/onboarding/rotina",
      params: { targetCourseName: cursoSelecionado },
    });
  };

  return (
    <View style={styles.background}>
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* <StatusBar style="light" /> */}

        <View style={styles.brilho} pointerEvents="none" />

        <View style={styles.header}>
          <Pressable
            onPress={voltar}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
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
                    4 áreas + redação · prova em 08/11/2026
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

          <View style={styles.seletorGrupo}>
            <Text style={styles.seletorLabel}>TIPO DE CURSO</Text>
            <Pressable
              onPress={() => abrirSeletor("grau")}
              disabled={carregandoGraus || graus.length === 0}
              accessibilityRole="button"
              accessibilityState={{ disabled: carregandoGraus || graus.length === 0 }}
              style={({ pressed }) => [
                styles.cursoRow,
                (carregandoGraus || graus.length === 0) && styles.seletorDesabilitado,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[
                styles.cursoNome,
                !grauSelecionado && styles.seletorPlaceholder,
              ]}>
                {grauSelecionado ? formatarGrau(grauSelecionado) : "Escolher tipo de curso"}
              </Text>
              {carregandoGraus
                ? <ActivityIndicator size="small" color={colors.lavender} />
                : <ChevronDown size={18} color={colors.textMuted} />}
            </Pressable>
            {erroGraus ? (
              <View style={styles.erroSeletor}>
                <Text style={styles.textoErroSeletor}>{erroGraus}</Text>
                <Pressable onPress={() => setTentativaGraus((tentativa) => tentativa + 1)}>
                  <Text style={styles.textoTentarNovamente}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : null}
            {!carregandoGraus && !erroGraus && graus.length === 0 ? (
              <Text style={styles.seletorAjuda}>Nenhum tipo de curso disponível.</Text>
            ) : null}
          </View>

          <View style={styles.seletorGrupo}>
            <Text style={styles.seletorLabel}>CURSO</Text>
            <Pressable
              onPress={() => abrirSeletor("curso")}
              disabled={!grauSelecionado || carregandoCursos || cursos.length === 0}
              accessibilityRole="button"
              accessibilityState={{
                disabled: !grauSelecionado || carregandoCursos || cursos.length === 0,
              }}
              style={({ pressed }) => [
                styles.cursoRow,
                (!grauSelecionado || carregandoCursos || cursos.length === 0)
                  && styles.seletorDesabilitado,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[
                styles.cursoNome,
                !cursoSelecionado && styles.seletorPlaceholder,
              ]}>
                {cursoSelecionado || (grauSelecionado ? "Escolher curso" : "Selecione o tipo primeiro")}
              </Text>
              {carregandoCursos
                ? <ActivityIndicator size="small" color={colors.lavender} />
                : <ChevronDown size={18} color={colors.textMuted} />}
            </Pressable>
            {erroCursos ? (
              <View style={styles.erroSeletor}>
                <Text style={styles.textoErroSeletor}>{erroCursos}</Text>
                <Pressable onPress={() => setTentativaCursos((tentativa) => tentativa + 1)}>
                  <Text style={styles.textoTentarNovamente}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : null}
            {grauSelecionado && !carregandoCursos && !erroCursos && cursos.length === 0 ? (
              <Text style={styles.seletorAjuda}>Nenhum curso disponível para esse tipo.</Text>
            ) : null}
          </View>

          <View style={styles.notaCorteCard}>
            <View style={styles.notaCorteHeader}>
              <IconeNotaCorte />
              <Text style={styles.notaCorteLabel}>NOTA DE CORTE 2025</Text>
            </View>
            {!cursoSelecionado ? (
              <Text style={styles.notaCorteVazia}>
                Escolha um curso para consultar a nota de corte de referência.
              </Text>
            ) : carregandoEstatisticas ? (
              <View style={styles.carregandoEstatisticas}>
                <ActivityIndicator size="small" color={colors.amber} />
                <Text style={styles.seletorAjuda}>Calculando estatísticas...</Text>
              </View>
            ) : erroEstatisticas ? (
              <View style={styles.erroEstatisticas}>
                <Text style={styles.textoErroSeletor}>{erroEstatisticas}</Text>
                <Pressable onPress={() => setTentativaEstatisticas((tentativa) => tentativa + 1)}>
                  <Text style={styles.textoTentarNovamente}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : estatisticas?.sampleSize > 0 ? (
              <Text style={styles.notaCorteTexto}>
                Mediana: {formatarNota(estatisticas.medianScore)} na ampla
                concorrência. Vou mirar nisso ao distribuir seu tempo.
              </Text>
            ) : (
              <Text style={styles.notaCorteVazia}>
                Ainda não há notas de ampla concorrência de 2025 para este curso.
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.continuarWrapper}>
            <View
              style={[
                styles.continuarGlow,
                !podeContinuar && styles.continuarGlowDisabled,
              ]}
              pointerEvents="none"
            />
            <Pressable
              onPress={continuar}
              disabled={!podeContinuar}
              accessibilityRole="button"
              accessibilityState={{ disabled: !podeContinuar }}
              style={({ pressed }) => [
                styles.continuarButton,
                !podeContinuar && styles.continuarButtonDisabled,
                pressed && podeContinuar && styles.pressed,
              ]}
            >
              {podeContinuar ? (
                <LinearGradient
                  colors={gradients.continuar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Text
                style={[
                  styles.continuarText,
                  !podeContinuar && styles.continuarTextDisabled,
                ]}
              >
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

          {/* Provisório até existir a tela de Perfil, que deve usar o mesmo useLogout. */}
          <Pressable
            onPress={confirmarSaida}
            hitSlop={8}
            accessibilityRole="button"
            style={({ pressed }) => [styles.sairLink, pressed && styles.pressed]}
          >
            <Text style={styles.sairTexto}>Sair da conta</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        visible={Boolean(seletorAberto)}
        transparent
        animationType="fade"
        onRequestClose={() => setSeletorAberto(null)}
      >
        <View style={styles.modalFundo}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSeletorAberto(null)}
            accessibilityRole="button"
            accessibilityLabel="Fechar seletor"
          />
          <View style={styles.modalCartao}>
            <View style={styles.modalCabecalho}>
              <Text style={styles.modalTitulo}>
                {seletorAberto === "grau" ? "Tipo de curso" : "Escolha um curso"}
              </Text>
              <Pressable
                onPress={() => setSeletorAberto(null)}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                hitSlop={8}
              >
                <X size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
            {seletorAberto === "curso" ? (
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar curso"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Buscar curso"
                style={styles.modalBusca}
              />
            ) : null}
            <FlatList
              data={opcoesFiltradas}
              keyExtractor={(opcao, index) => `${opcao.value}-${index}`}
              keyboardShouldPersistTaps="handled"
              style={styles.modalLista}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selecionarOpcao(item)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.modalOpcao,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.modalOpcaoTexto}>{item.label}</Text>
                  {((seletorAberto === "grau" && item.value === grauSelecionado)
                    || (seletorAberto === "curso" && item.value === cursoSelecionado)) ? (
                    <Check size={18} color={colors.lavender} />
                  ) : null}
                </Pressable>
              )}
              ListEmptyComponent={(
                <Text style={styles.modalSemOpcoes}>
                  {busca.trim() ? "Nenhum curso corresponde à busca." : "Nenhuma opção disponível."}
                </Text>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
