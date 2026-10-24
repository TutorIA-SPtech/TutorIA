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
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import { styles } from '../../../styles/questionnaire/analisys';

export default function AnalysisScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [currentProgress, setCurrentProgress] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.sequence([
      Animated.delay(500),
      Animated.timing(progressAnim, { toValue: 10, duration: 1000, useNativeDriver: false }),
      Animated.delay(1200),
      Animated.timing(progressAnim, { toValue: 45, duration: 1500, useNativeDriver: false }),
      Animated.delay(1200),
      Animated.timing(progressAnim, { toValue: 80, duration: 1500, useNativeDriver: false }),
      Animated.delay(1000),
      Animated.timing(progressAnim, { toValue: 100, duration: 1000, useNativeDriver: false }),
    ]).start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          console.log("Análise concluída, avançando...");
          router.push({
            pathname: '/(private)/questionnaire/results',
            params: { result },
          });
        }, 1000);
      }
    });

    const listenerId = progressAnim.addListener(({ value }) => {
      setCurrentProgress(value);
    });

    return () => {
      progressAnim.removeListener(listenerId);
    };
  }, []);

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

  const TaskItem = ({ text, isDone, isPending }) => (
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
            <Text style={styles.subtitle}>20 de 20 questões processadas</Text>
          </View>

          <View style={styles.taskList}>
            <TaskItem 
              text="Domínio estimado por assunto" 
              isDone={currentProgress >= 20} 
              isPending={currentProgress < 20} 
            />

            <TaskItem 
              text="Pré-requisitos em falta" 
              isDone={currentProgress >= 50} 
              isPending={currentProgress >= 20 && currentProgress < 50} 
            />
            
            <TaskItem 
              text="Montando módulos do plano..." 
              isDone={currentProgress >= 100} 
              isPending={currentProgress >= 50 && currentProgress < 100} 
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
