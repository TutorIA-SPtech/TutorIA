import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Animated, Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import {
  COR, F, txt, tela, Fundo, Cabecalho, Tuti, Icone, IconeCaixa, Contorno, Enviar,
} from '../../../components/TutoriaUI';
import { ApiError } from '../../../services/apiClient';
import { getAiUsage } from '../../../services/aiUsageApi';
import {
  askTutor, getConversationMessages, getLatestConversation, MAX_QUESTION_LENGTH,
} from '../../../services/tutorApi';
import HistoricoConversas from '../../../components/HistoricoConversas';

function paraMensagens(historico) {
  return historico.map((m) => ({
    autor: m.role === 'USER' ? 'aluno' : 'tuti',
    texto: m.content,
  }));
}

// true = só reconhece a fala offline, direto no aparelho (falha se o idioma não estiver baixado no celular).
// false = usa o reconhecedor do sistema (Apple/Google), que decide se processa no aparelho ou na nuvem.
// De qualquer forma, o áudio nunca passa pelo backend do TutorIA: só o texto final é enviado.
const SO_RECONHECIMENTO_NO_APARELHO = false;

// O Tuti não gera questões nem lê anexos: as sugestões pedem só explicações.
const SUGESTOES = [
  { texto: 'Explique função do 1º grau com um exemplo resolvido', icone: 'lista', cor: COR.lilas, fundo: 'rgba(157,169,255,0.15)' },
  { texto: 'Quais foram as causas da Revolução Industrial?', icone: 'barras', cor: COR.coral, fundo: 'rgba(255,122,89,0.14)' },
  { texto: 'Explique lei de Hess de forma mais simples', icone: 'info', cor: COR.menta, fundo: 'rgba(111,227,192,0.14)' },
];

export default function ChatIAScreen() {
  const rolagem = useRef(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [cota, setCota] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [conversaId, setConversaId] = useState(null);
  const [carregandoConversa, setCarregandoConversa] = useState(true);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  // Foto tirada pela câmera: fica só no chat (o back ainda não recebe imagens).
  const [foto, setFoto] = useState(null);
  const [ouvindo, setOuvindo] = useState(false);
  const ouvindoRef = useRef(false);
  const textoAntesDaFala = useRef('');
  const pulso = useRef(new Animated.Value(0)).current;
  // Só a última conversa pedida é aplicada na tela, mesmo se uma resposta anterior chegar depois.
  const pedidoConversa = useRef(0);

  useEffect(() => {
    const pedido = ++pedidoConversa.current;

    (async () => {
      try {
        const conversa = await getLatestConversation();
        if (!conversa) return;
        const historico = await getConversationMessages(conversa.id);
        if (pedido !== pedidoConversa.current) return;
        setConversaId(conversa.id);
        setMensagens(paraMensagens(historico));
      } catch {
      } finally {
        if (pedido === pedidoConversa.current) setCarregandoConversa(false);
      }
    })();

    return () => {
      pedidoConversa.current += 1;
    };
  }, []);

  const abrirConversa = async (conversa) => {
    setHistoricoAberto(false);
    if (enviando || conversa.id === conversaId) return;

    const pedido = ++pedidoConversa.current;
    setCarregandoConversa(true);
    try {
      const historico = await getConversationMessages(conversa.id);
      if (pedido !== pedidoConversa.current) return;
      setConversaId(conversa.id);
      setMensagens(paraMensagens(historico));
      setTexto('');
      setFoto(null);
    } catch (error) {
      if (pedido !== pedidoConversa.current) return;
      const mensagemErro = error instanceof ApiError && error.status === 404
        ? 'Essa conversa não existe mais.'
        : 'Não foi possível abrir essa conversa. Tente novamente.';
      setMensagens((m) => [...m, { autor: 'tuti', texto: mensagemErro, erro: true }]);
    } finally {
      if (pedido === pedidoConversa.current) setCarregandoConversa(false);
    }
  };

  const conversaApagada = (id) => {
    if (id === conversaId) {
      novaConversa();
    }
  };

  useFocusEffect(
    useCallback(() => {
      let montado = true;

      getAiUsage()
        .then((uso) => {
          const pedidosLivres = uso?.categories?.find((c) => c.category === 'FREE_REQUEST');
          if (montado && pedidosLivres) {
            setCota({ usados: pedidosLivres.used, limite: pedidosLivres.limit });
          }
        })
        .catch(() => {
        });

      return () => {
        montado = false;
      };
    }, []),
  );

  const noLimite = cota ? cota.usados >= cota.limite : false;
  const bloqueado = noLimite || enviando || carregandoConversa;

  // ---------- Voz: fala vira texto no campo ----------
  useSpeechRecognitionEvent('start', () => {
    ouvindoRef.current = true;
    setOuvindo(true);
  });

  useSpeechRecognitionEvent('end', () => {
    ouvindoRef.current = false;
    setOuvindo(false);
  });

  useSpeechRecognitionEvent('result', (evento) => {
    if (!ouvindoRef.current) return;
    const fala = evento.results?.[0]?.transcript ?? '';
    const base = textoAntesDaFala.current;
    setTexto(`${base}${base && fala ? ' ' : ''}${fala}`.slice(0, MAX_QUESTION_LENGTH));
  });

  useSpeechRecognitionEvent('error', (evento) => {
    ouvindoRef.current = false;
    setOuvindo(false);
    // "aborted" é o cancelamento feito pelo próprio app; "no-speech" é silêncio.
    if (evento.error === 'aborted' || evento.error === 'no-speech') return;
    if (evento.error === 'not-allowed') {
      avisarPermissao('o microfone e o reconhecimento de voz');
      return;
    }
    Alert.alert(
      'Não foi possível ouvir',
      evento.error === 'language-not-supported'
        ? 'O reconhecimento de voz em português não está disponível neste aparelho.'
        : 'O reconhecimento de voz falhou. Tente novamente ou escreva seu pedido.',
    );
  });

  // Anima o botão enquanto grava.
  useEffect(() => {
    if (!ouvindo) {
      pulso.setValue(0);
      return undefined;
    }
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    animacao.start();
    return () => animacao.stop();
  }, [ouvindo, pulso]);

  // Sair da aba (ou do app) não pode deixar o microfone aberto.
  useFocusEffect(
    useCallback(() => () => {
      if (ouvindoRef.current) ExpoSpeechRecognitionModule.abort();
    }, []),
  );

  const cancelarGravacao = () => {
    if (!ouvindoRef.current) return;
    ouvindoRef.current = false;
    setOuvindo(false);
    ExpoSpeechRecognitionModule.abort();
  };

  const avisarPermissao = (recurso) => {
    Alert.alert(
      `Permita o acesso a ${recurso}`,
      'Ative a permissão nas configurações do aparelho para usar este recurso.',
      [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
      ],
    );
  };

  const alternarGravacao = async () => {
    if (ouvindoRef.current) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    if (bloqueado) return;

    const permissao = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permissao.granted) {
      avisarPermissao('o microfone e o reconhecimento de voz');
      return;
    }

    textoAntesDaFala.current = texto.trim();
    ExpoSpeechRecognitionModule.start({
      lang: 'pt-BR',
      interimResults: true,
      continuous: false,
      addsPunctuation: true,
      requiresOnDeviceRecognition: SO_RECONHECIMENTO_NO_APARELHO,
    });
  };

  // ---------- Câmera: tira a foto e mostra no chat ----------
  const tirarFoto = async () => {
    if (bloqueado) return;
    cancelarGravacao();

    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      avisarPermissao('a câmera');
      return;
    }

    try {
      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });
      if (!resultado.canceled && resultado.assets?.[0]?.uri) {
        setFoto(resultado.assets[0].uri);
      }
    } catch {
      Alert.alert('Câmera indisponível', 'Não foi possível abrir a câmera neste aparelho.');
    }
  };

  const novaConversa = () => {
    if (enviando) return;
    // Cancela uma abertura de conversa que ainda esteja carregando.
    pedidoConversa.current += 1;
    setCarregandoConversa(false);
    setHistoricoAberto(false);
    setConversaId(null);
    setMensagens([]);
    setTexto('');
    setFoto(null);
    cancelarGravacao();
  };

  const enviar = async (pedido) => {
    const t = (pedido ?? texto).trim();
    if (!t || bloqueado) return;

    const fotoDoPedido = foto;
    cancelarGravacao();
    setMensagens((m) => [...m, { autor: 'aluno', texto: t, foto: fotoDoPedido }]);
    setFoto(null);
    setTexto('');
    setEnviando(true);
    try {
      const resposta = await askTutor(t, conversaId);
      const { answer, usage } = resposta;
      if (resposta.conversationId) {
        setConversaId(resposta.conversationId);
      }
      setMensagens((m) => [...m, { autor: 'tuti', texto: answer }]);
      if (usage) {
        setCota({ usados: usage.used, limite: usage.limit });
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === 'AI_LIMIT_EXCEEDED') {
        setCota((c) => (c ? { ...c, usados: c.limite } : c));
      }
      // A conversa foi apagada em outro aparelho: a próxima pergunta abre uma nova (o 404 não gasta cota).
      const conversaSumiu = error instanceof ApiError && error.status === 404 && conversaId;
      if (conversaSumiu) {
        setConversaId(null);
      }
      const mensagemErro = conversaSumiu
        ? 'Essa conversa não existe mais. Envie a pergunta de novo para começar outra.'
        : error instanceof ApiError
          ? error.fieldErrors?.question ?? error.message
          : 'O Tuti não conseguiu responder agora. Tente novamente.';
      setMensagens((m) => [...m, { autor: 'tuti', texto: mensagemErro, erro: true }]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow={mensagens.length === 0} />
      <Cabecalho
        titulo={mensagens.length === 0 ? 'Pedir ao Tuti' : 'Pedido atendido'}
        selo={cota ? `${cota.usados} / ${cota.limite} hoje` : undefined}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={rolagem}
          contentContainerStyle={[tela.corpo, { paddingBottom: 8 }]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => mensagens.length && rolagem.current?.scrollToEnd({ animated: true })}
        >
          {mensagens.length === 0 ? (
            <>
              <View style={[tela.linha, { gap: 12, marginTop: 2 }]}>
                <Tuti tam={50} />
                <View style={{ flex: 1 }}>
                  <Text style={[txt.h1, { fontSize: 19, lineHeight: 22.8 }]}>O que você precisa agora?</Text>
                  <Text style={[txt.tx, { fontSize: 11, lineHeight: 17, marginTop: 3 }]}>Tire suas dúvidas de estudo para o ENEM.</Text>
                </View>
              </View>

              <Text style={txt.lbl}>SUGESTÕES</Text>

              <View style={{ gap: 9 }}>
                {SUGESTOES.map((s) => (
                  <Contorno key={s.texto} style={e.sugestao} onPress={() => enviar(s.texto)}>
                    <IconeCaixa tam={30} raio={11} fundo={s.fundo}>
                      <Icone nome={s.icone} tam={16} cor={s.cor} />
                    </IconeCaixa>
                    <Text style={e.sugestaoTexto}>{s.texto}</Text>
                  </Contorno>
                ))}
              </View>
            </>
          ) : (
            mensagens.map((m, i) =>
              m.autor === 'aluno' ? (
                <View key={i} style={e.balao}>
                  {m.foto && <Image source={{ uri: m.foto }} style={e.balaoFoto} />}
                  <Text style={e.balaoTexto}>{m.texto}</Text>
                </View>
              ) : (
                <View key={i} style={[tela.linha, { gap: 9 }]}>
                  <Tuti tam={30} antena={false} />
                  <Text style={[e.respostaTexto, m.erro && { color: COR.coral }]}>{m.texto}</Text>
                </View>
              ),
            )
          )}

          {(enviando || carregandoConversa) && (
            <View style={[tela.linha, { gap: 9 }]}>
              <Tuti tam={30} antena={false} />
              <ActivityIndicator color={COR.lilas} />
            </View>
          )}

          {noLimite && (
            <Contorno style={{ gap: 4, padding: 12, borderColor: 'rgba(255,122,89,0.28)' }}>
              <Text style={e.assunto}>Você usou todos os pedidos de hoje.</Text>
              <Text style={[txt.tx, { fontSize: 10.5, lineHeight: 16.3 }]}>Renova às 00:00. Praticar questões e seguir a trilha continua ilimitado.</Text>
            </Contorno>
          )}
        </ScrollView>

        <View style={e.rodape}>
          {/* Anexos de arquivo voltam quando o back ler anexos no chat. */}
          <View style={[tela.linha, { gap: 6 }]}>
            <Pressable onPress={() => setHistoricoAberto(true)} style={[e.novaConversa, tela.linha, { gap: 5 }]} hitSlop={6} disabled={enviando}>
              <Ionicons name="time-outline" size={12} color={COR.lilas} />
              <Text style={e.verLimiteTexto}>Histórico</Text>
            </Pressable>
            {mensagens.length > 0 && (
              <Pressable onPress={novaConversa} style={e.novaConversa} hitSlop={6} disabled={enviando}>
                <Text style={e.verLimiteTexto}>Nova conversa</Text>
              </Pressable>
            )}
            <Pressable onPress={() => router.push('/limite')} style={e.verLimite} hitSlop={6}>
              <Text style={e.verLimiteTexto}>Ver limite de uso</Text>
            </Pressable>
          </View>

          {foto && (
            <View style={[tela.linha, { gap: 10 }]}>
              <View>
                <Image source={{ uri: foto }} style={e.fotoMiniatura} />
                <Pressable
                  onPress={() => setFoto(null)}
                  hitSlop={8}
                  style={e.fotoRemover}
                  accessibilityRole="button"
                  accessibilityLabel="Remover foto"
                >
                  <Ionicons name="close" size={12} color={COR.fundo} />
                </Pressable>
              </View>
              <Text style={[txt.tx, { flex: 1, fontSize: 10.5, lineHeight: 15 }]}>
                A foto aparece só neste chat: o Tuti ainda não lê imagens. Escreva sua pergunta junto.
              </Text>
            </View>
          )}

          <View style={[e.campo, bloqueado && { opacity: 0.45 }]}>
            <Pressable
              onPress={tirarFoto}
              hitSlop={8}
              disabled={bloqueado}
              accessibilityRole="button"
              accessibilityLabel="Tirar foto"
            >
              <Icone nome="camera" tam={18} cor={foto ? COR.menta : COR.lilas} />
            </Pressable>
            <TextInput
              style={e.campoTexto}
              value={texto}
              onChangeText={setTexto}
              placeholder={
                ouvindo
                  ? 'Ouvindo…'
                  : foto
                    ? 'Escreva sua pergunta sobre a foto…'
                    : mensagens.length === 0
                      ? 'Escreva seu pedido…'
                      : 'Faça outra pergunta…'
              }
              placeholderTextColor={COR.apagado}
              onSubmitEditing={() => enviar()}
              returnKeyType="send"
              maxLength={MAX_QUESTION_LENGTH}
              editable={!bloqueado && !ouvindo}
            />
            <Pressable
              onPress={alternarGravacao}
              hitSlop={8}
              disabled={bloqueado && !ouvindo}
              style={[e.micBotao, ouvindo && e.micBotaoAtivo]}
              accessibilityRole="button"
              accessibilityLabel={ouvindo ? 'Parar de gravar' : 'Falar o pedido'}
            >
              {ouvindo && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    e.micPulso,
                    {
                      opacity: pulso.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
                      transform: [{ scale: pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) }],
                    },
                  ]}
                />
              )}
              {ouvindo ? <View style={e.micParar} /> : <Icone nome="mic" tam={18} cor={COR.lilas} />}
            </Pressable>
            <Enviar tam={30} icone={14} onPress={() => enviar()} />
          </View>
        </View>
      </KeyboardAvoidingView>

      <HistoricoConversas
        visivel={historicoAberto}
        conversaAtualId={conversaId}
        onFechar={() => setHistoricoAberto(false)}
        onAbrir={abrirConversa}
        onNova={novaConversa}
        onApagada={conversaApagada}
      />
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  sugestao: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12 },
  sugestaoTexto: { flex: 1, color: COR.tinta, fontSize: 11.5, lineHeight: 16.1, fontFamily: F.m },
  balao: {
    alignSelf: 'flex-end', maxWidth: '80%', backgroundColor: COR.superficie2,
    paddingVertical: 12, paddingHorizontal: 14,
    borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomRightRadius: 6, borderBottomLeftRadius: 18,
  },
  balaoFoto: { width: 180, height: 180, borderRadius: 12, marginBottom: 8 },
  balaoTexto: { color: COR.tinta, fontSize: 11.5, lineHeight: 16.7, fontFamily: F.m },
  respostaTexto: { flex: 1, color: COR.tinta, fontSize: 11.5, lineHeight: 17.3, fontFamily: F.r },
  assunto: { color: COR.tinta, fontSize: 11, fontFamily: F.m },
  rodape: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 14, gap: 10 },
  verLimite: { marginLeft: 'auto', paddingVertical: 6, paddingHorizontal: 11, borderRadius: 99, backgroundColor: COR.superficie },
  novaConversa: { paddingVertical: 6, paddingHorizontal: 11, borderRadius: 99, backgroundColor: COR.superficie },
  verLimiteTexto: { color: COR.lilas, fontSize: 10.5, fontFamily: F.b },
  campo: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: COR.linha, backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 99, paddingLeft: 15, paddingRight: 8, height: 50,
  },
  campoTexto: { flex: 1, color: COR.tinta, fontSize: 12.5, fontFamily: F.r },
  fotoMiniatura: { width: 52, height: 52, borderRadius: 12, backgroundColor: COR.superficie2 },
  fotoRemover: {
    position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 9,
    backgroundColor: COR.tinta, alignItems: 'center', justifyContent: 'center',
  },
  micBotao: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  micBotaoAtivo: { backgroundColor: 'rgba(255,122,89,0.18)' },
  micPulso: { ...StyleSheet.absoluteFillObject, borderRadius: 15, backgroundColor: COR.coral },
  micParar: { width: 10, height: 10, borderRadius: 2, backgroundColor: COR.coral },
});