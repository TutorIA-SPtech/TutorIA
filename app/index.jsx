import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function IntroductionScreen(){
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(60, 70, 110, 0.4)', 'transparent']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0.2, y: 0.6 }}
                style={[StyleSheet.absoluteFill, styles.topRightGradient]}
                pointerEvents="none" 
            />

            <LinearGradient
                colors={['rgba(70, 45, 45, 0.5)', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0.4 }}
                style={[StyleSheet.absoluteFill, styles.bottomLeftGradient]}
                pointerEvents="none"
            />

            
            <View style={styles.content}>
            <Image source={require('../assets/tuti.png')} style={{width: 100, height: 130}}/>
                <Text style={styles.title}>TutorIA</Text>
                <Text style={styles.subtitle}>A trilha que se ajusta ao que você já sabe.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  topRightGradient: {
    height: '60%', 
  },
  bottomLeftGradient: {
    top: '40%', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', 
    zIndex: 1,
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 50,
    fontWeight: 'bold',
  },
  subtitle: {
    width: '80%',
    paddingTop: 10,
    color: '#7f82b3',
    fontSize: 16,
    textAlign: 'left',
  }
})