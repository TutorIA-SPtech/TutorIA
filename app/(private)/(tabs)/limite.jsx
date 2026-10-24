import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import {
  COR, F, GRAD, txt, tela, Fundo, Cabecalho, Anel, Barra, Caixa, Contorno, Check, BotaoContorno,
} from '../../../components/TutoriaUI';
import { ApiError } from '../../../services/apiClient';
import { getAiUsage } from '../../../services/aiUsageApi';

// Ordem e rótulos das categorias que o back devolve em /me/ai-usage
const CATEGORIAS = [
  { categoria: 'EXPLANATION', nome: 'Explicações geradas' },
  { categoria: 'MATERIAL_READING', nome: 'Leituras de material' },
  { categoria: 'FREE_REQUEST', nome: 'Pedidos livres à IA' },
  { categoria: 'PLAN_REVISION', nome: 'Replanejamentos' },
];

function montarUsos(categorias = []) {
  return CATEGORIAS.map(({ categoria, nome }) => {
    const cota = categorias.find((c) => c.category === categoria);
    return { nome, usado: cota?.used ?? 0, total: cota?.limit ?? 0 };
  });
}

export default function LimiteScreen() {
  const [usos, setUsos] = useState(null);
  const [erro, setErro] = useState('');

  // Recarrega ao focar: o uso muda sempre que o aluno usa a IA em outra tela.
  useFocusEffect(
    useCallback(() => {
      let montado = true;

      getAiUsage()
        .then((uso) => {
          if (!montado) return;
          setUsos(montarUsos(uso?.categories));
          setErro('');
        })
        .catch((error) => {
          if (montado) {
            setErro(error instanceof ApiError ? error.message : 'Não foi possível carregar seu uso da IA.');
          }
        });

      return () => {
        montado = false;
      };
    }, []),
  );

  const usadoNoDia = usos?.reduce((soma, uso) => soma + uso.usado, 0) ?? 0;
  const totalDoDia = usos?.reduce((soma, uso) => soma + uso.total, 0) ?? 0;
  const usoDoDia = totalDoDia > 0 ? Math.round((usadoNoDia / totalDoDia) * 100) : 0;

  return (
    <SafeAreaView style={tela.raiz}>
      <StatusBar style="light" />
      <Fundo />
      <Cabecalho titulo="Uso da IA hoje" voltar />

      <ScrollView contentContainerStyle={tela.corpo}>
        {erro ? <Text style={e.erro}>{erro}</Text> : null}

        {!usos && !erro ? <ActivityIndicator color={COR.roxo} style={{ marginTop: 24 }} /> : null}

        {usos && (
          <>
            <Caixa tipo="cards" style={e.resumo}>
              <Anel tam={72} caixa={72} raio={30} espessura={7} pct={usoDoDia} cores={GRAD.s} texto={`${usoDoDia}%`} fonte={17} />
              <View style={{ flex: 1 }}>
                <Text style={e.resumoTitulo}>Você usou {usoDoDia}% do seu dia</Text>
                <Text style={[txt.tx, { fontSize: 11, lineHeight: 17, marginTop: 4, color: COR.tinta }]}>Renova às 00:00</Text>
              </View>
            </Caixa>

            <Text style={txt.tx}>O limite existe para manter o app sustentável e evitar abuso — não para te frear no estudo.</Text>

            <View style={{ gap: 9 }}>
              {usos.map((uso) => {
                const pct = uso.total > 0 ? Math.round((uso.usado / uso.total) * 100) : 0;
                const perto = pct >= 80; // perto do limite fica coral
                return (
                  <Contorno key={uso.nome} style={e.item}>
                    <Text style={e.itemNome}>{uso.nome}</Text>
                    <Barra pct={pct} cor={perto ? 's' : 'p'} altura={5} largura={44} />
                    <Text style={[txt.mn, { fontSize: 10.5, color: perto ? COR.coral : COR.apagado }]}>
                      {uso.usado}/{uso.total}
                    </Text>
                  </Contorno>
                );
              })}
            </View>

            <Caixa tipo="cardk" style={e.ilimitado}>
              <Check tam={20} />
              <Text style={e.ilimitadoTexto}>Praticar questões e seguir a trilha é ilimitado.</Text>
            </Caixa>
          </>
        )}

        <BotaoContorno titulo="Entender os limites" style={e.entender} onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  resumo: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  resumoTitulo: { color: COR.tinta, fontSize: 14, lineHeight: 18.2, fontFamily: F.b },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  itemNome: { flex: 1, color: COR.tinta, fontSize: 11.5, fontFamily: F.m },
  ilimitado: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  ilimitadoTexto: { flex: 1, color: COR.tinta, fontSize: 11.5, lineHeight: 16.1, fontFamily: F.m },
  entender: { marginTop: 'auto', marginBottom: 24 },
  erro: { color: COR.coral, fontSize: 12.5, fontFamily: F.sb },
});