import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COR, F, GRAD, txt, tela, Fundo, Cabecalho } from '../../../components/TutoriaUI';
import { useMensagem } from '../../../components/CaixaMensagem';

const EMAIL_EQUIPE = 'tutoria.project.sptech@gmail.com';
const ASSUNTO = 'Privacidade – TutorIA';

const DADOS = [
  { titulo: 'Conta', texto: 'Nome, e-mail e senha criptografada, para você entrar no app.' },
  { titulo: 'Respostas às questões', texto: 'Acerto, tempo e data, para estimar seu domínio em cada assunto.' },
  { titulo: 'Rotina e objetivo', texto: 'Curso, data da prova e dias de estudo, para montar a trilha do dia.' },
  { titulo: 'Pedidos ao Tuti', texto: 'O texto do pedido, para gerar a resposta e controlar o limite diário.' },
];

const DIREITOS = ['Acessar seus dados', 'Corrigir', 'Pedir exclusão', 'Revogar consentimento'];

export default function PrivacidadeScreen() {
  const { mostrarMensagem } = useMensagem();

  const falarComEquipe = async () => {
    const url = `mailto:${EMAIL_EQUIPE}?subject=${encodeURIComponent(ASSUNTO)}`;
    try {
      await Linking.openURL(url);
    } catch {
      mostrarMensagem({
        tipo: 'info',
        titulo: 'Fale com a equipe',
        mensagem: `Envie um e-mail para ${EMAIL_EQUIPE} com o assunto "${ASSUNTO}".`,
      });
    }
  };

  return (
    <SafeAreaView style={tela.raiz} edges={['top']}>
      <StatusBar style="light" />
      <Fundo glow />
      <Cabecalho titulo="Privacidade e dados" voltar />

      <ScrollView contentContainerStyle={[tela.corpo, { paddingBottom: 20, gap: 10 }]} showsVerticalScrollIndicator={false}>
        <View style={[tela.linha, { gap: 12 }]}>
          <LinearGradient colors={GRAD.k} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={e.selo}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#00302A" />
          </LinearGradient>
          <Text style={e.intro}>
            Seus dados servem só para montar o seu estudo. Não vendemos nem compartilhamos com terceiros.
          </Text>
        </View>

        <Text style={[e.rotulo, { marginTop: 4 }]}>O QUE GUARDAMOS E POR QUÊ</Text>
        <View style={e.cartao}>
          {DADOS.map((d, i) => (
            <View key={d.titulo} style={[e.item, i > 0 && e.divisor]}>
              <Text style={e.itemTitulo}>{d.titulo}</Text>
              <Text style={e.itemTexto}>{d.texto}</Text>
            </View>
          ))}
        </View>

        <Text style={[e.rotulo, { marginTop: 4 }]}>SEUS DIREITOS (LGPD)</Text>
        <View style={e.chips}>
          {DIREITOS.map((d) => (
            <View key={d} style={e.chip}>
              <Text style={e.chipTexto}>{d}</Text>
            </View>
          ))}
        </View>
        <Text style={e.itemTexto}>Para qualquer um desses pedidos, fale com a equipe pelo e-mail abaixo.</Text>

        <Pressable onPress={falarComEquipe} style={({ pressed }) => [e.contato, pressed && { opacity: 0.85 }]}>
          <Ionicons name="mail-outline" size={17} color={COR.lilas} />
          <View style={{ flex: 1 }}>
            <Text style={e.itemTitulo}>Falar com a equipe</Text>
            <Text style={e.itemTexto}>{EMAIL_EQUIPE}</Text>
          </View>
          <Ionicons name="arrow-forward" size={15} color={COR.lilas} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  selo: {
    width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(11,15,34,0.45)',
  },
  intro: { flex: 1, color: '#C4CBEA', fontSize: 11.5, lineHeight: 17, fontFamily: F.r },
  rotulo: { ...txt.lbl, color: '#B0B9DC' },
  cartao: { borderWidth: 2, borderColor: 'rgba(201,182,255,0.22)', backgroundColor: 'rgba(201,182,255,0.05)', borderRadius: 18 },
  item: { paddingVertical: 10, paddingHorizontal: 12, gap: 2 },
  divisor: { borderTopWidth: 1.5, borderTopColor: 'rgba(201,182,255,0.14)' },
  itemTitulo: { color: COR.tinta, fontSize: 11.5, fontFamily: F.b },
  itemTexto: { color: COR.apagado, fontSize: 10.5, lineHeight: 15.5, fontFamily: F.r },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: 99, borderWidth: 1.5, borderColor: 'rgba(111,227,192,0.34)',
    backgroundColor: 'rgba(111,227,192,0.08)', paddingVertical: 6, paddingHorizontal: 10,
  },
  chipTexto: { color: '#A7F0D8', fontSize: 10.5, fontFamily: F.sb },
  contato: {
    flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 8, minHeight: 56,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16,
    borderWidth: 2, borderColor: 'rgba(201,182,255,0.3)', backgroundColor: 'rgba(201,182,255,0.08)',
  },
});
