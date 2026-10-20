import React, { useEffect, useRef, useState } from 'react';
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
import { requestPasswordRecovery } from '../../services/authApi';
import { ApiError } from '../../services/apiClient';
import { validateEmail } from '../../utils/authValidation';

const SEGUNDOS_REENVIO = 42;

export default function RecuperarSenhaScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailFocado, setEmailFocado] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [contagem, setContagem] = useState(SEGUNDOS_REENVIO);
    const [enviando, setEnviando] = useState(false);
    const [erroEmail, setErroEmail] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        if (enviado && contagem > 0) {
            timerRef.current = setTimeout(() => setContagem((c) => c - 1), 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [enviado, contagem]);

    async function handleEnviar() {
        const validacao = validateEmail(email);
        setErroEmail(validacao);
        setErroGeral('');
        if (validacao || enviando) return;

        setEnviando(true);
        try {
            await requestPasswordRecovery(email);
            setEnviado(true);
            setContagem(SEGUNDOS_REENVIO);
        } catch (error) {
            setErroGeral(error instanceof ApiError
                ? error.message
                : 'Não foi possível solicitar a recuperação agora. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    }

    async function handleReenviar() {
        if (contagem !== 0 || enviando) return;
        setEnviando(true);
        setErroGeral('');
        try {
            await requestPasswordRecovery(email);
            setContagem(SEGUNDOS_REENVIO);
        } catch (error) {
            setErroGeral(error instanceof ApiError
                ? error.message
                : 'Não foi possível reenviar a solicitação. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    }

    function handleTrocarEmail() {
        setEnviado(false);
        setContagem(SEGUNDOS_REENVIO);
        setErroEmail('');
        setErroGeral('');
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
                            Digite o e-mail da sua conta. Envio um link de redefinição válido por 30 minutos.
                        </Text>

                        {/* Formulário */}
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-MAIL DA CONTA</Text>
                                <TextInput
                                    style={[styles.input, emailFocado && styles.inputActive]}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={(valor) => {
                                        setEmail(valor);
                                        setErroEmail('');
                                        setErroGeral('');
                                    }}
                                    onFocus={() => setEmailFocado(true)}
                                    onBlur={() => setEmailFocado(false)}
                                    editable={!enviado && !enviando}
                                    autoCorrect={false}
                                    autoComplete="email"
                                    accessibilityLabel="E-mail da conta"
                                    placeholderTextColor="#5C668A"
                                />
                                {erroEmail ? <Text style={styles.fieldError}>{erroEmail}</Text> : null}
                            </View>
                        </View>

                        {erroGeral ? <Text style={styles.formError} accessibilityRole="alert">{erroGeral}</Text> : null}
                        <PrimaryButton title="Enviar instruções por e-mail" onPress={handleEnviar} loading={enviando} disabled={enviado} />

                        {enviado && (
                            <View style={styles.successCard}>
                                <View style={styles.successHeader}>
                                    <View style={styles.successIconWrapper}>
                                        <Ionicons name="mail-outline" size={18} color="#57DDA9" />
                                    </View>
                                    <Text style={styles.successLabel}>SOLICITAÇÃO ENVIADA</Text>
                                </View>
                                <Text style={styles.successText}>
                                    Se existir uma conta associada a <Text style={styles.successEmail}>{email}</Text>,
                                    enviaremos as instruções. Confira também a pasta de spam.
                                </Text>
                                <View style={styles.pillRow}>
                                    <TouchableOpacity style={styles.pill} onPress={handleReenviar} disabled={contagem > 0}>
                                        <Text style={styles.pillText}>
                                            {contagem > 0 ? `Reenviar em 0:${String(contagem).padStart(2, '0')}` : 'Reenviar'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.pill} onPress={handleTrocarEmail}>
                                        <Text style={styles.pillText}>Trocar e-mail</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

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
    fieldError: {
        color: '#FF8F8F',
        fontSize: 12,
        marginTop: 5,
    },
    formError: {
        color: '#FF8F8F',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 12,
    },
    container: {
        flex: 1,
        backgroundColor: '#0A0D14',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 32,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
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
        marginBottom: 20,
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
    paragraph: {
        color: '#8A91A6',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 20,
    },
    form: {
        gap: 24,
        marginBottom: 20,
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
    successCard: {
        backgroundColor: 'rgba(87, 221, 169, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(87, 221, 169, 0.35)',
        borderRadius: 20,
        padding: 18,
        marginTop: 20,
    },
    successHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    successIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(87, 221, 169, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successLabel: {
        color: '#57DDA9',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    successText: {
        color: '#8A91A6',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 14,
    },
    successEmail: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    pillRow: {
        flexDirection: 'row',
        gap: 10,
    },
    pill: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: '#202538',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    pillText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: '#131620',
        borderRadius: 24,
        padding: 20,
        marginTop: 16,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    infoIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(160, 175, 255, 0.1)',
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
        paddingTop: 20,
        flexWrap: 'wrap',
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