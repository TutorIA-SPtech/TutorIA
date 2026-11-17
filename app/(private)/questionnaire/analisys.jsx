  import React, { useState, useEffect, useRef } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Easing,
    ScrollView
  } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import { Ionicons } from '@expo/vector-icons';
  import { useRouter } from 'expo-router';
  import Svg, { Circle } from 'react-native-svg';

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  import { styles } from '../../../styles/questionnaire/analisys';
  import StateMessage from '../../../components/StateMessage';
  import { diagnosticSession } from '../../../services/diagnosticSession';
  import { useDiagnosticSession } from '../../../hooks/useDiagnosticSession';

  const RESULTS_ROUTE = '/(private)/questionnaire/results';
  const HOLD_PROGRESS = 80; 

  const TaskItem = ({ text, isDone, isPending, spinRotation }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskIconContainer}>
        {isDone ? (
          <Ionicons name="checkmark-circle" size={24} color="#57DDA9" />
        ) : isPending ? (
          <Animated.View style={[styles.loadingDashedCircle, { transform: [{ rotate: spinRotation }] }]} />
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </View>
      <Text style={[styles.taskText, isDone && styles.taskTextDone]}>
        {text}
      </Text>
    </View>
  );

  export default function AnalysisScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { diagnostic, answeredCount } = useDiagnosticSession();

    const [currentProgress, setCurrentProgress] = useState(0);
    const [holdReached, setHoldReached] = useState(false);
    const [resultReady, setResultReady] = useState(false);
    // working | error | missing
    const [status, setStatus] = useState('working');

    const progressAnim = useRef(new Animated.Value(0)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;
    const activeRef = useRef(true);

    // Animação: sobe até 80% e espera o resultado de verdade.
    useEffect(() => {
      const spin = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spin.start();

      const timeline = Animated.sequence([
        Animated.delay(500),
        Animated.timing(progressAnim, { toValue: 10, duration: 1000, useNativeDriver: false }),
        Animated.delay(1200),
        Animated.timing(progressAnim, { toValue: 45, duration: 1500, useNativeDriver: false }),
        Animated.delay(1200),
        Animated.timing(progressAnim, { toValue: HOLD_PROGRESS, duration: 1500, useNativeDriver: false }),
      ]);
      timeline.start(({ finished }) => {
        if (finished) setHoldReached(true);
      });

      const listenerId = progressAnim.addListener(({ value }) => {
        setCurrentProgress(value);
      });

      return () => {
        spin.stop();
        timeline.stop();
        progressAnim.removeListener(listenerId);
      };
    }, []);

    const analyze = () => {
      if (!diagnosticSession.getState().diagnostic) {
        setStatus('missing');
        return;
      }
      setStatus('working');
      diagnosticSession
        .finish()
        .then(() => {
          if (activeRef.current) setResultReady(true);
        })
        .catch(() => {
          if (activeRef.current) setStatus('error');
        });
    };

    useEffect(() => {
      activeRef.current = true;
      analyze();
      return () => {
        activeRef.current = false;
      };
    }, []);

    useEffect(() => {
      if (!holdReached || !resultReady) return undefined;
      let timeoutId;
      const finish = Animated.timing(progressAnim, { toValue: 100, duration: 800, useNativeDriver: false });
      finish.start(({ finished }) => {
        if (finished) {
          timeoutId = setTimeout(() => router.replace(RESULTS_ROUTE), 600);
        }
      });
      return () => {
        finish.stop();
        clearTimeout(timeoutId);
      };
    }, [holdReached, resultReady]);

    const spinRotation = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const size = 160;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset = progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
    });

    if (status === 'missing') {
      return (
        <StateMessage
          title="Não encontramos seu diagnóstico"
          message="Volte e responda as questões para ver seu ponto de partida."
          primaryLabel="Voltar"
          onPrimary={() => router.back()}
        />
      );
    }

    if (status === 'error') {
      return (
        <StateMessage
          title="Não conseguimos analisar agora"
          message="A conexão falhou, mas suas respostas estão guardadas. Tente novamente."
          primaryLabel="Tentar novamente"
          onPrimary={analyze}
        />
      );
    }

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(28, 16, 80, 0.4)', 'transparent']}
          start={{ x: 1, y: 0 }} end={{ x: 0.2, y: 0.6 }}
          style={[StyleSheet.absoluteFill, { height: '60%' }]} pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(73, 23, 23, 0.5)', 'transparent']}
          start={{ x: 0, y: 1 }} end={{ x: 0.8, y: 0.4 }}
          style={[StyleSheet.absoluteFill, { top: '40%' }]} pointerEvents="none"
        />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topSection}>
            <View style={styles.progressContainer}>
              <Svg width={size} height={size}>
                <Circle
                  stroke="#202538"
                  cx={size / 2} cy={size / 2} r={radius}
                  strokeWidth={strokeWidth} fill="none"
                />
                <AnimatedCircle
                  stroke="#9FA8FF"
                  cx={size / 2} cy={size / 2} r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>

              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../../assets/tuti.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.textHeaderGroup}>
              <Text style={styles.mainTitle}>Analisando suas{'\n'}respostas</Text>
              <Text style={styles.subtitle}>
                {answeredCount} de {diagnostic?.totalQuestions ?? answeredCount} questões processadas
              </Text>
            </View>

            <View style={styles.taskList}>
              <TaskItem
                text="Domínio estimado por assunto"
                isDone={currentProgress >= 20}
                isPending={currentProgress < 20}
                spinRotation={spinRotation}
              />

              <TaskItem
                text="Pré-requisitos em falta"
                isDone={currentProgress >= 50}
                isPending={currentProgress >= 20 && currentProgress < 50}
                spinRotation={spinRotation}
              />

              <TaskItem
                text="Montando módulos do plano..."
                isDone={currentProgress >= 100}
                isPending={currentProgress >= 50 && currentProgress < 100}
                spinRotation={spinRotation}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Leva alguns segundos. Você pode fechar o app — eu aviso quando terminar.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
