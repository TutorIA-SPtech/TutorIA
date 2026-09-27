import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  COR, F, txt, tela, Fundo, Cabecalho, Tuti, Icone, IconeCaixa, Caixa, Contorno, Chip, Botao, Enviar,
} from '../../../components/TutoriaUI';

const PEDIDOS_POR_DIA = 8;
const PEDIDOS_JA_USADOS = 3;

const SUGESTOES = [
  { texto: 'Questionário intermediário sobre funções', icone: 'lista', cor: COR.lilas, fundo: 'rgba(157,169,255,0.15)' },
  { texto: 'Simulado com meus assuntos mais fracos', icone: 'barras', cor: COR.coral, fundo: 'rgba(255,122,89,0.14)' },
  { texto: 'Explique lei de Hess de forma mais simples', icone: 'info', cor: COR.menta, fundo: 'rgba(111,227,192,0.14)' },
  { texto: 'Faça perguntas sobre o meu anexo', icone: 'arquivo', cor: COR.lilas, fundo: 'rgba(157,169,255,0.15)' },
];

const SIMULADO = {
  titulo: 'Simulado · pontos fracos',
  assuntos: [
    { nome: 'Reagente limitante', questoes: 6, dominio: 42 },
    { nome: 'Interpretação de gráficos', questoes: 5, dominio: 47 },
    { nome: 'Funções', questoes: 4, dominio: 51 },
  ],
  duracao: '25 min',
  nivel: 'nível médio',
};

const REFINOS = ['Mais fácil', 'Mais questões', 'Trocar assunto'];

function responder(pedido) {
  const t = pedido.toLowerCase();
  if (t.includes('simulado') || t.includes('question') || t.includes('fraco') || REFINOS.some((r) => t === r.toLowerCase())) {
    const total = SIMULADO.assuntos.reduce((soma, a) => soma + a.questoes, 0);
    return { autor: 'tuti', texto: `Montei ${total} questões com os três assuntos de menor domínio no seu mapa:`, simulado: SIMULADO };
  }
  return { autor: 'tuti', texto: 'Resposta de exemplo. Quando a API estiver ligada, a explicação do Tuti aparece aqui.' };
}

export default function ChatIAScreen() {
  const rolagem = useRef(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [usados, setUsados] = useState(PEDIDOS_JA_USADOS);
  const [anexo, setAnexo] = useState('Resumo_quimica');

  const noLimite = usados >= PEDIDOS_POR_DIA;

  const enviar = (pedido) => {
    const t = (pedido ?? texto).trim();
    if (!t || noLimite) return;
    setMensagens((m) => [...m, { autor: 'aluno', texto: t }, responder(t)]);
    setUsados((u) => u + 1);
    setTexto('');
  };

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow={mensagens.length === 0} />
      <Cabecalho
        titulo={mensagens.length === 0 ? 'Pedir ao Tuti' : 'Pedido atendido'}
        selo={`${usados} / ${PEDIDOS_POR_DIA} hoje`}
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
                  <Text style={[txt.tx, { fontSize: 11, lineHeight: 17, marginTop: 3 }]}>Escreva ou fale. Uso seu histórico e seus anexos.</Text>
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
                <View key={i} style={{ gap: 12 }}>
                  <View style={[tela.linha, { gap: 9 }]}>
                    <Tuti tam={30} antena={false} />
                    <Text style={e.respostaTexto}>{m.texto}</Text>
                  </View>

                  {m.simulado && (
                    <>
                      <Caixa tipo="cardp" style={{ gap: 10 }}>
                        <Text style={e.simuladoTitulo}>{m.simulado.titulo}</Text>
                        <View style={{ gap: 8 }}>
                          {m.simulado.assuntos.map((a) => (
                            <View key={a.nome} style={tela.linha}>
                              <Text style={e.assunto}>{a.nome}</Text>
                              <Text style={[txt.mn, { marginLeft: 'auto', fontSize: 10, color: a.dominio < 50 ? COR.coral : COR.apagado }]}>
                                {a.questoes} q · {a.dominio}%
                              </Text>
                            </View>
                          ))}
                        </View>
                        <View style={[tela.linha, { gap: 6 }]}>
                          <Chip titulo={m.simulado.duracao} style={e.chipCheio} />
                          <Chip titulo={m.simulado.nivel} style={e.chipCheio} />
                        </View>
                        {/* TODO: abrir o simulado */}
                        <Botao
                          titulo="Começar simulado"
                          seta
                          onPress={() => {}}
                          estiloInterno={{ paddingVertical: 13, paddingHorizontal: 15 }}
                          estiloTexto={{ fontSize: 13 }}
                        />
                      </Caixa>

                      <Contorno style={{ gap: 7, padding: 12 }}>
                        <Text style={txt.lbl}>DE ONDE VIERAM</Text>
                        <Text style={[txt.tx, { fontSize: 10.5, lineHeight: 16.3 }]}>
                          Banco oficial ENEM, FUVEST e UNESP. Nenhuma questão foi inventada — eu apenas selecionei e ordenei.
                        </Text>
                      </Contorno>

                      {i === mensagens.length - 1 && (
                        <View style={[tela.linha, { gap: 6, flexWrap: 'wrap' }]}>
                          {REFINOS.map((r) => (
                            <Chip key={r} titulo={r} onPress={() => enviar(r)} />
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </View>
              ),
            )
          )}

          {noLimite && (
            <Contorno style={{ gap: 4, padding: 12, borderColor: 'rgba(255,122,89,0.28)' }}>
              <Text style={e.assunto}>Você usou todos os pedidos de hoje.</Text>
              <Text style={[txt.tx, { fontSize: 10.5, lineHeight: 16.3 }]}>Renova às 00:00. Praticar questões e seguir a trilha continua ilimitado.</Text>
            </Contorno>
          )}
        </ScrollView>

        <View style={e.rodape}>
          <View style={[tela.linha, { gap: 6 }]}>
            {anexo && (
              <Chip titulo={anexo} style={{ borderColor: 'rgba(201,182,255,0.3)' }} estiloTexto={{ color: COR.lilas }} onPress={() => setAnexo(null)}>
                <Icone nome="arquivo" tam={11} cor={COR.lilas} espessura={2} />
              </Chip>
            )}
            {/* TODO: escolher anexo */}
            <Chip titulo="+ anexo" onPress={() => {}} />
            <Pressable onPress={() => router.push('/limite')} style={e.verLimite} hitSlop={6}>
              <Text style={e.verLimiteTexto}>Ver limite de uso</Text>
            </Pressable>
          </View>

          <View style={[e.campo, noLimite && { opacity: 0.45 }]}>
            <TextInput
              style={e.campoTexto}
              value={texto}
              onChangeText={setTexto}
              placeholder={mensagens.length === 0 ? 'Escreva seu pedido…' : 'Refinar pedido…'}
              placeholderTextColor={COR.apagado}
              onSubmitEditing={() => enviar()}
              returnKeyType="send"
              editable={!noLimite}
            />
            {/* TODO: gravar audio */}
            <Pressable onPress={() => {}} hitSlop={8}>
              <Icone nome="mic" tam={18} cor={COR.lilas} />
            </Pressable>
            <Enviar tam={30} icone={14} onPress={() => enviar()} />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  simuladoTitulo: { color: COR.tinta, fontSize: 14, fontFamily: F.b },
  assunto: { color: COR.tinta, fontSize: 11, fontFamily: F.m },
  chipCheio: { backgroundColor: 'rgba(255,255,255,0.07)' },
  rodape: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 14, gap: 10 },
  verLimite: { marginLeft: 'auto', paddingVertical: 6, paddingHorizontal: 11, borderRadius: 99, backgroundColor: COR.superficie },
  verLimiteTexto: { color: COR.lilas, fontSize: 10.5, fontFamily: F.b },
  campo: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: COR.linha, backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 99, paddingLeft: 15, paddingRight: 8, height: 50,
  },
  campoTexto: { flex: 1, color: COR.tinta, fontSize: 12.5, fontFamily: F.r },
});