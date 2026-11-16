import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import {
  COR, F, txt, tela, Fundo, Cabecalho, Caixa, Contorno, Barra, IconeCaixa, Chama, Anel, GRAD,
} from '../../../components/TutoriaUI';
import { ApiError } from '../../../services/apiClient';
import { getAdmissionChance, getMastery, getProgress, getWeeklyEvolution } from '../../../services/progressApi';
import { getStudyProfile } from '../../../services/studyProfileApi';

// Visual de cada área (protótipo tela 27). O back manda só o nome, então o casamento é por trecho do nome.
const VISUAL_AREAS = [
  { trecho: 'matem', cor: COR.roxo, barra: 'p' },
  { trecho: 'lingua', cor: COR.menta, barra: 'k' },
  { trecho: 'natureza', cor: COR.coral, barra: 's' },
  { trecho: 'human', cor: COR.ambar, barra: 'w' },
];

function visualDaArea(nome, indice) {
  const normalizado = nome.toLowerCase();
  return VISUAL_AREAS.find((v) => normalizado.includes(v.trecho)) ?? VISUAL_AREAS[indice % VISUAL_AREAS.length];
}

function diasAte(data) {
  if (!data) return null;
  const [ano, mes, dia] = data.split('-').map(Number);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Math.round((new Date(ano, mes - 1, dia) - hoje) / 86400000);
  return dias >= 0 ? dias : null;
}

// Mesma regra do protótipo: caindo = coral; subindo = menta (âmbar em Humanas).
function corDoPct(area) {
  if (area.delta != null && area.delta < 0) return COR.coral;
  if (area.cor === COR.ambar) return COR.ambar;
  return COR.menta;
}

function montarAreas(dominio, evolucao) {
  return (dominio?.areas ?? []).map((area, indice) => {
    const tendencia = evolucao?.areas?.find((a) => a.areaId === area.areaId || a.areaName === area.areaName);
    return {
      nome: area.areaName,
      pct: Math.round(area.averageProbability * 100),
      delta: tendencia?.delta30Days ?? null,
      ...visualDaArea(area.areaName, indice),
    };
  });
}

function dominioGeral(dominio) {
  const assuntos = (dominio?.areas ?? []).flatMap((area) => area.subjects ?? []);
  if (assuntos.length === 0) return null;
  const soma = assuntos.reduce((total, assunto) => total + assunto.probability, 0);
  return Math.round((soma / assuntos.length) * 100);
}

function seta(delta) {
  if (delta == null || Math.abs(delta) < 0.005) return '';
  return delta > 0 ? ' ↑' : ' ↓';
}

export default function ProgressoScreen() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      let montado = true;

      Promise.all([
        getProgress(),
        getMastery(),
        getStudyProfile().catch(() => null),
        getWeeklyEvolution().catch(() => null),
        getAdmissionChance().catch(() => null),
      ])
        .then(([progresso, dominio, perfil, evolucao, chance]) => {
          if (!montado) return;
          setDados({
            sequencia: progresso?.currentStreakDays ?? 0,
            melhorSequencia: progresso?.bestStreakDays ?? 0,
            areas: montarAreas(dominio, evolucao),
            dominio: dominioGeral(dominio),
            diasAteAProva: diasAte(perfil?.examDate),
            semanas: (evolucao?.weeks ?? []).map((s) => Math.round(s.averageProbability * 100)),
            ganho30: evolucao?.masteryDelta30Days != null ? Math.round(evolucao.masteryDelta30Days * 100) : null,
            chance,
          });
          setErro('');
        })
        .catch((error) => {
          if (montado) {
            setErro(error instanceof ApiError ? error.message : 'Não foi possível carregar seu progresso.');
          }
        });

      return () => {
        montado = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow />
      <Cabecalho
        titulo="Seu progresso"
        selo={dados?.diasAteAProva != null ? `${dados.diasAteAProva} dias` : undefined}
      />

      <ScrollView contentContainerStyle={[tela.corpo, { paddingBottom: 22, gap: 15 }]} showsVerticalScrollIndicator={false}>
        {erro ? <Text style={e.erro}>{erro}</Text> : null}

        {!dados && !erro ? <ActivityIndicator color={COR.roxo} style={{ marginTop: 24 }} /> : null}

        {dados && (
          <>
            <View style={[tela.linha, { gap: 9, alignItems: 'stretch' }]}>
              <Caixa tipo="cardp" style={e.numero}>
                <Text style={e.numeroValor}>{dados.dominio != null ? `${dados.dominio}%` : '—'}</Text>
                <Text style={[txt.lbl, e.rotulo, { color: COR.lilas }]}>DOMÍNIO</Text>
              </Caixa>
              <Caixa tipo="cardk" style={e.numero}>
                <Text style={e.numeroValor}>
                  {dados.ganho30 != null ? `${dados.ganho30 > 0 ? '+' : ''}${dados.ganho30}` : '—'}
                </Text>
                <Text style={[txt.lbl, e.rotulo, { color: COR.menta }]}>EM 30 DIAS</Text>
              </Caixa>
              <Caixa tipo="cardw" style={e.numero}>
                <Text style={e.numeroValor}>{dados.sequencia}</Text>
                <Text style={[txt.lbl, e.rotulo, { color: COR.ambar }]}>SEQUÊNCIA</Text>
              </Caixa>
            </View>

            <Evolucao semanas={dados.semanas} />

            <Text style={[txt.lbl, e.rotulo]}>POR ÁREA</Text>

            {dados.areas.length === 0 ? (
              <Text style={[txt.tx, { fontSize: 13, lineHeight: 19 }]}>
                Responda o diagnóstico para ver seu domínio em cada área.
              </Text>
            ) : (
              <View style={{ gap: 14 }}>
                {dados.areas.map((a) => (
                  <View key={a.nome}>
                    <View style={tela.linha}>
                      <View style={[e.ponto, { backgroundColor: a.cor }]} />
                      <Text style={e.areaNome}>{a.nome}</Text>
                      <Text style={[txt.mn, e.areaPct, { color: corDoPct(a) }]}>
                        {a.pct}%{seta(a.delta)}
                      </Text>
                    </View>
                    <Barra pct={a.pct} cor={a.barra} altura={9} style={{ marginTop: 6 }} />
                  </View>
                ))}
              </View>
            )}

            <Contorno style={e.linhaCard}>
              <IconeCaixa tam={38} raio={13} fundo="rgba(255,201,120,0.16)">
                <Chama tam={19} />
              </IconeCaixa>
              <View style={{ flex: 1 }}>
                <Text style={e.linhaTitulo}>
                  {dados.sequencia} {dados.sequencia === 1 ? 'dia seguido' : 'dias seguidos'}
                </Text>
                <Text style={e.linhaSub}>
                  Melhor sequência: {dados.melhorSequencia} {dados.melhorSequencia === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
            </Contorno>

            {dados.chance && (
              <Contorno style={e.linhaCard} onPress={() => router.push('/chances')}>
                <Anel
                  tam={38} caixa={78} raio={32} espessura={10} pct={Math.round(dados.chance.probability * 100)}
                  cores={GRAD.k} texto="" fonte={1}
                />
                <View style={{ flex: 1 }}>
                  <Text style={e.linhaTitulo}>Chances de ingresso · {Math.round(dados.chance.probability * 100)}%</Text>
                  <Text style={e.linhaSub} numberOfLines={1}>
                    {dados.chance.course?.name}{dados.chance.course?.institutionName ? ` · ${dados.chance.course.institutionName}` : ''}
                  </Text>
                </View>
                <Text style={e.seta}>→</Text>
              </Contorno>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ALTURA_GRAFICO = 110;

function Evolucao({ semanas }) {
  const [largura, setLargura] = useState(0);
  const temDados = semanas.length >= 2;

  let caminho = '';
  let pontos = [];
  let destaque = -1; // semana de maior salto: ponto menta, como no protótipo
  if (temDados && largura > 0) {
    const min = Math.max(0, Math.min(...semanas) - 8);
    const max = Math.min(100, Math.max(...semanas) + 8);
    const faixa = Math.max(1, max - min);
    pontos = semanas.map((v, i) => ({
      x: 4 + (i * (largura - 8)) / (semanas.length - 1),
      y: 10 + (1 - (v - min) / faixa) * (ALTURA_GRAFICO - 24),
    }));
    caminho = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    let maior = 0;
    for (let i = 1; i < semanas.length - 1; i += 1) {
      const salto = semanas[i] - semanas[i - 1];
      if (salto > maior) { maior = salto; destaque = i; }
    }
  }

  const diferenca = temDados ? semanas[semanas.length - 1] - semanas[0] : 0;
  const tendencia = diferenca > 1 ? { t: '↑ subindo', c: COR.menta }
    : diferenca < -1 ? { t: '↓ caindo', c: COR.coral }
      : { t: '↑ estável', c: COR.menta };
  const meio = Math.ceil(semanas.length / 2);

  return (
    <Caixa tipo="card" style={{ gap: 14, padding: 17 }}>
      <View style={tela.linha}>
        <Text style={[txt.lbl, e.rotulo]}>EVOLUÇÃO SEMANAL</Text>
        {temDados ? <Text style={[txt.mn, { marginLeft: 'auto', fontSize: 12, color: tendencia.c }]}>{tendencia.t}</Text> : null}
      </View>

      {temDados ? (
        <>
          <View style={{ height: ALTURA_GRAFICO }} onLayout={(ev) => setLargura(ev.nativeEvent.layout.width)}>
            {largura > 0 && (
              <Svg width={largura} height={ALTURA_GRAFICO}>
                <Defs>
                  <SvgGradient id="evolucaoG" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#C9B6FF" />
                    <Stop offset="1" stopColor="#8E9BFF" />
                  </SvgGradient>
                </Defs>
                <Path d={`M4 ${ALTURA_GRAFICO - 14}H${largura - 4}`} stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
                <Path d={caminho} fill="none" stroke="url(#evolucaoG)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                {destaque > 0 && <Circle cx={pontos[destaque].x} cy={pontos[destaque].y} r="4.5" fill={COR.menta} />}
                <Circle cx={pontos[pontos.length - 1].x} cy={pontos[pontos.length - 1].y} r="6" fill={COR.lilas} />
              </Svg>
            )}
          </View>
          <View style={[tela.linha, { justifyContent: 'space-between' }]}>
            <Text style={e.eixo}>SEM 1</Text>
            {semanas.length > 2 ? <Text style={e.eixo}>SEM {meio}</Text> : null}
            <Text style={e.eixo}>SEM {semanas.length}</Text>
          </View>
        </>
      ) : (
        <Text style={[txt.tx, { fontSize: 13, lineHeight: 19 }]}>
          Seu histórico aparece depois da primeira semana de estudo.
        </Text>
      )}
    </Caixa>
  );
}

const e = StyleSheet.create({
  rotulo: { fontSize: 10.5, letterSpacing: 1 },
  numero: { flex: 1, gap: 5, paddingVertical: 16, paddingHorizontal: 14 },
  numeroValor: { color: COR.tinta, fontSize: 27, fontFamily: F.b },
  eixo: { color: COR.apagado, fontSize: 10, fontFamily: F.monoB },
  ponto: { width: 10, height: 10, borderRadius: 4 },
  areaNome: { color: COR.tinta, fontSize: 14, fontFamily: F.sb, marginLeft: 8 },
  areaPct: { marginLeft: 'auto', fontSize: 12.5 },
  linhaCard: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 15, paddingHorizontal: 15 },
  linhaTitulo: { color: COR.tinta, fontSize: 14, fontFamily: F.b },
  linhaSub: { color: COR.apagado, fontSize: 12, lineHeight: 17, fontFamily: F.r, marginTop: 1 },
  seta: { color: COR.ambar, fontSize: 17, fontFamily: F.b },
  erro: { color: COR.coral, fontSize: 12.5, fontFamily: F.sb },
});
