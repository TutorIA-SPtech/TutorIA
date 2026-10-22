import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedCircleProgress({
  score,
  size = 80,
  strokeWidth = 8,
  fontSize = 18,
  color = '#9FA8FF',
  trackColor = '#202538',
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

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
        <Circle
          stroke={trackColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          stroke={color}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={[styles.scoreText, { fontSize }]}>{displayScore}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});