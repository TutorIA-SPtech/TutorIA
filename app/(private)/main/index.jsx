import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundGradients from '../../../components/BackgroundGradients';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { styles } from '../../../styles/main/index';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const mockData = {
  user: { initials: 'MS', name: 'Marina', exam: 'ENEM 2026', daysLeft: 75, streak: 12 },
  trail: {
    subject: 'Estequiometria',
    module: 'Módulo 2 · parte 1 de 3',
    time: '55 MIN',
    progress: 43,
    topics: 3,
    questions: 12,
  },
  domains: [
    { subject: 'Matemática', score: 64, trend: 'up', color: '#9FA8FF' },
    { subject: 'Ciências da natureza', score: 41, trend: 'down', color: '#FF8A65' },
    { subject: 'Humanas', score: 57, trend: 'up', color: '#B39DFF' },
  ],
  review: { subject: 'Funções', daysAgo: 9 }
};


const AnimatedCircleProgress = ({ score }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const listener = progressAnim.addListener(({ value }) => setDisplayScore(Math.round(value)));
    Animated.timing(progressAnim, { toValue: score, duration: 1200, useNativeDriver: false }).start();
    return () => progressAnim.removeListener(listener);
  }, [score]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.circleContainer}>
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

const AnimatedProgressBar = ({ score, color }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, { toValue: score, duration: 1200, useNativeDriver: false }).start();
  }, [score]);

  const width = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, { backgroundColor: color, width }]} />
    </View>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      
      <BackgroundGradients />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{mockData.user.initials}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Olá, {mockData.user.name}</Text>
              <Text style={styles.subGreeting}>{mockData.user.exam} · {mockData.user.daysLeft} dias</Text>
            </View>
          </View>
          
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#FFD166" />
            <Text style={styles.streakText}>{mockData.user.streak}</Text>
          </View>
        </View>

        {/* Card Principal: Trilha de Hoje */}
        <View style={styles.trailCard}>
          <View style={styles.trailHeaderRow}>
            <Text style={styles.trailLabel}>TRILHA DE HOJE</Text>
            <Text style={styles.trailTime}>{mockData.trail.time}</Text>
          </View>
          
          <View style={styles.trailContentRow}>
            <View style={styles.trailTextContent}>
              <Text style={styles.trailTitle}>{mockData.trail.subject}</Text>
              <Text style={styles.trailSubtitle}>{mockData.trail.module}</Text>
              
              <View style={styles.tagsRow}>
                <View style={styles.tag}><Text style={styles.tagText}>{mockData.trail.topics} tópicos</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>{mockData.trail.questions} questões</Text></View>
              </View>
            </View>
            <AnimatedCircleProgress score={mockData.trail.progress} />
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={20} color="#0A0D14" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>SEU DOMÍNIO</Text>
            <TouchableOpacity><Text style={styles.linkText}>ver tudo</Text></TouchableOpacity>
          </View>
          
          <View style={styles.domainsList}>
            {mockData.domains.map((domain, index) => (
              <View key={index} style={styles.domainItem}>
                <View style={styles.domainHeader}>
                  <Text style={styles.domainName}>{domain.subject}</Text>
                  <View style={styles.scoreRow}>
                    <Text style={[styles.domainScore, { color: domain.trend === 'up' ? '#57DDA9' : '#FF8A65' }]}>
                      {domain.score}%
                    </Text>
                    <Ionicons 
                      name={domain.trend === 'up' ? "arrow-up" : "arrow-down"} 
                      size={14} 
                      color={domain.trend === 'up' ? '#57DDA9' : '#FF8A65'} 
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
                <AnimatedProgressBar score={domain.score} color={domain.color} />
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.reviewCard} activeOpacity={0.8}>
          <View style={styles.reviewIconWrapper}>
            <Ionicons name="time-outline" size={20} color="#FF8A65" />
          </View>
          <View style={styles.reviewTextContent}>
            <Text style={styles.reviewTitle}>Revisar antes de esquecer</Text>
            <Text style={styles.reviewSubtitle}>{mockData.review.subject} · há {mockData.review.daysAgo} dias</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FF8A65" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
