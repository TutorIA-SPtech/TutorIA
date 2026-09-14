import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../../components/Button';

export default function CadastroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nomeFocado, setNomeFocado] = useState(false);
  const [emailFocado, setEmailFocado] = useState(false);
  const [senhaFocada, setSenhaFocada] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(28, 16, 80, 0.4)', 'transparent']}
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} 
          showsVerticalScrollIndicator={false}
        >
          <View>
            {/* Cabeçalho de Navegação */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Criar conta</Text>
            </View>

            {/* Logo + Título (Novo padrão inspirado no Login) */}
            <View style={styles.headingRow}>
              <Image
                source={require('../../assets/tuti.png')}
                style={styles.robotIcon}
                resizeMode="contain"
              />
              <View style={styles.headingTextWrap}>
                <Text style={styles.title}>Inicie sua jornada</Text>
                <Text style={styles.subtitle}>Uma trilha de aprendizado que se adapta a você.</Text>
              </View>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NOME</Text>
                <TextInput
                  style={[styles.input, nomeFocado && styles.inputActive]}
                  value={nome}
                  onChangeText={setNome}
                  onFocus={() => setNomeFocado(true)}
                  onBlur={() => setNomeFocado(false)}
                  placeholderTextColor="#5C668A"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-MAIL</Text>
                <TextInput
                  style={[styles.input, emailFocado && styles.inputActive]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocado(true)}
                  onBlur={() => setEmailFocado(false)}
                  placeholderTextColor="#5C668A"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>SENHA</Text>
                <View style={[styles.passwordContainer, senhaFocada && styles.inputActive]}>
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!mostrarSenha}
                    value={senha}
                    onChangeText={setSenha}
                    onFocus={() => setSenhaFocada(true)}
                    onBlur={() => setSenhaFocada(false)}
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

            {/* Botão Principal Componentizado */}
            <PrimaryButton title="Criar conta" onPress={() => router.push('/onboarding')} />

            {/* Divisor */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botão Google */}
            <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
              <Ionicons name="logo-google" size={18} color="#A0AFFF" />
              <Text style={styles.googleButtonText}>Continuar com Google</Text>
            </TouchableOpacity>

            {/* Card de Privacidade */}
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
          </View>

          {/* Rodapé dinâmico similar ao Login */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131620',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  robotIcon: {
    width: 44,
    height: 44,
  },
  headingTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 27,
  },
  subtitle: {
    color: '#8A91A6',
    fontSize: 13,
    marginTop: 5,
    lineHeight: 18,
  },
  form: {
    gap: 24,
    marginBottom: 24,
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
    borderColor: '#8B94F7',
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
    backgroundColor: '#57DDA9',
  },
  strengthText: {
    color: '#57DDA9',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
    marginTop: 24,
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
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 24,
  },
  footerText: {
    color: '#5C668A',
    fontSize: 13,
  },
  footerLink: {
    color: '#9FA8FF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});