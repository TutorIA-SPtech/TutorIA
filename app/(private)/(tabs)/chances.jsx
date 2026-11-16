import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import {
  COR, F, GRAD, txt, tela, Fundo, Cabecalho, Caixa, Contorno, IconeCaixa, Alerta, Anel,
} from '../../../components/TutoriaUI';
import { ApiError } from '../../../services/apiClient';
import { getAdmissionChance } from '../../../services/progressApi';

const CORES_AREA = [
  { trecho: 'matem', cor: COR.roxo },
  { trecho: 'lingua', cor: COR.menta },
  { trecho: 'natureza', cor: COR.coral },
  { trecho: 'human', cor: COR.ambar },
];

function corDaArea(nome) {
  const n = (nome ?? '').toLowerCase();
  return CORES_AREA.find((c) => n.includes(c.trecho))?.cor ?? COR.lilas;
}

function nomeCurto(nome) {
  const n = (nome ?? '').toLowerCase();
  if (n.includes('natureza')) return 'Natureza';
  if (n.includes('human')) return 'Humanas';
  if (n.includes('lingua')) return 'Linguagens';
  if (n.includes('matem')) return 'Matemática';
  return nome;
}

function dataCurta(data) {
  if (!data) return '';
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

// Escala da barra centrada no corte (corte fica a 75%, como no protótipo).
function posicao(nota, corte) {
  const min = corte - 210;
  const max = corte + 70;
  return Math.min(100, Math.max(0, ((nota - min) / (max - min)) * 100));
}

export default function ChancesScreen() {
  const [dados, setDados] = useState(undefined); // undefined = carregando, null = sem dados
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      let montado = true;
      getAdmissionChance()
        .then((d) => {
          if (!montado) return;
          setDados(d);
          setErro('');
        })
        .catch((error) => {
          if (!montado) return;
          setDados(null);
          setErro(error instanceof ApiError ? error.message : 'Não foi possível carregar sua estimativa.');
        });
      return () => {
        montado = false;
      };
    }, []),
  );

  const pct = dados ? Math.round(dados.probability * 100) : 0;
  const faltam = dados ? Math.max(0, dados.cutoffScore - dados.projectedScore) : 0;
  const principal = dados?.levers?.[0];

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow />
      <Cabecalho titulo="Chances de ingresso" voltar />

      {dados === undefined ? (
        <ActivityIndicator color={COR.roxo} style={{ marginTop: 32 }} />
      ) : !dados ? (
        <View style={[tela.corpo, { paddingTop: 12 }]}>
          <Text style={[txt.tx, { fontSize: 12 }]}>
            {erro || 'Escolha um curso e responda o diagnóstico para ver sua estimativa de ingresso.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[tela.corpo, { paddingBottom: 22, gap: 15 }]} showsVerticalScrollIndicator={false}>
          <Caixa tipo="cardp" style={e.topo}>
            <Anel tam={76} caixa={78} raio={32} espessura={8} pct={pct} cores={GRAD.k} texto={`${pct}%`} fonte={19} />
            <View style={{ flex: 1 }}>
              <Text style={e.curso}>
                {dados.course?.name}{dados.course?.institutionName ? ` · ${dados.course.institutionName}` : ''}
              </Text>
              <Text style={e.sub}>
                Estimativa mantendo o ritmo atual{dados.examDate ? ` até ${dataCurta(dados.examDate)}` : ''}
              </Text>
            </View>
          </Caixa>

          <Caixa tipo="card" style={{ gap: 11, padding: 16 }}>
            <View style={tela.linha}>
              <Text style={[txt.lbl, e.rotulo]}>NOTA PROJETADA</Text>
              <Text style={e.nota}>{dados.projectedScore}</Text>
            </View>
            <View style={e.trilho}>
              <LinearGradient
                colors={GRAD.p} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                style={[e.preenchido, { width: `${posicao(dados.projectedScore, dados.cutoffScore)}%` }]}
              />
              <View style={[e.corte, { left: `${posicao(dados.cutoffScore, dados.cutoffScore)}%` }]} />
            </View>
            <View style={tela.linha}>
              <Text style={[txt.mn, { fontSize: 11.5, color: COR.roxo }]}>projeção {dados.projectedScore}</Text>
              <Text style={[txt.mn, { fontSize: 11.5, color: COR.ambar, marginLeft: 'auto' }]}>corte {dados.cutoffScore}</Text>
            </View>
            <Text style={e.sub}>
              {faltam > 0
                ? `Faltam ${faltam} pontos${principal ? `. Foque em ${nomeCurto(principal.areaName)} para ter mais chances` : ''}.`
                : 'Sua projeção já passa a nota de corte. Mantenha o ritmo.'}
            </Text>
          </Caixa>

          {dados.levers?.length > 0 && (
            <>
              <Text style={[txt.lbl, e.rotulo]}>O QUE MAIS MOVE SUA CHANCE</Text>
              <View style={{ gap: 11 }}>
                {dados.levers.map((a, i) => (
                  <Contorno
                    key={a.areaName}
                    style={[e.alavanca, i === 0 && { borderColor: 'rgba(255,122,89,0.28)' }]}
                  >
                    <View style={[e.ponto, { backgroundColor: corDaArea(a.areaName) }]} />
                    <Text style={e.alavancaTexto}>
                      {nomeCurto(a.areaName)} de {Math.round(a.from * 100)}% → {Math.round(a.to * 100)}%
                    </Text>
                    <Text style={[txt.mn, { fontSize: 12.5, color: COR.menta }]}>+{a.points} pts</Text>
                  </Contorno>
                ))}
              </View>
            </>
          )}

          <Caixa tipo="cards" style={{ gap: 8, padding: 15 }}>
            <View style={[tela.linha, { gap: 9 }]}>
              <IconeCaixa tam={26} raio={9} fundo="rgba(255,122,89,0.2)">
                <Alerta tam={14} />
              </IconeCaixa>
              <Text style={[txt.lbl, e.rotulo, { color: COR.coral }]}>É UMA ESTIMATIVA</Text>
            </View>
            <Text style={e.avisoTexto}>
              Calculada sobre as notas de corte {dados.cutoffYears ? `de ${dados.cutoffYears} ` : ''}e seu desempenho aqui. Não é previsão nem garantia de vaga.
            </Text>
          </Caixa>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  rotulo: { fontSize: 10.5, letterSpacing: 1 },
  sub: { color: COR.apagado, fontSize: 12.5, lineHeight: 18, fontFamily: F.r, marginTop: 3 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 16 },
  curso: { color: COR.tinta, fontSize: 16, lineHeight: 20, fontFamily: F.b },
  nota: { marginLeft: 'auto', color: COR.roxo, fontSize: 18, fontFamily: F.monoB },
  trilho: { height: 12, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.07)' },
  preenchido: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 99 },
  corte: { position: 'absolute', top: -7, bottom: -7, width: 2.5, marginLeft: -1, backgroundColor: COR.ambar },
  alavanca: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, paddingHorizontal: 15 },
  ponto: { width: 10, height: 10, borderRadius: 4 },
  alavancaTexto: { flex: 1, color: COR.tinta, fontSize: 14, fontFamily: F.m },
  avisoTexto: { color: COR.tinta, fontSize: 12.5, lineHeight: 18, fontFamily: F.m },
});
