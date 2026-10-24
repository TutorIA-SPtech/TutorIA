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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../../components/Button';
import DotGridBackground from '../../components/DotGridBackground';
import { requestPasswordRecovery, verifyPasswordToken } from '../../services/authApi';
import { ApiError } from '../../services/apiClient';

const DIGITOS = 6;
const SEGUNDOS_REENVIO = 42;
const MAX_TENTATIVAS = 5;

export default function VerificarCodigoScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [codigo, setCodigo] = useState(Array(DIGITOS).fill(''));
    const [focado, setFocado] = useState(0);
    const [erro, setErro] = useState('');
    const [erroDeCodigo, setErroDeCodigo] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [tentativas, setTentativas] = useState(0);
    const [contagem, setContagem] = useState(SEGUNDOS_REENVIO);
    const caixas = useRef([]);

    useEffect(() => {
        if (contagem <= 0) return;
        const t = setTimeout(() => setContagem((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [contagem]);

    const completo = codigo.every((d) => d !== '');
    const expirou = tentativas >= MAX_TENTATIVAS;

    function digitar(texto, i) {
        const numeros = texto.replace(/\D/g, '');
        setErro('');

        if (numeros.length > 1) {
            const novo = [...codigo];
            numeros.slice(0, DIGITOS - i).split('').forEach((n, k) => { novo[i + k] = n; });
            setCodigo(novo);
            caixas.current[Math.min(i + numeros.length, DIGITOS - 1)]?.focus();
            return;
        }

        const novo = [...codigo];
        novo[i] = numeros;
        setCodigo(novo);
        if (numeros && i < DIGITOS - 1) caixas.current[i + 1]?.focus();
    }

    function apagar(e, i) {
        if (e.nativeEvent.key === 'Backspace' && !codigo[i] && i > 0) {
            const novo = [...codigo];
            novo[i - 1] = '';
            setCodigo(novo);
            caixas.current[i - 1]?.focus();
        }
    }

    function mostrarErro(error, mensagemPadrao) {
        const invalido = error instanceof ApiError && error.code === 'INVALID_RESET_TOKEN';
        setErroDeCodigo(invalido);
        setErro(error instanceof ApiError ? error.message : mensagemPadrao);
        return invalido;
    }

    async function handleConfirmar() {
        if (!completo || expirou || enviando) return;
        const token = codigo.join('');
        setEnviando(true);
        try {
            await verifyPasswordToken(email, token);
            router.push({ pathname: '/new-password', params: { email, codigo: token } });
        } catch (error) {
            if (mostrarErro(error, 'Não foi possível verificar o código. Tente novamente.')) {
                setTentativas((t) => t + 1);
                setCodigo(Array(DIGITOS).fill(''));
                caixas.current[0]?.focus();
            }
        } finally {
            setEnviando(false);
        }
    }

    async function handleReenviar() {
        if (contagem > 0 || enviando) return;
        setEnviando(true);
        setErro('');
        try {
            await requestPasswordRecovery(email);
            setCodigo(Array(DIGITOS).fill(''));
            setTentativas(0);
            setContagem(SEGUNDOS_REENVIO);
            caixas.current[0]?.focus();
        } catch (error) {
            mostrarErro(error, 'Não foi possível reenviar o código. Tente novamente.');
        } finally {
            setEnviando(false);
        }
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
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Recuperar senha</Text>
                            <Text style={styles.step}>2 de 3</Text>
                        </View>

                        <View style={styles.headingRow}>
                            <View style={styles.mailIcon}>
                                <Ionicons name="mail-outline" size={22} color="#57DDA9" />
                            </View>
                            <View style={styles.headingTextWrap}>
                                <Text style={styles.title}>Confira seu e-mail</Text>
                                <Text style={styles.subtitle}>O código vale por 15 minutos.</Text>
                            </View>
                        </View>

                        <Text style={styles.paragraph}>
                            Enviei um código de 6 dígitos para{' '}
                            <Text style={styles.emailText}>{email || 'o seu e-mail'}</Text>. Digite abaixo.
                        </Text>

                        <Text style={styles.label}>CÓDIGO DE VERIFICAÇÃO</Text>
                        <View style={styles.codeRow}>
                            {codigo.map((d, i) => (
                                <TextInput
                                    key={i}
                                    ref={(r) => { caixas.current[i] = r; }}
                                    style={[
                                        styles.codeBox,
                                        focado === i && styles.inputActive,
                                        erroDeCodigo && !!erro && styles.inputError,
                                    ]}
                                    value={d}
                                    onChangeText={(t) => digitar(t, i)}
                                    onKeyPress={(e) => apagar(e, i)}
                                    onFocus={() => setFocado(i)}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    autoComplete="sms-otp"
                                    maxLength={i === 0 ? DIGITOS : 1}
                                    autoFocus={i === 0}
                                    editable={!expirou && !enviando}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>
                        {!!erro && !(erroDeCodigo && expirou) && (
                            <Text style={styles.errorText} accessibilityRole="alert">
                                {erroDeCodigo ? `${erro} Restam ${MAX_TENTATIVAS - tentativas} tentativas.` : erro}
                            </Text>
                        )}
                        {expirou && (
                            <Text style={styles.errorText}>O código expirou. Peça um novo.</Text>
                        )}

                        <View style={styles.pillRow}>
                            <TouchableOpacity
                                style={[styles.pill, contagem > 0 && styles.pillAccent]}
                                onPress={handleReenviar}
                                disabled={contagem > 0 || enviando}
                            >
                                <Text style={[styles.pillText, contagem > 0 && styles.pillTextAccent]}>
                                    {contagem > 0 ? `Reenviar em 0:${String(contagem).padStart(2, '0')}` : 'Reenviar código'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pill} onPress={() => router.back()}>
                                <Text style={styles.pillText}>Trocar e-mail</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.buttonWrap, (!completo || expirou) && styles.disabled]}>
                            <PrimaryButton
                                title="Confirmar código"
                                onPress={handleConfirmar}
                                loading={enviando}
                                disabled={!completo || expirou}
                            />
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>NÃO CHEGOU?</Text>
                            <Text style={styles.infoDescription}>
                                Confira o spam. Depois de 5 tentativas erradas o código expira e você pede outro.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Lembrei a senha · </Text>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
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
    mailIcon: {
        width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(87, 221, 169, 0.14)',
        justifyContent: 'center', alignItems: 'center',
    },
    headingTextWrap: { marginLeft: 14, flex: 1 },
    title: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', lineHeight: 27 },
    subtitle: { color: '#8A91A6', fontSize: 13, marginTop: 5, lineHeight: 18 },
    paragraph: { color: '#8A91A6', fontSize: 13, lineHeight: 19, marginBottom: 20 },
    emailText: { color: '#FFFFFF', fontWeight: 'bold' },
    label: { color: '#9FA8FF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
    codeRow: { flexDirection: 'row', gap: 8 },
    codeBox: {
        flex: 1, height: 58, backgroundColor: '#131620', borderWidth: 1, borderColor: '#202538', borderRadius: 14,
        color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center',
    },
    inputActive: { borderColor: '#8B94F7', backgroundColor: 'rgba(157, 169, 255, 0.08)' },
    inputError: { borderColor: '#FF7A59' },
    errorText: { color: '#FF7A59', fontSize: 12, marginTop: 8 },
    pillRow: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 20 },
    pill: {
        backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: '#202538',
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    },
    pillAccent: { borderColor: 'rgba(201, 182, 255, 0.35)' },
    pillText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
    pillTextAccent: { color: '#C9B6FF' },
    buttonWrap: { width: '100%' },
    disabled: { opacity: 0.45 },
    infoCard: { backgroundColor: '#131620', borderRadius: 24, padding: 20, marginTop: 16, gap: 8 },
    infoLabel: { color: '#5C668A', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
    infoDescription: { color: '#8A91A6', fontSize: 13, lineHeight: 20 },
    footerRow: { flexDirection: 'row', justifyContent: 'center', paddingTop: 20, flexWrap: 'wrap' },
    footerText: { color: '#5C668A', fontSize: 13 },
    footerLink: { color: '#9FA8FF', fontSize: 13, fontWeight: 'bold' },
});