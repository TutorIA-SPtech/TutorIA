import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  COR, F, GRAD, txt, tela, Fundo, Cabecalho, Anel, Barra, Caixa, Contorno, Check, BotaoContorno,
} from '../../../components/TutoriaUI';

const USO_DO_DIA = 80;
const USOS = [
  { nome: 'Explicações geradas', usado: 12, total: 15 },
  { nome: 'Leituras de material', usado: 4, total: 5 },
  { nome: 'Pedidos livres à IA', usado: 3, total: 8 },
  { nome: 'Replanejamentos', usado: 1, total: 2 },
];

export default function LimiteScreen() {
  return (
    <SafeAreaView style={tela.raiz}>
      <StatusBar style="light" />
      <Fundo />
      <Cabecalho titulo="Uso da IA hoje" voltar />

      <ScrollView contentContainerStyle={tela.corpo}>
        <Caixa tipo="cards" style={e.resumo}>
          <Anel tam={72} caixa={72} raio={30} espessura={7} pct={USO_DO_DIA} cores={GRAD.s} texto={`${USO_DO_DIA}%`} fonte={17} />
          <View style={{ flex: 1 }}>
            <Text style={e.resumoTitulo}>Você usou {USO_DO_DIA}% do seu dia</Text>
            <Text style={[txt.tx, { fontSize: 11, lineHeight: 17, marginTop: 4, color: COR.tinta }]}>Renova às 00:00</Text>
          </View>
        </Caixa>

        <Text style={txt.tx}>O limite existe para manter o app sustentável e evitar abuso — não para te frear no estudo.</Text>

        <View style={{ gap: 9 }}>
          {USOS.map((uso) => {
            const pct = Math.round((uso.usado / uso.total) * 100);
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
});