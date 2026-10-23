import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import {
  COR, F, GRAD, txt, tela, Fundo, Cabecalho, Anel, Caixa, Contorno, Barra, IconeCaixa, Chama, Alerta,
  Botao, BotaoContorno,
} from '../../../components/TutoriaUI';

const DIAS_ATE_A_PROVA = 75;
const RESUMO = { dominio: 59, ganho30dias: 11, sequencia: 12, melhorSequencia: 18 };
const AREAS = [
  { nome: 'Matemática', pct: 64, subindo: true, cor: COR.roxo, barra: 'p', corValor: COR.menta },
  { nome: 'Linguagens', pct: 73, subindo: true, cor: COR.menta, barra: 'k', corValor: COR.menta },
  { nome: 'Natureza', pct: 41, subindo: false, cor: COR.coral, barra: 's', corValor: COR.coral },
  { nome: 'Humanas', pct: 57, subindo: true, cor: COR.ambar, barra: 'w', corValor: COR.ambar },
];
const CHANCE = {
  pct: 62,
  curso: 'Engenharia Civil · UFPE',
  ateData: '08/11',
  projecao: 698,
  corte: 712,
  barraProjecao: 70,
  barraCorte: 75,
  areaMaisBarata: 'Natureza',
};
const ALAVANCAS = [
  { texto: 'Natureza de 41% → 55%', pontos: 9, cor: COR.coral, destaque: true },
  { texto: 'Redação de 780 → 880', pontos: 5, cor: COR.ambar, destaque: false },
];

export default function ProgressoScreen() {
  const faltam = CHANCE.corte - CHANCE.projecao;

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow />
      <Cabecalho titulo="Seu progresso" selo={`${DIAS_ATE_A_PROVA} dias`} />

      <ScrollView contentContainerStyle={[tela.corpo, { paddingBottom: 18 }]}>
        <View style={[tela.linha, { gap: 9 }]}>
          <Caixa tipo="cardp" style={e.numero}>
            <Text style={e.numeroValor}>{RESUMO.dominio}%</Text>
            <Text style={[txt.lbl, { color: COR.lilas }]}>DOMÍNIO</Text>
          </Caixa>
          <Caixa tipo="cardk" style={e.numero}>
            <Text style={e.numeroValor}>+{RESUMO.ganho30dias}</Text>
            <Text style={[txt.lbl, { color: COR.menta }]}>EM 30 DIAS</Text>
          </Caixa>
          <Caixa tipo="cardw" style={e.numero}>
            <Text style={e.numeroValor}>{RESUMO.sequencia}</Text>
            <Text style={[txt.lbl, { color: COR.ambar }]}>SEQUÊNCIA</Text>
          </Caixa>
        </View>

        <Caixa tipo="card" style={{ gap: 11, padding: 14 }}>
          <View style={tela.linha}>
            <Text style={txt.lbl}>EVOLUÇÃO SEMANAL</Text>
            <Text style={[txt.mn, { marginLeft: 'auto', fontSize: 10, color: COR.menta }]}>↑ estável</Text>
          </View>
          <Svg width="100%" height={84} viewBox="0 0 240 84">
            <Defs>
              <SvgGradient id="linhaG" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#C9B6FF" />
                <Stop offset="1" stopColor="#8E9BFF" />
              </SvgGradient>
            </Defs>
            <Path d="M4 70h232" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
            <Path d="M4 40h232" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="3 4" />
            <Path
              d="M4 62 L42 58 L80 48 L118 50 L156 36 L194 28 L232 20"
              fill="none" stroke="url(#linhaG)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            />
            <Circle cx="232" cy="20" r="5" fill="#C9B6FF" />
            <Circle cx="156" cy="36" r="3.5" fill="#6FE3C0" />
          </Svg>
          <View style={[tela.linha, { justifyContent: 'space-between' }]}>
            {['SEM 1', 'SEM 4', 'SEM 7'].map((s) => (
              <Text key={s} style={[txt.mn, { fontSize: 8.5, color: COR.apagado }]}>{s}</Text>
            ))}
          </View>
        </Caixa>

        <Text style={txt.lbl}>POR ÁREA</Text>

        <View style={{ gap: 10 }}>
          {AREAS.map((a) => (
            <View key={a.nome}>
              <View style={tela.linha}>
                <View style={[e.ponto, { backgroundColor: a.cor }]} />
                <Text style={e.areaNome}>{a.nome}</Text>
                <Text style={[txt.mn, { marginLeft: 'auto', fontSize: 10.5, color: a.corValor }]}>
                  {a.pct}% {a.subindo ? '↑' : '↓'}
                </Text>
              </View>
              <Barra pct={a.pct} cor={a.barra} altura={7} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>

        <Contorno style={e.sequencia}>
          <IconeCaixa tam={30} raio={11} fundo="rgba(255,201,120,0.16)">
            <Chama />
          </IconeCaixa>
          <View style={{ flex: 1 }}>
            <Text style={e.sequenciaTitulo}>{RESUMO.sequencia} dias seguidos</Text>
            <Text style={[txt.tx, { fontSize: 10, lineHeight: 15.5 }]}>Melhor sequência: {RESUMO.melhorSequencia} dias</Text>
          </View>
        </Contorno>

        <Text style={[txt.lbl, { marginTop: 8 }]}>CHANCES DE INGRESSO</Text>

        <Caixa tipo="cardp" style={e.topo}>
          <Anel tam={62} caixa={78} raio={32} espessura={8} pct={CHANCE.pct} cores={GRAD.k} texto={`${CHANCE.pct}%`} fonte={15} />
          <View style={{ flex: 1 }}>
            <Text style={e.curso}>{CHANCE.curso}</Text>
            <Text style={[txt.tx, { fontSize: 10.5, lineHeight: 16.3, marginTop: 3, color: COR.tinta }]}>
              Estimativa mantendo o ritmo atual até {CHANCE.ateData}
            </Text>
          </View>
        </Caixa>

        <Caixa tipo="card" style={{ gap: 8, padding: 13 }}>
          <View style={tela.linha}>
            <Text style={txt.lbl}>NOTA PROJETADA</Text>
            <Text style={[e.projecao, { marginLeft: 'auto' }]}>{CHANCE.projecao}</Text>
          </View>
          <View style={e.trilho}>
            <LinearGradient
              colors={GRAD.p} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
              style={[e.preenchido, { width: `${CHANCE.barraProjecao}%` }]}
            />
            <View style={[e.corte, { left: `${CHANCE.barraCorte}%` }]} />
          </View>
          <View style={tela.linha}>
            <Text style={[txt.mn, { fontSize: 9.5, color: COR.roxo }]}>projeção {CHANCE.projecao}</Text>
            <Text style={[txt.mn, { marginLeft: 'auto', fontSize: 9.5, color: COR.ambar }]}>corte {CHANCE.corte}</Text>
          </View>
          <Text style={[txt.tx, { fontSize: 10.5, lineHeight: 16.3 }]}>
            Faltam {faltam} pontos — mais baratos em {CHANCE.areaMaisBarata}.
          </Text>
        </Caixa>

        <Text style={txt.lbl}>O QUE MAIS MOVE SUA CHANCE</Text>

        <View style={{ gap: 9 }}>
          {ALAVANCAS.map((a) => (
            <Contorno key={a.texto} style={[e.alavanca, a.destaque && { borderColor: 'rgba(255,122,89,0.28)' }]}>
              <View style={[e.ponto, { backgroundColor: a.cor }]} />
              <Text style={e.alavancaTexto}>{a.texto}</Text>
              <Text style={[txt.mn, { fontSize: 10.5, color: COR.menta }]}>+{a.pontos} pts</Text>
            </Contorno>
          ))}
        </View>

        <Caixa tipo="cards" style={{ gap: 6, padding: 12 }}>
          <View style={tela.linha}>
            <IconeCaixa tam={22} raio={8} fundo="rgba(255,122,89,0.2)">
              <Alerta />
            </IconeCaixa>
            <Text style={[txt.lbl, { color: COR.coral }]}>É UMA ESTIMATIVA</Text>
          </View>
          <Text style={e.ressalva}>
            Calculada sobre as notas de corte de 2023–2025 e seu desempenho aqui. Não é previsão nem garantia de vaga.
          </Text>
        </Caixa>

        <View style={[tela.linha, { gap: 9 }]}>
          {/* TODO: voltar para a escolha de curso */}
          <BotaoContorno titulo="Trocar curso" style={e.botao} onPress={() => {}} />
          {/* TODO: replanejar a trilha com foco na area */}
          <Botao
            titulo={`Focar em ${CHANCE.areaMaisBarata}`}
            style={{ flex: 1 }}
            estiloInterno={e.botao}
            estiloTexto={{ fontSize: 12.5 }}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  numero: { flex: 1, gap: 3, padding: 13 },
  numeroValor: { color: COR.tinta, fontSize: 22, fontFamily: F.b },
  ponto: { width: 8, height: 8, borderRadius: 3 },
  areaNome: { color: COR.tinta, fontSize: 11.5, fontFamily: F.sb, marginLeft: 7 },
  sequencia: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12 },
  sequenciaTitulo: { color: COR.tinta, fontSize: 11.5, fontFamily: F.b },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13 },
  curso: { color: COR.tinta, fontSize: 13.5, lineHeight: 17.6, fontFamily: F.b },
  projecao: { color: COR.roxo, fontSize: 15, fontFamily: F.b },
  trilho: { height: 10, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 6 },
  preenchido: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 99 },
  corte: { position: 'absolute', top: -6, bottom: -6, width: 2, backgroundColor: COR.ambar },
  alavanca: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  alavancaTexto: { flex: 1, color: COR.tinta, fontSize: 11.5, fontFamily: F.m },
  ressalva: { color: COR.tinta, fontSize: 10.5, lineHeight: 14.7, fontFamily: F.m },
  botao: { flex: 1, paddingVertical: 12, paddingHorizontal: 14 },
});