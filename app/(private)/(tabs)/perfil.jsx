import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { COR, F, GRAD, txt, tela, Fundo, Cabecalho } from '../../../components/TutoriaUI';
import { useMensagem } from '../../../components/CaixaMensagem';
import { useLogout } from '../../../hooks/useLogout';
import { getAccount } from '../../../services/accountApi';
import { requestPasswordRecovery } from '../../../services/authApi';
import { ApiError } from '../../../services/apiClient';
import { getAiUsage } from '../../../services/aiUsageApi';
import { getMastery, getProgress } from '../../../services/progressApi';
import { getStudyProfile } from '../../../services/studyProfileApi';
import { getStoredReminder } from '../../../services/reminderStorage';

const DIAS = [
  { letra: 'S', api: 'MONDAY' },
  { letra: 'T', api: 'TUESDAY' },
  { letra: 'Q', api: 'WEDNESDAY' },
  { letra: 'Q', api: 'THURSDAY' },
  { letra: 'S', api: 'FRIDAY' },
  { letra: 'S', api: 'SATURDAY' },
  { letra: 'D', api: 'SUNDAY' },
];

function iniciais(nome) {
  const partes = (nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

function primeiroNome(nome) {
  return (nome ?? '').trim().split(/\s+/)[0] || '';
}

function diasAte(data) {
  if (!data) return null;
  const [ano, mes, dia] = data.split('-').map(Number);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Math.round((new Date(ano, mes - 1, dia) - hoje) / 86400000);
  return dias >= 0 ? dias : null;
}

function dataCurta(data) {
  if (!data) return '';
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

function minutosTexto(min) {
  if (!min) return '—';
  if (min < 60) return `${min} min por dia`;
  const h = min / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)} h por dia`;
}

function dominioGeral(dominio) {
  const assuntos = (dominio?.areas ?? []).flatMap((a) => a.subjects ?? []);
  if (assuntos.length === 0) return null;
  return Math.round((assuntos.reduce((t, a) => t + a.probability, 0) / assuntos.length) * 100);
}

// Cada chamada é independente: se uma falhar, o resto da tela aparece.
async function carregarTudo() {
  const [conta, perfil, progresso, dominio, uso, lembrete] = await Promise.allSettled([
    getAccount(), getStudyProfile(), getProgress(), getMastery(), getAiUsage(), getStoredReminder(),
  ]);
  const valor = (r) => (r.status === 'fulfilled' ? r.value : null);
  const pedidos = valor(uso)?.categories?.find((c) => c.category === 'FREE_REQUEST');
  return {
    conta: valor(conta) ?? { name: '', nickname: null, email: '' },
    perfil: valor(perfil),
    sequencia: valor(progresso)?.currentStreakDays ?? null,
    dominio: dominioGeral(valor(dominio)),
    cota: pedidos ? { usados: pedidos.used, limite: pedidos.limit } : null,
    lembrete: valor(lembrete),
  };
}

export default function PerfilScreen() {
  const [dados, setDados] = useState(null);
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const { confirmarSaida } = useLogout();
  const { mostrarMensagem, confirmar } = useMensagem();

  useFocusEffect(
    useCallback(() => {
      let montado = true;
      carregarTudo().then((d) => montado && setDados(d));
      return () => {
        montado = false;
      };
    }, []),
  );

  const alterarSenha = async () => {
    const email = dados?.conta?.email;
    if (!email) {
      router.push('/recover-password');
      return;
    }
    const ok = await confirmar({
      tipo: 'info',
      titulo: 'Alterar senha',
      mensagem: `Vamos enviar um código de 6 dígitos para ${email}.`,
      textoConfirmar: 'Enviar código',
    });
    if (!ok) return;

    setEnviandoCodigo(true);
    try {
      await requestPasswordRecovery(email);
      router.push({ pathname: '/verify-code', params: { email, origem: 'perfil' } });
    } catch (error) {
      mostrarMensagem({
        tipo: 'erro',
        titulo: 'Não foi possível enviar o código',
        mensagem: error instanceof ApiError ? error.message : 'Tente novamente.',
      });
    } finally {
      setEnviandoCodigo(false);
    }
  };

  const conta = dados?.conta;
  const saudacao = conta?.nickname || primeiroNome(conta?.name) || 'estudante';
  const perfil = dados?.perfil;
  const faltam = diasAte(perfil?.examDate);

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow />
      <Cabecalho titulo="Perfil" />

      {!dados ? (
        <ActivityIndicator color={COR.roxo} style={{ marginTop: 32 }} />
      ) : (
        <ScrollView contentContainerStyle={[tela.corpo, { paddingBottom: 24, gap: 10 }]} showsVerticalScrollIndicator={false}>
          {/* Saudação */}
          <View style={e.topo}>
            <LinearGradient colors={['#C9B6FF', '#FF7A59', '#FFC978']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={e.anel}>
              <View style={e.avatar}>
                <Text style={e.avatarTexto}>{iniciais(conta?.name || saudacao)}</Text>
              </View>
            </LinearGradient>
            <Text style={e.ola}>Olá, <Text style={{ color: COR.lilas }}>{saudacao}</Text></Text>
            {conta?.email ? <Text style={e.email}>{conta.email}</Text> : null}
          </View>

          {/* Objetivo */}
          {perfil?.targetCourse ? (
            <LinearGradient colors={['#C9B6FF', '#9DA9FF']} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={e.objetivo}>
              <Text style={[e.rotulo, { color: '#3D2F7A' }]}>MEU OBJETIVO</Text>
              <Text style={e.objetivoCurso}>
                {perfil.targetCourse.name}{perfil.targetCourse.institutionName ? ` · ${perfil.targetCourse.institutionName}` : ''}
              </Text>
              {perfil.examDate ? (
                <Text style={e.objetivoProva}>
                  Prova em {dataCurta(perfil.examDate)}{faltam != null ? ` · faltam ${faltam} dias` : ''}
                </Text>
              ) : null}
            </LinearGradient>
          ) : null}

          {/* Números */}
          <View style={[tela.linha, { gap: 9 }]}>
            <View style={[e.cartao, e.numero]}>
              <Text style={e.numeroValor}>{dados.sequencia ?? '—'}</Text>
              <Text style={e.rotulo}>SEQUÊNCIA</Text>
            </View>
            <View style={[e.cartao, e.numero]}>
              <Text style={e.numeroValor}>{dados.dominio != null ? `${dados.dominio}%` : '—'}</Text>
              <Text style={e.rotulo}>DOMÍNIO</Text>
            </View>
          </View>

          {/* Rotina */}
          <Text style={[e.rotulo, e.secao]}>ROTINA DE ESTUDO</Text>
          <View style={[e.cartao, { padding: 12, gap: 9 }]}>
            <View style={tela.linha}>
              <Text style={e.linhaTitulo}>{minutosTexto(perfil?.dailyMinutes)}</Text>
              <Pressable
                onPress={() => router.push({ pathname: '/onboarding/rotina', params: { origem: 'perfil' } })}
                hitSlop={8}
                style={{ marginLeft: 'auto' }}
              >
                <Text style={e.link}>Editar</Text>
              </Pressable>
            </View>
            <View style={[tela.linha, { gap: 5 }]}>
              {DIAS.map((d) => {
                const on = perfil?.studyDays?.includes(d.api);
                return on ? (
                  <LinearGradient key={d.api} colors={GRAD.p} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={e.dia}>
                    <Text style={[e.diaTexto, { color: COR.fundo }]}>{d.letra}</Text>
                  </LinearGradient>
                ) : (
                  <View key={d.api} style={[e.dia, e.diaOff]}>
                    <Text style={e.diaTexto}>{d.letra}</Text>
                  </View>
                );
              })}
            </View>
            <View style={[tela.linha, e.divisor, { paddingTop: 9 }]}>
              <Text style={e.linhaTexto}>Lembrete diário</Text>
              <Text style={[e.valorMono, { marginLeft: 'auto', color: dados.lembrete?.ativo ? COR.ambar : COR.apagado }]}>
                {dados.lembrete ? (dados.lembrete.ativo ? dados.lembrete.horario : 'desligado') : '—'}
              </Text>
            </View>
          </View>

          {/* Dados da conta */}
          <View style={[tela.linha, e.secao]}>
            <Text style={e.rotulo}>DADOS DA CONTA</Text>
            <Pressable onPress={() => router.push('/perfil-dados')} style={[e.pilula, { marginLeft: 'auto' }]} hitSlop={6}>
              <Ionicons name="pencil" size={11} color={COR.lilas} />
              <Text style={e.pilulaTexto}>Editar dados</Text>
            </Pressable>
          </View>
          <View style={e.cartao}>
            <Campo rotulo="NOME E SOBRENOME" valor={conta?.name || '—'} />
            <Campo rotulo="APELIDO" valor={conta?.nickname || '—'} divisor />
            <Campo rotulo="E-MAIL" valor={conta?.email || '—'} divisor />
            <View style={[e.campo, e.divisor]}>
              <View style={{ flex: 1 }}>
                <Text style={e.campoRotulo}>SENHA</Text>
                <Text style={[e.campoValor, { letterSpacing: 2 }]}>••••••••</Text>
              </View>
              <Pressable onPress={alterarSenha} disabled={enviandoCodigo} style={e.pilula} hitSlop={6}>
                {enviandoCodigo ? <ActivityIndicator size="small" color={COR.lilas} /> : <Text style={e.pilulaTexto}>Alterar</Text>}
              </Pressable>
            </View>
          </View>

          {/* Configurações */}
          <Text style={[e.rotulo, e.secao]}>CONFIGURAÇÕES</Text>
          <View style={e.cartao}>
            <Item
              icone="star-outline" cor={COR.ambar} fundo="rgba(255,201,120,0.16)"
              titulo="Limite de uso da IA"
              detalhe={dados.cota ? `${dados.cota.usados} / ${dados.cota.limite}` : null}
              onPress={() => router.push('/limite')}
            />
            <Item
              icone="shield-checkmark-outline" cor={COR.menta} fundo="rgba(111,227,192,0.14)"
              titulo="Privacidade e dados"
              onPress={() => router.push('/privacidade')}
              divisor
            />
          </View>

          <Pressable onPress={confirmarSaida} style={({ pressed }) => [e.sair, pressed && { opacity: 0.8 }]}>
            <Text style={e.sairTexto}>Sair da conta</Text>
            <Ionicons name="log-out-outline" size={16} color={COR.coral} style={{ marginLeft: 'auto' }} />
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function Campo({ rotulo, valor, divisor }) {
  return (
    <View style={[e.campo, divisor && e.divisor]}>
      <View style={{ flex: 1 }}>
        <Text style={e.campoRotulo}>{rotulo}</Text>
        <Text style={e.campoValor} numberOfLines={1}>{valor}</Text>
      </View>
    </View>
  );
}

function Item({ icone, cor, fundo, titulo, detalhe, onPress, divisor }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [e.campo, divisor && e.divisor, pressed && { backgroundColor: 'rgba(255,255,255,0.03)' }]}>
      <View style={[e.icone, { backgroundColor: fundo }]}>
        <Ionicons name={icone} size={14} color={cor} />
      </View>
      <Text style={[e.linhaTexto, { flex: 1 }]}>{titulo}</Text>
      {detalhe ? <Text style={[e.valorMono, { color: COR.apagado }]}>{detalhe}</Text> : null}
      <Ionicons name="chevron-forward" size={14} color={COR.apagado} />
    </Pressable>
  );
}

const BORDA = 'rgba(201,182,255,0.22)';
const BORDA_FINA = 'rgba(201,182,255,0.14)';

const e = StyleSheet.create({
  topo: { alignItems: 'center', gap: 6, paddingTop: 6, paddingBottom: 6 },
  anel: { width: 76, height: 76, borderRadius: 38, padding: 3, marginBottom: 4 },
  avatar: { flex: 1, borderRadius: 35, backgroundColor: '#1A2142', alignItems: 'center', justifyContent: 'center' },
  avatarTexto: { color: COR.tinta, fontSize: 24, fontFamily: F.monoB, letterSpacing: -0.4 },
  ola: { color: COR.tinta, fontSize: 21, lineHeight: 24, fontFamily: F.b, letterSpacing: -0.5 },
  email: { color: COR.apagado, fontSize: 11, fontFamily: F.r },
  rotulo: { ...txt.lbl, color: '#B0B9DC' },
  secao: { marginTop: 4 },
  cartao: { borderWidth: 2, borderColor: BORDA, backgroundColor: 'rgba(201,182,255,0.05)', borderRadius: 18 },
  objetivo: {
    borderRadius: 22, padding: 13, gap: 5, borderWidth: 2, borderColor: 'rgba(11,15,34,0.45)',
    shadowColor: COR.lilas, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.32, shadowRadius: 0, elevation: 4,
  },
  objetivoCurso: { color: '#151033', fontSize: 14, fontFamily: F.b },
  objetivoProva: { color: '#4B3D94', fontSize: 10.5, fontFamily: F.r },
  numero: { flex: 1, padding: 11, gap: 2 },
  numeroValor: { color: COR.tinta, fontSize: 19, fontFamily: F.monoB },
  linhaTitulo: { color: COR.tinta, fontSize: 11.5, fontFamily: F.sb },
  linhaTexto: { color: COR.tinta, fontSize: 11.5, fontFamily: F.m },
  valorMono: { fontSize: 10.5, fontFamily: F.monoB },
  link: { color: COR.lilas, fontSize: 10.5, fontFamily: F.b },
  dia: { width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  diaOff: { borderWidth: 1.5, borderColor: 'rgba(201,182,255,0.3)' },
  diaTexto: { color: COR.apagado, fontSize: 10, fontFamily: F.b },
  divisor: { borderTopWidth: 1.5, borderTopColor: BORDA_FINA },
  campo: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  campoRotulo: { color: COR.apagado, fontSize: 8.5, fontFamily: F.monoB, letterSpacing: 1 },
  campoValor: { color: COR.tinta, fontSize: 12, fontFamily: F.sb, marginTop: 2 },
  pilula: {
    flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 28,
    paddingHorizontal: 11, paddingVertical: 6, borderRadius: 99,
    backgroundColor: 'rgba(201,182,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(201,182,255,0.28)',
  },
  pilulaTexto: { color: COR.lilas, fontSize: 10.5, fontFamily: F.b },
  icone: { width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  sair: {
    flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingVertical: 13, paddingHorizontal: 14,
    borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,122,89,0.34)', backgroundColor: 'rgba(255,122,89,0.06)',
  },
  sairTexto: { color: COR.coral, fontSize: 12.5, fontFamily: F.b },
});
