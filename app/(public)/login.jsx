import React, { useRef, useState } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../services/authApi';
import { ApiError } from '../../services/apiClient';
import { validateLogin } from '../../utils/authValidation';
// import DotGridBackground from '../../components/DotGridBackground';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState('');
    const [enviando, setEnviando] = useState(false);
    const envioEmAndamento = useRef(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [emailFocado, setEmailFocado] = useState(false);
    const [senhaFocada, setSenhaFocada] = useState(false);

    function atualizarCampo(campo, valor, atualizar) {
        atualizar(valor);
        setErros((atuais) => {
            const proximos = { ...atuais };
            delete proximos[campo];
            return proximos;
        });
        setErroGeral('');
    }

    async function enviarFormulario() {
        if (envioEmAndamento.current) {
            return;
        }

        const errosDeValidacao = validateLogin({ email, password: senha });
        setErros(errosDeValidacao);
        setErroGeral('');
        if (Object.keys(errosDeValidacao).length > 0) {
            return;
        }

        envioEmAndamento.current = true;
        setEnviando(true);
        try {
            const credenciais = await login({ email: email.trim(), password: senha });
            await signIn(credenciais);
            router.replace('/onboarding');
        } catch (error) {
            setErros(error instanceof ApiError ? error.fieldErrors : {});
            setErroGeral(error instanceof ApiError
                ? error.message
                : 'Não foi possível entrar agora. Tente novamente.');
        } finally {
            envioEmAndamento.current = false;
            setEnviando(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* <DotGridBackground /> */}
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
                            <Text style={styles.headerTitle}>Entrar</Text>
                        </View>

                        {/* Logo + saudação */}
                        <View style={styles.headingRow}>
                            <Image
                                source={require('../../assets/tuti.png')}
                                style={styles.robotIcon}
                                resizeMode="contain"
                            />
                            <View style={styles.headingTextWrap}>
                                <Text style={styles.title}>Bom te ver de volta</Text>
                                <Text style={styles.subtitle}>Sua trilha continua de onde parou.</Text>
                            </View>
                        </View>

                        {/* Formulário */}
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-MAIL</Text>
                                <TextInput
                                    style={[styles.input, emailFocado && styles.inputActive, erros.email && styles.inputError]}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={(valor) => atualizarCampo('email', valor, setEmail)}
                                    onFocus={() => setEmailFocado(true)}
                                    onBlur={() => {
                                        setEmailFocado(false);
                                        if (!erroGeral) {
                                            const validacao = validateLogin({ email, password: senha });
                                            setErros((atuais) => ({ ...atuais, email: validacao.email }));
                                        }
                                    }}
                                    editable={!enviando}
                                    autoComplete="email"
                                    accessibilityLabel="E-mail"
                                    placeholderTextColor="#5C668A"
                                />
                                {erros.email ? <Text style={styles.fieldError} accessibilityLiveRegion="polite">{erros.email}</Text> : null}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>SENHA</Text>
                                <View style={[styles.passwordContainer, senhaFocada && styles.inputActive, erros.password && styles.inputError]}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        secureTextEntry={!mostrarSenha}
                                        value={senha}
                                        onChangeText={(valor) => atualizarCampo('password', valor, setSenha)}
                                        onFocus={() => setSenhaFocada(true)}
                                        onBlur={() => {
                                            setSenhaFocada(false);
                                            if (!erroGeral) {
                                                const validacao = validateLogin({ email, password: senha });
                                                setErros((atuais) => ({ ...atuais, password: validacao.password }));
                                            }
                                        }}
                                        editable={!enviando}
                                        autoComplete="current-password"
                                        accessibilityLabel="Senha"
                                        placeholderTextColor="#5C668A"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setMostrarSenha(!mostrarSenha)}
                                        disabled={enviando}
                                        accessibilityRole="button"
                                        accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                    >
                                        <Ionicons
                                            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#5C668A"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {erros.password ? <Text style={styles.fieldError} accessibilityLiveRegion="polite">{erros.password}</Text> : null}
                            </View>

                            <TouchableOpacity onPress={() => router.push('/recover-password')} disabled={enviando}>
                                <Text style={styles.forgotText}>Esqueci minha senha</Text>
                            </TouchableOpacity>
                        </View>

                        {erroGeral ? <Text style={styles.formError} accessibilityRole="alert">{erroGeral}</Text> : null}

                        {/* Botão principal (reaproveitando o componente já existente) */}
                        <PrimaryButton title="Entrar" onPress={enviarFormulario} loading={enviando} />

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
                    </View>

                    {/* Rodapé */}
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Não tem conta? </Text>
                        <TouchableOpacity onPress={() => router.push('/sign-up')}>
                            <Text style={styles.footerLink}>Criar agora</Text>
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
        paddingTop: 60,
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
    inputError: {
        borderColor: '#FF7A59',
    },
    fieldError: {
        color: '#FF9B83',
        fontSize: 12,
    },
    formError: {
        color: '#FF9B83',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 16,
        textAlign: 'center',
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
    forgotText: {
        color: '#9FA8FF',
        fontSize: 13,
        fontWeight: 'bold',
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
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20,
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
