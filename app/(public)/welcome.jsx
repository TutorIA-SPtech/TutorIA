import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importação do ícone adicionada

export default function IntroductionScreen(){
    // Instância obrigatória do hook para o router.push funcionar
    const router = useRouter(); 

    return (
        <View style={styles.container}>
            {/* Gradientes */}
            <LinearGradient
                colors={['rgba(28, 16, 80, 0.4)', 'transparent']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0.2, y: 0.6 }}
                style={[StyleSheet.absoluteFill, styles.topRightGradient]}
                pointerEvents="none" 
            />
            <LinearGradient
                colors={['rgba(73, 23, 23, 0.5)', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0.4 }}
                style={[StyleSheet.absoluteFill, styles.bottomLeftGradient]}
                pointerEvents="none"
            />

            {/* Conteúdo Central */}
            <View style={styles.content}>
                <Image source={require('../../assets/tuti.png')} style={{width: 100, height: 130}}/>
                <Text style={styles.title}>TutorIA</Text>
                <Text style={styles.subtitle}>A trilha que se ajusta ao que você já sabe.</Text>
            </View>

            {/* Rodapé com Botão */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={() => router.push('/intro')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextButtonText}>Avançar</Text>
                    <Ionicons name="arrow-forward" size={20} color="#0A0D14" />
                </TouchableOpacity>
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
  },
  // Novos estilos para o rodapé e botão
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50, // Mantém o botão afastado do limite inferior da tela
    alignItems: 'flex-end', // Alinha o botão à esquerda, acompanhando o texto
    zIndex: 1,
  },
  nextButton: {
    backgroundColor: '#9FA8FF', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30, // Cria o formato de pílula
    gap: 8, // Espaço entre o texto e a seta
    marginBottom: 10, // Espaço inferior para evitar que o botão fique muito próximo da borda
  },
  nextButtonText: {
    color: '#0A0D14',
    fontSize: 16,
    fontWeight: 'bold',
  }
})