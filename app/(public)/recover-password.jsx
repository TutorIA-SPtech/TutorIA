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
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../../components/Button';
import DotGridBackground from '../../components/DotGridBackground';

// Recuperar senha - passo 1 de 3: informar o e-mail.
// Depois vem verify-code (passo 2) e new-password (passo 3).

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecuperarSenhaScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailFocado, setEmailFocado] = useState(false);
    const [erro, setErro] = useState('');

    function handleEnviar() {
        const limpo = email.trim();
        if (!EMAIL_VALIDO.test(limpo)) {
            setErro('Digite um e-mail válido.');
            return;
        }
        setErro('');
        // TODO: chamar o back para enviar o código para o e-mail
        router.push({ pathname: '/verify-code', params: { email: limpo } });
    }

    return (
        <View style={styles.container}>
            <DotGridBackground />
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
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View>
                        {/* Cabeçalho */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Recuperar senha</Text>
                            <Text style={styles.step}>1 de 3</Text>
                        </View>

                        {/* Logo + saudação */}
                        <View style={styles.headingRow}>
                            <Image
                                source={require('../../assets/tuti.png')}
                                style={styles.robotIcon}
                                resizeMode="contain"
                            />
                            <View style={styles.headingTextWrap}>
                                <Text style={styles.title}>Sem problema</Text>
                                <Text style={styles.subtitle}>Sua trilha e seu histórico continuam intactos.</Text>
                            </View>
                        </View>

                        <Text style={styles.paragraph}>
                            Digite o e-mail da sua conta. Envio um código de 6 dígitos, válido por 30 minutos.
                        </Text>

                        {/* Formulário */}
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-MAIL DA CONTA</Text>
                                <TextInput
                                    style={[styles.input, emailFocado && styles.inputActive, !!erro && styles.inputError]}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    value={email}
                                    onChangeText={(t) => {
                                        setEmail(t);
                                        if (erro) setErro('');
                                    }}
                                    onFocus={() => setEmailFocado(true)}
                                    onBlur={() => setEmailFocado(false)}
                                    onSubmitEditing={handleEnviar}
                                    returnKeyType="send"
                                    placeholderTextColor="#5C668A"
                                />
                                {!!erro && <Text style={styles.errorText}>{erro}</Text>}
                            </View>
                        </View>

                        <PrimaryButton title="Enviar código" onPress={handleEnviar} />

                        {/* Card de informação (mesmo padrão do card do sign-up.jsx) */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <View style={styles.infoIconWrapper}>
                                    <Ionicons name="logo-google" size={16} color="#A0AFFF" />
                                </View>
                                <Text style={styles.infoTitle}>Se você entrou com o Google</Text>
                            </View>
                            <Text style={styles.infoDescription}>
                                Não existe senha para redefinir — use "Continuar com Google" na tela de entrada.
                            </Text>
                        </View>
                    </View>

                    {/* Rodapé */}
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Lembrei a senha · </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.footerLink}>Voltar para entrar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0D14' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 32, justifyContent: 'space-between' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    backButton: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#131620',
        justifyContent: 'center', alignItems: 'center', marginRight: 16,
    },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    step: { marginLeft: 'auto', color: '#5C668A', fontSize: 12, fontWeight: 'bold' },
    headingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    robotIcon: { width: 44, height: 44 },
    headingTextWrap: { marginLeft: 14, flex: 1 },
    title: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', lineHeight: 27 },
    subtitle: { color: '#8A91A6', fontSize: 13, marginTop: 5, lineHeight: 18 },
    paragraph: { color: '#8A91A6', fontSize: 13, lineHeight: 19, marginBottom: 20 },
    form: { gap: 24, marginBottom: 20 },
    inputGroup: { gap: 8 },
    label: { color: '#5C668A', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    input: {
        backgroundColor: '#131620', borderWidth: 1, borderColor: '#202538', borderRadius: 16,
        paddingHorizontal: 16, paddingVertical: 16, color: '#FFFFFF', fontSize: 16,
    },
    inputActive: { borderColor: '#8B94F7' },
    inputError: { borderColor: '#FF7A59' },
    errorText: { color: '#FF7A59', fontSize: 12 },
    infoCard: { backgroundColor: '#131620', borderRadius: 24, padding: 20, marginTop: 16 },
    infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
    infoIconWrapper: {
        width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(160, 175, 255, 0.1)',
        justifyContent: 'center', alignItems: 'center',
    },
    infoTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    infoDescription: { color: '#5C668A', fontSize: 14, lineHeight: 22 },
    footerRow: { flexDirection: 'row', justifyContent: 'center', paddingTop: 20, flexWrap: 'wrap' },
    footerText: { color: '#5C668A', fontSize: 13 },
    footerLink: { color: '#9FA8FF', fontSize: 13, fontWeight: 'bold' },
});