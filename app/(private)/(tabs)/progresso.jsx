import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import {
  COR, F, txt, tela, Fundo, Cabecalho, Caixa, Contorno, Barra, IconeCaixa, Chama,
} from '../../../components/TutoriaUI';
import { ApiError } from '../../../services/apiClient';
import { getMastery, getProgress } from '../../../services/progressApi';
import { getStudyProfile } from '../../../services/studyProfileApi';

// Visual de cada área. O back manda só o nome, então o casamento é por trecho do nome.
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

// 'aaaa-mm-dd' (LocalDate do back) -> dias a partir de hoje
function diasAte(data) {
  if (!data) return null;
  const [ano, mes, dia] = data.split('-').map(Number);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Math.round((new Date(ano, mes - 1, dia) - hoje) / 86400000);
  return dias >= 0 ? dias : null;
}

function montarAreas(dominio) {
  return (dominio?.areas ?? []).map((area, indice) => ({
    nome: area.areaName,
    pct: Math.round(area.averageProbability * 100),
    ...visualDaArea(area.areaName, indice),
  }));
}

// Média sobre todos os assuntos, como o back faz no resultado do diagnóstico.
function dominioGeral(dominio) {
  const assuntos = (dominio?.areas ?? []).flatMap((area) => area.subjects ?? []);
  if (assuntos.length === 0) return null;
  const soma = assuntos.reduce((total, assunto) => total + assunto.probability, 0);
  return Math.round((soma / assuntos.length) * 100);
}

export default function ProgressoScreen() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  // Recarrega ao focar: domínio e sequência mudam a cada questão respondida.
  useFocusEffect(
    useCallback(() => {
      let montado = true;

      Promise.all([getProgress(), getMastery(), getStudyProfile()])
        .then(([progresso, dominio, perfil]) => {
          if (!montado) return;
          setDados({
            sequencia: progresso?.currentStreakDays ?? 0,
            melhorSequencia: progresso?.bestStreakDays ?? 0,
            areas: montarAreas(dominio),
            dominio: dominioGeral(dominio),
            diasAteAProva: diasAte(perfil?.examDate),
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

      <ScrollView contentContainerStyle={[tela.corpo, { paddingBottom: 18 }]}>
        {erro ? <Text style={e.erro}>{erro}</Text> : null}

        {!dados && !erro ? <ActivityIndicator color={COR.roxo} style={{ marginTop: 24 }} /> : null}

        {dados && (
          <>
            <View style={[tela.linha, { gap: 9 }]}>
              <Caixa tipo="cardp" style={e.numero}>
                <Text style={e.numeroValor}>{dados.dominio != null ? `${dados.dominio}%` : '—'}</Text>
                <Text style={[txt.lbl, { color: COR.lilas }]}>DOMÍNIO</Text>
              </Caixa>
              <Caixa tipo="cardw" style={e.numero}>
                <Text style={e.numeroValor}>{dados.sequencia}</Text>
                <Text style={[txt.lbl, { color: COR.ambar }]}>SEQUÊNCIA</Text>
              </Caixa>
            </View>

            <Text style={txt.lbl}>POR ÁREA</Text>

            {dados.areas.length === 0 ? (
              <Text style={[txt.tx, { fontSize: 11, lineHeight: 17 }]}>
                Responda o diagnóstico para ver seu domínio em cada área.
              </Text>
            ) : (
              <View style={{ gap: 10 }}>
                {dados.areas.map((a) => (
                  <View key={a.nome}>
                    <View style={tela.linha}>
                      <View style={[e.ponto, { backgroundColor: a.cor }]} />
                      <Text style={e.areaNome}>{a.nome}</Text>
                      <Text style={[txt.mn, { marginLeft: 'auto', fontSize: 10.5, color: a.cor }]}>{a.pct}%</Text>
                    </View>
                    <Barra pct={a.pct} cor={a.barra} altura={7} style={{ marginTop: 4 }} />
                  </View>
                ))}
              </View>
            )}

            <Contorno style={e.sequencia}>
              <IconeCaixa tam={30} raio={11} fundo="rgba(255,201,120,0.16)">
                <Chama />
              </IconeCaixa>
              <View style={{ flex: 1 }}>
                <Text style={e.sequenciaTitulo}>
                  {dados.sequencia} {dados.sequencia === 1 ? 'dia seguido' : 'dias seguidos'}
                </Text>
                <Text style={[txt.tx, { fontSize: 10, lineHeight: 15.5 }]}>
                  Melhor sequência: {dados.melhorSequencia} {dados.melhorSequencia === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
            </Contorno>

            {/* Evolução semanal, ganho em 30 dias, chances de ingresso, nota projetada e alavancas
                ficam fora até o back ter endpoint para esses dados. */}
          </>
        )}
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
  erro: { color: COR.coral, fontSize: 12.5, fontFamily: F.sb },
});
