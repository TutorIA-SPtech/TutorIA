import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COR, F, txt } from './TutoriaUI';
import { ApiError } from '../services/apiClient';
import { deleteConversation, listConversations } from '../services/tutorApi';

const DIA_MS = 24 * 60 * 60 * 1000;

function formatarData(iso) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '';
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dia = new Date(data);
  dia.setHours(0, 0, 0, 0);
  const diferenca = Math.round((hoje - dia) / DIA_MS);
  const hora = `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
  if (diferenca === 0) return `Hoje, ${hora}`;
  if (diferenca === 1) return `Ontem, ${hora}`;
  const dd = String(data.getDate()).padStart(2, '0');
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  return data.getFullYear() === hoje.getFullYear() ? `${dd}/${mm}` : `${dd}/${mm}/${data.getFullYear()}`;
}

function mensagemDeErro(error, padrao) {
  return error instanceof ApiError ? error.message : padrao;
}

// Painel com as conversas anteriores do aluno: reabrir, apagar ou começar uma nova.
export default function HistoricoConversas({ visivel, conversaAtualId, onFechar, onAbrir, onNova, onApagada }) {
  const insets = useSafeAreaInsets();
  const [conversas, setConversas] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [apagandoId, setApagandoId] = useState(null);
  const buscando = useRef(false);

  const carregar = useCallback(async (numeroPagina) => {
    if (buscando.current) return;
    buscando.current = true;
    setCarregando(true);
    setErro('');
    try {
      const { conversations, hasMore } = await listConversations(numeroPagina);
      setConversas((atuais) => {
        if (numeroPagina === 0) return conversations;
        const ids = new Set(atuais.map((c) => c.id));
        return [...atuais, ...conversations.filter((c) => !ids.has(c.id))];
      });
      setPagina(numeroPagina);
      setTemMais(hasMore);
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível carregar suas conversas.'));
    } finally {
      buscando.current = false;
      setCarregando(false);
    }
  }, []);

  // Recarrega sempre que o painel abre: a lista muda a cada pergunta feita no chat.
  useEffect(() => {
    if (visivel) {
      setConfirmandoId(null);
      carregar(0);
    }
  }, [visivel, carregar]);

  const apagar = async (id) => {
    setApagandoId(id);
    setErro('');
    try {
      await deleteConversation(id);
    } catch (error) {
      // 404: já tinha sido apagada (outro aparelho), então segue como sucesso.
      if (!(error instanceof ApiError && error.status === 404)) {
        setErro(mensagemDeErro(error, 'Não foi possível apagar a conversa.'));
        setApagandoId(null);
        return;
      }
    }
    setConversas((atuais) => atuais.filter((c) => c.id !== id));
    setConfirmandoId(null);
    setApagandoId(null);
    onApagada(id);
  };

  const carregarMais = () => {
    if (temMais && !carregando && !erro) {
      carregar(pagina + 1);
    }
  };

  const renderConversa = ({ item }) => {
    const ativa = item.id === conversaAtualId;

    if (confirmandoId === item.id) {
      const apagando = apagandoId === item.id;
      return (
        <View style={[e.item, e.itemConfirmar]}>
          <Text style={e.confirmarTexto} numberOfLines={2}>Apagar “{item.title}”?</Text>
          <View style={e.confirmarAcoes}>
            <Pressable onPress={() => setConfirmandoId(null)} disabled={apagando} style={e.acao} hitSlop={6}>
              <Text style={e.acaoTexto}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={() => apagar(item.id)} disabled={apagando} style={[e.acao, e.acaoPerigo]} hitSlop={6}>
              {apagando
                ? <ActivityIndicator size="small" color={COR.coral} />
                : <Text style={[e.acaoTexto, { color: COR.coral }]}>Apagar</Text>}
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <Pressable
        onPress={() => onAbrir(item)}
        style={({ pressed }) => [e.item, ativa && e.itemAtivo, pressed && { backgroundColor: 'rgba(255,255,255,0.04)' }]}
        accessibilityRole="button"
        accessibilityLabel={`Abrir conversa ${item.title}`}
      >
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={e.titulo} numberOfLines={1}>{item.title}</Text>
          <Text style={e.data}>{ativa ? 'Conversa atual' : formatarData(item.updatedAt)}</Text>
        </View>
        <Pressable
          onPress={() => setConfirmandoId(item.id)}
          hitSlop={10}
          style={e.lixeira}
          accessibilityRole="button"
          accessibilityLabel={`Apagar conversa ${item.title}`}
        >
          <Ionicons name="trash-outline" size={16} color={COR.apagado} />
        </Pressable>
      </Pressable>
    );
  };

  const vazio = !carregando && !erro && conversas.length === 0;

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <Pressable style={e.fundo} onPress={onFechar} accessibilityLabel="Fechar histórico" />
      <View style={[e.painel, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={e.alca} />

        <View style={e.cabecalho}>
          <Text style={e.cabecalhoTitulo}>Suas conversas</Text>
          <Pressable onPress={onFechar} hitSlop={10} style={e.fechar} accessibilityLabel="Fechar">
            <Ionicons name="close" size={16} color={COR.apagado} />
          </Pressable>
        </View>

        <Pressable onPress={onNova} style={({ pressed }) => [e.nova, pressed && { opacity: 0.8 }]}>
          <Ionicons name="add" size={16} color={COR.lilas} />
          <Text style={e.novaTexto}>Nova conversa</Text>
        </Pressable>

        {erro ? (
          <View style={e.erro}>
            <Text style={e.erroTexto}>{erro}</Text>
            <Pressable onPress={() => carregar(conversas.length === 0 ? 0 : pagina + 1)} hitSlop={6}>
              <Text style={e.tentarDeNovo}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : null}

        {vazio ? (
          <Text style={[txt.tx, e.vazio]}>
            Você ainda não tem conversas. Faça uma pergunta ao Tuti e ela aparece aqui.
          </Text>
        ) : (
          <FlatList
            data={conversas}
            keyExtractor={(c) => String(c.id)}
            renderItem={renderConversa}
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
            onEndReached={carregarMais}
            onEndReachedThreshold={0.4}
            ListFooterComponent={carregando ? <ActivityIndicator color={COR.lilas} style={{ marginVertical: 14 }} /> : null}
          />
        )}
      </View>
    </Modal>
  );
}

const e = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  painel: {
    maxHeight: '78%', minHeight: '45%', backgroundColor: COR.fundo,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderBottomWidth: 0, borderColor: COR.linha,
    paddingHorizontal: 18, paddingTop: 8, gap: 12,
  },
  alca: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: COR.superficie2 },
  cabecalho: { flexDirection: 'row', alignItems: 'center' },
  cabecalhoTitulo: { color: COR.tinta, fontSize: 15, fontFamily: F.b },
  fechar: {
    marginLeft: 'auto', width: 30, height: 30, borderRadius: 15,
    backgroundColor: COR.superficie, alignItems: 'center', justifyContent: 'center',
  },
  nova: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: 'rgba(201,182,255,0.3)', borderRadius: 14, paddingVertical: 11,
  },
  novaTexto: { color: COR.lilas, fontSize: 12, fontFamily: F.b },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: COR.linha, borderRadius: 16, paddingVertical: 11, paddingHorizontal: 13,
  },
  itemAtivo: { borderColor: 'rgba(201,182,255,0.45)', backgroundColor: 'rgba(157,169,255,0.08)' },
  itemConfirmar: { flexDirection: 'column', alignItems: 'stretch', borderColor: 'rgba(255,122,89,0.35)' },
  titulo: { color: COR.tinta, fontSize: 12, fontFamily: F.m },
  data: { color: COR.apagado, fontSize: 10, fontFamily: F.r },
  lixeira: { padding: 4 },
  confirmarTexto: { color: COR.tinta, fontSize: 11.5, fontFamily: F.m },
  confirmarAcoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  acao: {
    minWidth: 76, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 11,
    borderRadius: 99, backgroundColor: COR.superficie,
  },
  acaoPerigo: { backgroundColor: 'rgba(255,122,89,0.12)' },
  acaoTexto: { color: COR.tinta, fontSize: 10.5, fontFamily: F.b },
  erro: { gap: 4 },
  erroTexto: { color: COR.coral, fontSize: 11, fontFamily: F.m },
  tentarDeNovo: { color: COR.lilas, fontSize: 10.5, fontFamily: F.b },
  vazio: { textAlign: 'center', marginTop: 24, fontSize: 11.5 },
});
