import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CadastroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} 
                  showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar conta</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#5C668A"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              style={[styles.input, styles.inputActive]}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#5C668A"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SENHA</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                placeholderTextColor="#5C668A"
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons 
                  name={mostrarSenha ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#5C668A" 
                />
              </TouchableOpacity>
            </View>

            {/* Barrinha de Força da Senha */}
            <View style={styles.strengthContainer}>
              <View style={[styles.strengthBar, styles.strengthBarActive]} />
              <View style={[styles.strengthBar, styles.strengthBarActive]} />
              <View style={styles.strengthBar} />
              <Text style={styles.strengthText}>boa</Text>
            </View>
          </View>
        </View>

        {/* Botão Principal */}
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={() => router.push('/onboarding')}>
          <Text style={styles.primaryButtonText}>Criar conta</Text>
          <Ionicons name="arrow-forward" size={20} color="#0A0D14" />
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={18} color="#A0AFFF" />
          <Text style={styles.googleButtonText}>Continuar com Google</Text>
        </TouchableOpacity>


        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.iconWrapper}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#57DDA9" />
            </View>
            <Text style={styles.infoTitle}>Seus dados, sua trilha</Text>
          </View>
          <Text style={styles.infoDescription}>
            Usamos seu desempenho apenas para montar seu plano. Dá para exportar ou apagar tudo em Ajustes.
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24, 
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131620', // Fundo mais escuro do botão
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputActive: {
    borderColor: '#8B94F7', // Borda roxa do e-mail da imagem
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#202538',
    borderRadius: 2,
  },
  strengthBarActive: {
    backgroundColor: '#57DDA9', // Verde água
  },
  strengthText: {
    color: '#57DDA9',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: '#A0AFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20, // Formato mais arredondado
  },
  primaryButtonText: {
    color: '#0A0D14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#202538',
  },
  dividerText: {
    color: '#5C668A',
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#202538',
    gap: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#131620',
    borderRadius: 24,
    padding: 20,
    marginTop: 40,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(87, 221, 169, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoDescription: {
    color: '#5C668A',
    fontSize: 14,
    lineHeight: 22,
  }
});