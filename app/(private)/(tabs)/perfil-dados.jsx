import { useCallback, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { COR, F, txt, tela, Fundo, Cabecalho, Botao } from '../../../components/TutoriaUI';
import { useMensagem } from '../../../components/CaixaMensagem';
import { useAuth } from '../../../contexts/AuthContext';
import { ApiError } from '../../../services/apiClient';
import { getAccount, updateAccount, updateEmail } from '../../../services/accountApi';
import { rotaPendente } from '../../../services/rotaPendente';

// Limites alinhados com o cadastro (name até 120). Ver BACKEND-HANDOFF.md.
const MAX_NOME = 60;
const MAX_SOBRENOME = 59;
const MAX_APELIDO = 30;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// O back guarda o nome completo num campo só ("name"). Separa no primeiro espaço.
function separarNome(nomeCompleto) {
  const limpo = (nomeCompleto ?? '').trim().replace(/\s+/g, ' ');
  const i = limpo.indexOf(' ');
  return i === -1 ? [limpo, ''] : [limpo.slice(0, i), limpo.slice(i + 1)];
}

export default function DadosDaContaScreen() {
  const { signIn } = useAuth();
  const { mostrarMensagem } = useMensagem();
  const [original, setOriginal] = useState(null);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [focado, setFocado] = useState(null);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let montado = true;
      getAccount()
        .then((conta) => {
          if (!montado) return;
          const [n, s] = separarNome(conta.name);
          setOriginal(conta);
          setNome(n);
          setSobrenome(s);
          setApelido(conta.nickname ?? '');
          setEmail(conta.email ?? '');
          setSenhaAtual('');
          setErros({});
        })
        .catch(() => montado && setOriginal({ name: '', nickname: null, email: '', pendenteNoBack: true }));
      return () => {
        montado = false;
      };
    }, []),
  );

  const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`.trim();
  const emailMudou = !!original && email.trim().toLowerCase() !== (original.email ?? '').toLowerCase();
  const dadosMudaram = !!original
    && (nomeCompleto !== (original.name ?? '').trim() || (apelido.trim() || null) !== (original.nickname || null));
  const algoMudou = dadosMudaram || emailMudou;

  function validar() {
    const novo = {};
    if (!nome.trim()) novo.nome = 'Informe seu nome.';
    if (emailMudou && !EMAIL_VALIDO.test(email.trim())) novo.email = 'Informe um e-mail válido.';
    if (emailMudou && senhaAtual.length < 8) novo.senhaAtual = 'Digite sua senha atual para trocar o e-mail.';
    setErros(novo);
    return Object.keys(novo).length === 0;
  }

  async function salvar() {
    if (!algoMudou || salvando || !validar()) return;
    setSalvando(true);
    try {
      if (dadosMudaram) {
        await updateAccount({ name: nomeCompleto, nickname: apelido.trim() || null });
      }
      if (emailMudou) {
        const resposta = await updateEmail({ newEmail: email, currentPassword: senhaAtual });
        if (resposta?.accessToken && resposta?.tokenType === 'Bearer') {
          await signIn({ accessToken: resposta.accessToken, tokenType: resposta.tokenType });
        }
      }
      mostrarMensagem({ tipo: 'sucesso', titulo: 'Dados atualizados' });
      router.back();
    } catch (error) {
      if (rotaPendente(error)) {
        mostrarMensagem({
          tipo: 'aviso',
          titulo: 'Ainda não disponível',
          mensagem: 'A edição de dados está pronta no app, mas o servidor ainda não tem essa função. Tente novamente em breve.',
        });
      } else if (error instanceof ApiError && error.code === 'EMAIL_ALREADY_REGISTERED') {
        setErros({ email: 'Este e-mail já está em uso.' });
      } else if (error instanceof ApiError && error.status === 401) {
        setErros({ senhaAtual: 'Senha atual incorreta.' });
      } else {
        mostrarMensagem({
          tipo: 'erro',
          titulo: 'Não foi possível salvar',
          mensagem: error instanceof ApiError ? error.message : 'Tente novamente.',
        });
      }
    } finally {
      setSalvando(false);
    }
  }

  const estiloCampo = (id) => [e.campo, focado === id && e.campoFoco, erros[id] && e.campoErro];

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow />
      <Cabecalho titulo="Dados da conta" voltar />

      {!original ? (
        <ActivityIndicator color={COR.roxo} style={{ marginTop: 32 }} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={[tela.corpo, { paddingTop: 6, paddingBottom: 20 }]} keyboardShouldPersistTaps="handled">
            {original.pendenteNoBack ? (
              <View style={e.aviso}>
                <Text style={e.avisoTexto}>
                  Salvar ainda depende de uma atualização do servidor. Seus dados atuais aparecem normalmente.
                </Text>
              </View>
            ) : null}

            <View style={[tela.linha, { gap: 9, alignItems: 'flex-start' }]}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={e.rotulo}>NOME</Text>
                <TextInput
                  style={estiloCampo('nome')} value={nome} onChangeText={setNome} maxLength={MAX_NOME}
                  onFocus={() => setFocado('nome')} onBlur={() => setFocado(null)}
                  autoCapitalize="words" autoComplete="given-name" textContentType="givenName" editable={!salvando}
                />
                {erros.nome ? <Text style={e.erro}>{erros.nome}</Text> : null}
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={e.rotulo}>SOBRENOME</Text>
                <TextInput
                  style={estiloCampo('sobrenome')} value={sobrenome} onChangeText={setSobrenome} maxLength={MAX_SOBRENOME}
                  onFocus={() => setFocado('sobrenome')} onBlur={() => setFocado(null)}
                  autoCapitalize="words" autoComplete="family-name" textContentType="familyName" editable={!salvando}
                />
              </View>
            </View>

            <View style={{ gap: 6 }}>
              <Text style={e.rotulo}>APELIDO</Text>
              <TextInput
                style={estiloCampo('apelido')} value={apelido} onChangeText={setApelido} maxLength={MAX_APELIDO}
                onFocus={() => setFocado('apelido')} onBlur={() => setFocado(null)}
                placeholder={nome || 'Como quer ser chamado'} placeholderTextColor={COR.apagado} editable={!salvando}
              />
              <Text style={e.ajuda}>Aparece no "Olá" do seu perfil. Se ficar vazio, usamos seu primeiro nome.</Text>
            </View>

            <View style={{ gap: 6 }}>
              <Text style={e.rotulo}>E-MAIL</Text>
              <TextInput
                style={estiloCampo('email')} value={email} onChangeText={setEmail}
                onFocus={() => setFocado('email')} onBlur={() => setFocado(null)}
                keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress"
                editable={!salvando}
              />
              {erros.email ? <Text style={e.erro}>{erros.email}</Text> : null}
            </View>

            {emailMudou ? (
              <View style={{ gap: 6 }}>
                <Text style={e.rotulo}>SENHA ATUAL</Text>
                <TextInput
                  style={estiloCampo('senhaAtual')} value={senhaAtual} onChangeText={setSenhaAtual}
                  onFocus={() => setFocado('senhaAtual')} onBlur={() => setFocado(null)}
                  secureTextEntry autoCapitalize="none" autoComplete="current-password" textContentType="password"
                  maxLength={72} editable={!salvando}
                />
                {erros.senhaAtual
                  ? <Text style={e.erro}>{erros.senhaAtual}</Text>
                  : <Text style={e.ajuda}>Por segurança, confirme sua senha para trocar o e-mail de login.</Text>}
              </View>
            ) : null}

            <View style={{ marginTop: 'auto', paddingTop: 10, opacity: algoMudou ? 1 : 0.45 }}>
              <Botao titulo={salvando ? 'Salvando…' : 'Salvar alterações'} seta={!salvando} onPress={salvar} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  rotulo: { ...txt.lbl, color: '#B0B9DC' },
  campo: {
    height: 46, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(201,182,255,0.24)',
    backgroundColor: 'rgba(201,182,255,0.05)', paddingHorizontal: 12,
    color: COR.tinta, fontSize: 13, fontFamily: F.m,
  },
  campoFoco: { borderColor: COR.lilas, backgroundColor: 'rgba(201,182,255,0.08)' },
  campoErro: { borderColor: COR.coral },
  ajuda: { color: COR.apagado, fontSize: 10, lineHeight: 15, fontFamily: F.r },
  erro: { color: COR.coral, fontSize: 10.5, fontFamily: F.sb },
  aviso: {
    borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,201,120,0.32)',
    backgroundColor: 'rgba(255,201,120,0.08)', padding: 11,
  },
  avisoTexto: { color: COR.ambar, fontSize: 10.5, lineHeight: 15.5, fontFamily: F.m },
});
