import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR, F } from './TutoriaUI';

const TIPOS = {
  info: { icone: 'information-circle', cor: COR.roxo },
  sucesso: { icone: 'checkmark-circle', cor: COR.menta },
  aviso: { icone: 'warning', cor: COR.ambar },
  erro: { icone: 'alert-circle', cor: COR.coral },
};

const MensagemContext = createContext(null);

// Substitui Alert.alert / window.confirm com o visual do app e funciona igual em Android, iOS e web.
export function MensagemProvider({ children }) {
  const [atual, setAtual] = useState(null);
  const resolverRef = useRef(null);

  const fechar = useCallback((resultado) => {
    resolverRef.current?.(resultado);
    resolverRef.current = null;
    setAtual(null);
  }, []);

  const abrir = useCallback((opcoes) => {
    // Uma caixa por vez: a anterior conta como cancelada.
    resolverRef.current?.(false);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setAtual(opcoes);
    });
  }, []);

  const mostrarMensagem = useCallback(
    ({ tipo = 'info', titulo, mensagem, textoBotao = 'Entendi' }) =>
      abrir({ tipo, titulo, mensagem, textoConfirmar: textoBotao, confirmacao: false }),
    [abrir]
  );

  const confirmar = useCallback(
    ({
      tipo = 'aviso',
      titulo,
      mensagem,
      textoConfirmar = 'Confirmar',
      textoCancelar = 'Cancelar',
      destrutivo = false,
    }) => abrir({ tipo, titulo, mensagem, textoConfirmar, textoCancelar, destrutivo, confirmacao: true }),
    [abrir]
  );

  const valor = useMemo(() => ({ mostrarMensagem, confirmar }), [mostrarMensagem, confirmar]);
  const estilo = TIPOS[atual?.tipo] ?? TIPOS.info;

  return (
    <MensagemContext.Provider value={valor}>
      {children}
      <Modal
        visible={!!atual}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => fechar(false)}
      >
        <View style={s.fundo}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => fechar(false)} accessibilityLabel="Fechar" />
          {atual && (
            <View style={s.caixa} accessibilityRole="alert">
              <View style={[s.iconeCaixa, { backgroundColor: `${estilo.cor}26` }]}>
                <Ionicons name={estilo.icone} size={26} color={estilo.cor} />
              </View>

              {atual.titulo ? <Text style={s.titulo}>{atual.titulo}</Text> : null}
              {atual.mensagem ? <Text style={s.mensagem}>{atual.mensagem}</Text> : null}

              <View style={s.botoes}>
                {atual.confirmacao && (
                  <Pressable
                    onPress={() => fechar(false)}
                    style={({ pressed }) => [s.botao, s.botaoSecundario, pressed && s.pressionado]}
                    accessibilityRole="button"
                  >
                    <Text style={s.textoSecundario}>{atual.textoCancelar}</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => fechar(true)}
                  style={({ pressed }) => [
                    s.botao,
                    { backgroundColor: atual.destrutivo ? COR.coral : COR.roxo },
                    pressed && s.pressionado,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={s.textoPrimario}>{atual.textoConfirmar}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </MensagemContext.Provider>
  );
}

export function useMensagem() {
  const contexto = useContext(MensagemContext);
  if (!contexto) {
    throw new Error('useMensagem deve ser usado dentro de MensagemProvider');
  }
  return contexto;
}

const s = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(5,7,12,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  caixa: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COR.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COR.linha,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  iconeCaixa: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontFamily: F.b,
    fontSize: 19,
    lineHeight: 24,
    color: COR.tinta,
    textAlign: 'center',
  },
  mensagem: {
    fontFamily: F.r,
    fontSize: 14,
    lineHeight: 21,
    color: COR.apagado,
    textAlign: 'center',
    marginTop: 8,
  },
  botoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    width: '100%',
  },
  botao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSecundario: {
    backgroundColor: COR.superficie2,
    borderWidth: 1,
    borderColor: COR.linha,
  },
  pressionado: {
    opacity: 0.8,
  },
  textoPrimario: {
    fontFamily: F.b,
    fontSize: 15,
    color: COR.fundo,
  },
  textoSecundario: {
    fontFamily: F.sb,
    fontSize: 15,
    color: COR.tinta,
  },
});
