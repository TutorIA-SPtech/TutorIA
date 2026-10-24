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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../../components/Button';
import DotGridBackground from '../../components/DotGridBackground';
import { resetPassword } from '../../services/authApi';
import { ApiError } from '../../services/apiClient';

const MAX_SENHA = 72;

const REGRAS = [
    { id: 'tamanho', texto: 'Pelo menos 8 caracteres', ok: (s) => s.length >= 8 },
    { id: 'letraNumero', texto: 'Uma letra e um número', ok: (s) => /[a-zA-Z]/.test(s) && /\d/.test(s) },
];
function forca(s) {
    if (!s) return 0;
    let p = 0;
    if (s.length >= 8) p++;
    if (/[a-zA-Z]/.test(s) && /\d/.test(s)) p++;
    if (/[a-z]/.test(s) && /[A-Z]/.test(s)) p++;
    if (/[^a-zA-Z0-9]/.test(s) || s.length >= 12) p++;
    return p;
}
const NIVEIS = [
    { texto: '', cor: '#202538' },
    { texto: 'fraca', cor: '#FF7A59' },
    { texto: 'média', cor: '#FFC978' },
    { texto: 'boa', cor: '#9FA8FF' },
    { texto: 'forte', cor: '#57DDA9' },
];

export default function NovaSenhaScreen() {
    const router = useRouter();
    const { email, codigo } = useLocalSearchParams();
    const [senha, setSenha] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [verSenha, setVerSenha] = useState(false);
    const [focado, setFocado] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [tokenExpirado, setTokenExpirado] = useState(false);

    const nivel = NIVEIS[forca(senha)];
    const regrasOk = REGRAS.every((r) => r.ok(senha));
    const coincidem = confirmar.length > 0 && confirmar === senha;
    const naoCoincidem = confirmar.length > 0 && confirmar !== senha;
    const podeSalvar = regrasOk && coincidem;

    async function handleSalvar() {
        if (!podeSalvar || enviando) return;
        setEnviando(true);
        setErro('');
        setTokenExpirado(false);
        try {
            await resetPassword({ email, token: codigo, newPassword: senha });
            router.dismissTo({ pathname: '/login', params: { senhaRedefinida: '1' } });
        } catch (error) {
            setTokenExpirado(error instanceof ApiError && error.code === 'INVALID_RESET_TOKEN');
            setErro(error instanceof ApiError
                ? error.fieldErrors.newPassword || error.message
                : 'Não foi possível salvar a nova senha. Tente novamente.');
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
                            <Text style={styles.step}>3 de 3</Text>
                        </View>

                        <View style={styles.headingRow}>
                            <View style={styles.lockIcon}>
                                <Ionicons name="lock-closed-outline" size={22} color="#C9B6FF" />
                            </View>
                            <View style={styles.headingTextWrap}>
                                <Text style={styles.title}>Crie uma nova senha</Text>
                                <Text style={styles.subtitle}>Código confirmado.</Text>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, focado === 'senha' && styles.labelActive]}>NOVA SENHA</Text>
                            <View style={[styles.inputRow, focado === 'senha' && styles.inputActive]}>
                                <TextInput
                                    style={styles.inputText}
                                    value={senha}
                                    onChangeText={setSenha}
                                    maxLength={MAX_SENHA}
                                    editable={!enviando}
                                    secureTextEntry={!verSenha}
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                    textContentType="newPassword"
                                    onFocus={() => setFocado('senha')}
                                    onBlur={() => setFocado(null)}
                                    placeholderTextColor="#5C668A"
                                />
                                <TouchableOpacity onPress={() => setVerSenha((v) => !v)} hitSlop={10}>
                                    <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#5C668A" />
                                </TouchableOpacity>
                            </View>
                            {senha.length > 0 && (
                                <View style={styles.strengthRow}>
                                    <View style={styles.strengthTrack}>
                                        <View
                                            style={[
                                                styles.strengthFill,
                                                { width: `${(forca(senha) / 4) * 100}%`, backgroundColor: nivel.cor },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.strengthText, { color: nivel.cor }]}>{nivel.texto}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.rules}>
                            {REGRAS.map((r) => {
                                const ok = r.ok(senha);
                                return (
                                    <View key={r.id} style={styles.ruleRow}>
                                        <Ionicons
                                            name={ok ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={16}
                                            color={ok ? '#57DDA9' : '#5C668A'}
                                        />
                                        <Text style={[styles.ruleText, !ok && styles.ruleTextOff]}>{r.texto}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, focado === 'confirmar' && styles.labelActive]}>CONFIRMAR SENHA</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focado === 'confirmar' && styles.inputActive,
                                    coincidem && styles.inputOk,
                                    naoCoincidem && styles.inputError,
                                ]}
                                value={confirmar}
                                onChangeText={setConfirmar}
                                maxLength={MAX_SENHA}
                                editable={!enviando}
                                secureTextEntry={!verSenha}
                                autoCapitalize="none"
                                onFocus={() => setFocado('confirmar')}
                                onBlur={() => setFocado(null)}
                                onSubmitEditing={handleSalvar}
                                returnKeyType="done"
                                placeholderTextColor="#5C668A"
                            />
                            {coincidem && <Text style={styles.okText}>As senhas coincidem</Text>}
                            {naoCoincidem && <Text style={styles.errorText}>As senhas não coincidem</Text>}
                        </View>

                        {!!erro && (
                            <View style={styles.formError}>
                                <Text style={styles.errorText} accessibilityRole="alert">{erro}</Text>
                                {tokenExpirado && (
                                    <TouchableOpacity onPress={() => router.dismissTo('/recover-password')}>
                                        <Text style={styles.linkText}>Pedir novo código</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <View style={[styles.buttonWrap, !podeSalvar && styles.disabled]}>
                            <PrimaryButton
                                title="Salvar nova senha"
                                onPress={handleSalvar}
                                loading={enviando}
                                disabled={!podeSalvar}
                            />
                        </View>
                    </View>

                    <Text style={styles.footerNote}>
                        Depois de salvar, entre no app com a nova senha.
                    </Text>
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
    headingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    lockIcon: {
        width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(160, 175, 255, 0.12)',
        justifyContent: 'center', alignItems: 'center',
    },
    headingTextWrap: { marginLeft: 14, flex: 1 },
    title: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', lineHeight: 27 },
    subtitle: { color: '#8A91A6', fontSize: 13, marginTop: 5, lineHeight: 18 },
    inputGroup: { gap: 8, marginBottom: 18 },
    label: { color: '#5C668A', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    labelActive: { color: '#9FA8FF' },
    input: {
        backgroundColor: '#131620', borderWidth: 1, borderColor: '#202538', borderRadius: 16,
        paddingHorizontal: 16, paddingVertical: 16, color: '#FFFFFF', fontSize: 16,
    },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#131620', borderWidth: 1, borderColor: '#202538', borderRadius: 16, paddingHorizontal: 16,
    },
    inputText: { flex: 1, paddingVertical: 16, color: '#FFFFFF', fontSize: 16 },
    inputActive: { borderColor: '#8B94F7', backgroundColor: 'rgba(157, 169, 255, 0.07)' },
    inputOk: { borderColor: 'rgba(87, 221, 169, 0.5)' },
    inputError: { borderColor: '#FF7A59' },
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
    strengthTrack: { flex: 1, height: 5, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
    strengthFill: { height: '100%', borderRadius: 99 },
    strengthText: { fontSize: 12, fontWeight: 'bold', minWidth: 40, textAlign: 'right' },
    rules: { gap: 8, marginBottom: 22 },
    ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    ruleText: { color: '#FFFFFF', fontSize: 13 },
    ruleTextOff: { color: '#8A91A6' },
    okText: { color: '#57DDA9', fontSize: 12 },
    errorText: { color: '#FF7A59', fontSize: 12 },
    formError: { gap: 6, marginBottom: 14 },
    linkText: { color: '#9FA8FF', fontSize: 13, fontWeight: 'bold' },
    buttonWrap: { width: '100%', marginTop: 6 },
    disabled: { opacity: 0.45 },
    footerNote: { color: '#5C668A', fontSize: 12, lineHeight: 18, paddingTop: 24 },
});