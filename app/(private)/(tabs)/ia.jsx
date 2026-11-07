import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

  const novaConversa = () => {
    if (enviando) return;
    // Cancela uma abertura de conversa que ainda esteja carregando.
    pedidoConversa.current += 1;
    setCarregandoConversa(false);
    setHistoricoAberto(false);
    setConversaId(null);
    setMensagens([]);
    setTexto('');
  };

  const enviar = async (pedido) => {
    const t = (pedido ?? texto).trim();
    if (!t || bloqueado) return;

    setMensagens((m) => [...m, { autor: 'aluno', texto: t }]);
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
          {/* Anexos e áudio voltam quando o back ler anexos no chat e houver gravação. */}
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

          <View style={[e.campo, bloqueado && { opacity: 0.45 }]}>
            <TextInput
              style={e.campoTexto}
              value={texto}
              onChangeText={setTexto}
              placeholder={mensagens.length === 0 ? 'Escreva seu pedido…' : 'Faça outra pergunta…'}
              placeholderTextColor={COR.apagado}
              onSubmitEditing={() => enviar()}
              returnKeyType="send"
              maxLength={MAX_QUESTION_LENGTH}
              editable={!bloqueado}
            />
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
});
