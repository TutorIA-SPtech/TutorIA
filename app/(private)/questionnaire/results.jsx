import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { styles } from '../../../styles/questionnaire/results';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const mockBackendData = {
  overallScore: 59,
  areas: [
    { name: 'Matemática', score: 62, color: '#9FA8FF' },
    { name: 'Linguagens', score: 71, color: '#57DDA9' },
    { name: 'Ciências da natureza', score: 38, color: '#FF8A65' },
    { name: 'Humanas', score: 55, color: '#B39DFF' },
  ],
  priority: {
    subject: 'Química',
    reason: 'estequiometria trava 4 assuntos seguintes do seu edital.'
  }
};

const AnimatedCircleProgress = ({ score }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const listener = progressAnim.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });

    Animated.timing(progressAnim, {
      toValue: score,
      duration: 1200, 
      useNativeDriver: false,
    }).start();

    return () => progressAnim.removeListener(listener);
  }, [score]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle stroke="#202538" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" />
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
      <Text style={styles.circleScoreText}>{displayScore}%</Text>
    </View>
  );
};

const AnimatedProgressBar = ({ targetPercentage, color }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: targetPercentage,
      duration: 1200,
      useNativeDriver: false, 
    }).start();
  }, [targetPercentage]);

  const width = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, { backgroundColor: color, width }]} />
    </View>
  );
};


export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(28, 16, 80, 0.4)', 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0.2, y: 0.6 }} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <LinearGradient colors={['rgba(73, 23, 23, 0.5)', 'transparent']} start={{ x: 0, y: 1 }} end={{ x: 0.8, y: 0.4 }} style={StyleSheet.absoluteFill} pointerEvents="none" />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.pageTitle}>Seu ponto de partida</Text>

        <View style={styles.mainCard}>
          <AnimatedCircleProgress score={mockBackendData.overallScore} />
          <View style={styles.mainCardTextContainer}>
            <Text style={styles.mainCardTitle}>Domínio geral{'\n'}estimado</Text>
            <Text style={styles.mainCardSubtitle}>Baseado em 20 respostas · fica mais preciso a cada dia</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>POR ÁREA</Text>
          
          <View style={styles.areasList}>
            {mockBackendData.areas.map((area, index) => (
              <View key={index} style={styles.areaItem}>
                <View style={styles.areaHeader}>
                  <Text style={styles.areaName}>{area.name}</Text>
                  {/* Pinta o texto da % com a mesma cor da barra para fidelidade ao design */}
                  <Text style={[styles.areaScore, { color: area.color }]}>{area.score}%</Text>
                </View>
                <AnimatedProgressBar targetPercentage={area.score} color={area.color} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.priorityCard}>
          <View style={styles.priorityHeader}>
            <Ionicons name="warning" size={16} color="#FF8A65" />
            <Text style={styles.priorityLabel}>PRIORIDADE</Text>
          </View>
          <Text style={styles.priorityText}>
            <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>{mockBackendData.priority.subject}</Text>
            {' — '}{mockBackendData.priority.reason}
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={() => console.log('Ir para plano')}>
            <Text style={styles.primaryButtonText}>Ver meu plano</Text>
            <Ionicons name="arrow-forward" size={20} color="#0A0D14" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
