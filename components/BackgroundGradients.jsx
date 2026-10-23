import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BackgroundGradients() {
  return (
    <>
      <LinearGradient 
        colors={['rgba(159, 169, 255, 0.46)', 'transparent']} 
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
    </>
  );
}