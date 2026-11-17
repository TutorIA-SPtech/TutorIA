import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "../../../styles/questionnaire/questionnaire";
import StateMessage from "../../../components/StateMessage";
import { diagnosticSession } from "../../../services/diagnosticSession";
import { useDiagnosticSession } from "../../../hooks/useDiagnosticSession";
import { formatQuestionCategory } from "../../../utils/diagnosticResult";

const ANALYSIS_ROUTE = "/(private)/questionnaire/analisys";
const TIME_LIMIT_SECONDS = 720;

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// O relógio re-renderiza só este componente (antes, a tela inteira a cada segundo). Calcula pelo horário de
// início, então continua certo mesmo se a tela trocar para o estado de erro e voltar.
const Timer = memo(function Timer({ startedAt }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsed = Math.floor((now - startedAt) / 1000);
  return (
    <View style={styles.timerBadge}>
      <Text style={styles.timerText}>
        {formatTime(Math.max(0, TIME_LIMIT_SECONDS - elapsed))}
      </Text>
    </View>
  );
});

export default function Questionnaire() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { diagnostic } = useDiagnosticSession();

  // loading: primeira carga | ready: aguardando resposta | busy: enviando/buscando a próxima | error
  const [phase, setPhase] = useState("loading");
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const startedAtRef = useRef(Date.now());
  const shownAtRef = useRef(Date.now());
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);

  const totalQuestions = diagnostic?.totalQuestions ?? 20;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Envia o que estiver na fila, busca a próxima questão e mostra. Sem questão = diagnóstico completo.
  const showNextQuestion = useCallback(async () => {
    const next = await diagnosticSession.loadNextQuestion();
    if (!mountedRef.current) return;
    if (!next) {
      router.replace(ANALYSIS_ROUTE);
      return;
    }
    setQuestion(next);
    setQuestionNumber(diagnosticSession.getState().answeredCount + 1);
    setSelectedOptionId(null);
    shownAtRef.current = Date.now();
    setPhase("ready");
  }, [router]);

  // start() é idempotente: inicia o diagnóstico ou retoma o que já estava em andamento.
  const begin = useCallback(async () => {
    try {
      await diagnosticSession.start();
      await showNextQuestion();
    } catch {
      if (mountedRef.current) setPhase("error");
    }
  }, [showNextQuestion]);

  useEffect(() => {
    begin();
  }, [begin]);

  const retry = () => {
    setPhase(question ? "busy" : "loading");
    begin();
  };

  // "Não sei responder" (skipped) é uma resposta válida: segue para o back com selectedOptionId = null.
  const submit = async (skipped) => {
    if (phase !== "ready" || !question || submittingRef.current) return;
    if (!skipped && selectedOptionId === null) return;

    submittingRef.current = true;
    setPhase("busy");
    diagnosticSession.recordAnswer(
      question,
      skipped ? null : selectedOptionId,
      Math.max(1, Date.now() - shownAtRef.current),
    );
    try {
      await showNextQuestion();
    } catch {
      // A resposta continua na fila: "Tentar novamente" reenvia sem perder nada.
      if (mountedRef.current) setPhase("error");
    } finally {
      submittingRef.current = false;
    }
  };

  if (phase === "loading" && !question) {
    return <StateMessage loading message="Preparando seu diagnóstico..." />;
  }

  if (phase === "error") {
    return (
      <StateMessage
        title="Não conseguimos continuar"
        message="A conexão falhou, mas suas respostas estão guardadas. Tente novamente."
        primaryLabel="Tentar novamente"
        onPrimary={retry}
        secondaryLabel="Sair"
        onSecondary={() => router.back()}
      />
    );
  }

  const isReady = phase === "ready";
  const canConfirm = isReady && selectedOptionId !== null;
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(28, 16, 80, 0.4)", "transparent"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.6 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["rgba(73, 23, 23, 0.5)", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.8, y: 0.4 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color="#8A91A6" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Questão {questionNumber} / {totalQuestions}
            </Text>

            <Timer startedAt={startedAtRef.current} />
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {formatQuestionCategory(question)}
            </Text>
          </View>

          <Text style={styles.questionText}>{question.statement}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  activeOpacity={0.7}
                  disabled={!isReady}
                  onPress={() => setSelectedOptionId(option.id)}
                >
                  <View
                    style={[
                      styles.optionLetterCircle,
                      isSelected && styles.optionLetterCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLetterText,
                        isSelected && styles.optionLetterTextSelected,
                      ]}
                    >
                      {option.letter}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !canConfirm && styles.primaryButtonDisabled,
            ]}
            disabled={!canConfirm}
            activeOpacity={0.8}
            onPress={() => submit(false)}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !canConfirm && styles.primaryButtonTextDisabled,
              ]}
            >
              Confirmar resposta
            </Text>
            {phase === "busy" ? (
              <ActivityIndicator size="small" color="#5C668A" />
            ) : (
              <Ionicons
                name="arrow-forward"
                size={20}
                color={canConfirm ? "#0A0D14" : "#5C668A"}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.6}
            disabled={!isReady}
            onPress={() => submit(true)}
          >
            <Text style={styles.secondaryButtonText}>Não sei responder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
