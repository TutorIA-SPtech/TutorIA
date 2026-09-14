import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect, Circle, Path } from 'react-native-svg';

const COR = {
  fundo: '#0A0D14',
  tinta: '#F1F5FD',
  apagado: '#7E8BA3',
  linha: 'rgba(255,255,255,0.09)',
  roxo: '#9DA9FF',
  lilas: '#C9B6FF',
  coral: '#FF7A59',
  superficie: '#151C2B',
};

const GRADIENTE = ['#D6C6FF', '#7C8CFF'];

const AVISOS = [
  'Pode responder "não sei" — isso também é informação.',
  'Dá para pausar e retomar depois.',
  'A dificuldade se ajusta às suas respostas.',
];

function Tuti() {
  return (
    <Svg width={56} height={56} viewBox="0 0 48 48">
      <Defs>
        <SvgGradient id="gp" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C9B6FF" />
          <Stop offset="1" stopColor="#8E9BFF" />
        </SvgGradient>
      </Defs>
      <Rect x="6" y="12" width="36" height="30" rx="12" fill="url(#gp)" />
      <Circle cx="17" cy="26" r="3.4" fill="#0A0D14" />
      <Circle cx="31" cy="26" r="3.4" fill="#0A0D14" />
      <Path
        d="M19 33.5c2.6 2.2 7.4 2.2 10 0"
        stroke="#0A0D14"
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
      />
      <Path d="M24 12V6.5" stroke="#C9B6FF" strokeWidth="2.6" strokeLinecap="round" />
      <Circle cx="24" cy="4" r="3.2" fill="#FF7A59" />
    </Svg>
  );
}

export default function ConviteScreen() {
  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />

      {/* Brilhos do fundo: lavanda no canto de cima a direita, coral no de baixo a esquerda */}
      <LinearGradient
        colors={['rgba(157,169,255,0.34)', 'rgba(157,169,255,0)']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.42, y: 0.26 }}
        style={styles.brilho}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,122,89,0)', 'rgba(255,122,89,0.28)']}
        start={{ x: 0.62, y: 0.58 }}
        end={{ x: 0, y: 1 }}
        style={styles.brilho}
        pointerEvents="none"
      />

      {/* Cabecalho */}
      <View style={styles.cabecalho}>
        <Pressable onPress={() => router.back()} style={styles.voltar} hitSlop={10}>
          <Ionicons name="arrow-back" size={15} color={COR.apagado} />
        </Pressable>
        <Text style={styles.cabecalhoTitulo}>Diagnóstico</Text>
        <View style={styles.passo}>
          <Text style={styles.passoTexto}>3 / 3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        {/* Barra de progresso: ultimo passo do cadastro */}
        <View style={styles.barra}>
          <LinearGradient
            colors={GRADIENTE}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.barraPreenchida}
          />
        </View>

        {/* Tuti + titulo */}
        <View style={styles.topo}>
          <Tuti />
          <Text style={styles.titulo}>Vamos descobrir onde você está</Text>
        </View>

        <Text style={styles.paragrafo}>
          20 questões curtas, cerca de 12 minutos. Não é prova: serve para eu estimar seu domínio e
          não te fazer perder tempo com o que você já sabe.
        </Text>

        {/* Avisos numerados */}
        <View style={styles.lista}>
          {AVISOS.map((aviso, indice) => (
            <View key={aviso} style={styles.item}>
              <View style={styles.numero}>
                <Text style={styles.numeroTexto}>{indice + 1}</Text>
              </View>
              <Text style={styles.itemTexto}>{aviso}</Text>
            </View>
          ))}
        </View>

        {/* Acoes */}
        <View style={styles.acoes}>
          <Pressable
            onPress={() => router.push('/diagnostico')}
            style={({ pressed }) => [styles.botaoArea, pressed && styles.botaoPressionado]}
          >
            <LinearGradient
              colors={GRADIENTE}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.botao}
            >
              <Text style={styles.botaoTexto}>Começar diagnóstico</Text>
              <Ionicons name="arrow-forward" size={18} color={COR.fundo} />
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.replace('/')} style={styles.botaoVazado}>
            <Text style={styles.botaoVazadoTexto}>Fazer depois</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COR.fundo,
  },
  brilho: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  voltar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COR.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabecalhoTitulo: {
    color: COR.tinta,
    fontSize: 14,
    fontFamily: 'Archivo_700Bold',
  },
  passo: {
    marginLeft: 'auto',
    backgroundColor: COR.superficie,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  passoTexto: {
    color: COR.apagado,
    fontSize: 10.5,
    fontFamily: 'Archivo_700Bold',
  },
  conteudo: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    gap: 18,
    flexGrow: 1,
  },
  barra: {
    height: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  barraPreenchida: {
    width: '100%',
    height: '100%',
    borderRadius: 99,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 2,
  },
  titulo: {
    flex: 1,
    color: COR.tinta,
    fontSize: 21,
    lineHeight: 26,
    fontFamily: 'Archivo_700Bold',
    letterSpacing: -0.3,
  },
  paragrafo: {
    color: COR.apagado,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Archivo_400Regular',
  },
  lista: {
    gap: 9,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderWidth: 1,
    borderColor: COR.linha,
    borderRadius: 18,
    padding: 13,
  },
  numero: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(201,182,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: {
    color: COR.lilas,
    fontSize: 12,
    fontFamily: 'Archivo_700Bold',
  },
  itemTexto: {
    flex: 1,
    color: COR.tinta,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: 'Archivo_500Medium',
  },
  acoes: {
    marginTop: 'auto',
    paddingTop: 18,
    gap: 10,
  },
  botaoArea: {
    borderRadius: 16,
    shadowColor: COR.roxo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 12,
  },
  botaoPressionado: {
    opacity: 0.88,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 52,
  },
  botaoTexto: {
    color: COR.fundo,
    fontSize: 15,
    fontFamily: 'Archivo_700Bold',
  },
  botaoVazado: {
    borderWidth: 1.5,
    borderColor: COR.linha,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoVazadoTexto: {
    color: COR.tinta,
    fontSize: 13,
    fontFamily: 'Archivo_600SemiBold',
  },
});