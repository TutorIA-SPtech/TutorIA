import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function AnimatedProgressBar({ targetPercentage, color = '#9FA8FF', height = 8 }) {
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
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.barTrack, { height }]}>
      <Animated.View style={[styles.barFill, { backgroundColor: color, width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  barTrack: {
    backgroundColor: '#202538',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});