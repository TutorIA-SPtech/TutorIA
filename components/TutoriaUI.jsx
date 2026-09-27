import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle, Defs, LinearGradient as SvgGradient, Path, Pattern, RadialGradient, Rect, Stop,
} from 'react-native-svg';

export const COR = {
  fundo: '#0A0D14',
  superficie: '#151C2B',
  superficie2: '#1E2739',
  tinta: '#F1F5FD',
  apagado: '#7E8BA3',
  roxo: '#9DA9FF',
  lilas: '#C9B6FF',
  coral: '#FF7A59',
  menta: '#6FE3C0',
  ambar: '#FFC978',
  linha: 'rgba(255,255,255,0.09)',
};

export const GRAD = {
  p: ['#C9B6FF', '#8E9BFF'],
  s: ['#FFB59B', '#FF7A59'],
  k: ['#A7F0D8', '#6FE3C0'],
  w: ['#FFE0AB', '#FFC978'],
};

const GRAD_BARRA = {
  p: ['#C9B6FF', '#8E9BFF'],
  s: ['#FFA98F', '#FF7A59'],
  k: ['#A7F0D8', '#6FE3C0'],
  w: ['#FFE0AB', '#FFC978'],
};

export const F = {
  r: 'Archivo_400Regular',
  m: 'Archivo_500Medium',
  sb: 'Archivo_600SemiBold',
  b: 'Archivo_700Bold',
  mono: 'Archivo_600SemiBold',
  monoB: 'Archivo_700Bold',
};

export const txt = StyleSheet.create({
  tx: { fontFamily: F.r, fontSize: 12, lineHeight: 18.6, color: COR.apagado },
  lbl: { fontFamily: F.monoB, fontSize: 9, letterSpacing: 0.9, color: COR.apagado },
  mn: { fontFamily: F.mono, color: COR.tinta },
  h1: { fontFamily: F.b, fontSize: 22, lineHeight: 26.4, letterSpacing: -0.22, color: COR.tinta },
});

export function Fundo({ glow = false }) {
  const { width: w, height: h } = useWindowDimensions();
  const r1 = 0.52 * Math.hypot(0.82 * w, 1.04 * h);
  const r2 = 0.46 * Math.hypot(0.98 * w, 0.88 * h);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={w} height={h}>
        <Defs>
          <Pattern id="pontos" width="17" height="17" patternUnits="userSpaceOnUse">
            <Circle cx="8.5" cy="8.5" r="1" fill="#FFFFFF" fillOpacity="0.055" />
          </Pattern>
          <RadialGradient id="brilho1" cx={0.82 * w} cy={-0.04 * h} fx={0.82 * w} fy={-0.04 * h} r={r1} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#9DA9FF" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#9DA9FF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="brilho2" cx={0.02 * w} cy={0.88 * h} fx={0.02 * w} fy={0.88 * h} r={r2} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FF7A59" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#FF7A59" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {glow && <Rect width={w} height={h} fill="url(#brilho1)" />}
        {glow && <Rect width={w} height={h} fill="url(#brilho2)" />}
        <Rect width={w} height={h} fill="url(#pontos)" />
      </Svg>
    </View>
  );
}

export function Cabecalho({ titulo, voltar = false, selo, onSelo }) {
  const irPraTras = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={u.cab}>
      {voltar && (
        <Pressable onPress={irPraTras} style={u.voltar} hitSlop={10}>
          <Ionicons name="arrow-back" size={15} color={COR.apagado} />
        </Pressable>
      )}
      <Text style={u.cabTitulo}>{titulo}</Text>
      {selo ? (
        <Pressable onPress={onSelo} disabled={!onSelo} style={u.selo} hitSlop={8}>
          <Text style={u.seloTexto}>{selo}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Tuti({ tam = 50, antena = true }) {
  return (
    <Svg width={tam} height={tam} viewBox="0 0 48 48">
      <Defs>
        <SvgGradient id="tutiG" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C9B6FF" />
          <Stop offset="1" stopColor="#8E9BFF" />
        </SvgGradient>
      </Defs>
      <Rect x="6" y="12" width="36" height="30" rx="12" fill="url(#tutiG)" />
      <Circle cx="17" cy="26" r="3.4" fill="#0A0D14" />
      <Circle cx="31" cy="26" r="3.4" fill="#0A0D14" />
      <Path d="M19 33.5c2.6 2.2 7.4 2.2 10 0" stroke="#0A0D14" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      {antena && <Path d="M24 12V6.5" stroke="#C9B6FF" strokeWidth="2.6" strokeLinecap="round" />}
      {antena && <Circle cx="24" cy="4" r="3.2" fill="#FF7A59" />}
    </Svg>
  );
}

const TRACOS = {
  arquivo: ['M5 2.5h6.5L15 6v11.5H5z', 'M11.5 2.5V6H15'],
  mic: ['M10 3.5v8M10 11.5a3 3 0 0 0 3-3V6.5a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3zM6 15a5.5 5.5 0 0 0 8 0'],
  lista: ['M7 3.5h6a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 13V7A3.5 3.5 0 0 1 7 3.5z', 'M7 8h6M7 11.5h4'],
  barras: ['M3.5 16v-4M10 16V4.5M16.5 16v-7'],
  info: ['M2.5 10a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0-15 0', 'M10 14v-4M10 7h.01'],
  inicio: ['M3.5 9.5l6.5-5.5 6.5 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-4V17H4.5a1 1 0 0 1-1-1z'],
  plano: ['M4.5 3.5h8a2.5 2.5 0 0 1 2.5 2.5v10.5H7a2.5 2.5 0 0 0-2.5 2.5z'],
  estrela: ['M10 2.5l2.1 5.1 5.4 1-3.8 3.7.9 5.4-4.6-2.6-4.6 2.6.9-5.4L2.5 8.6l5.4-1z'],
  perfil: ['M6.8 7a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0', 'M4 17a6 6 0 0 1 12 0'],
};

export function Icone({ nome, tam = 16, cor = COR.lilas, espessura = 1.8 }) {
  return (
    <Svg width={tam} height={tam} viewBox="0 0 20 20" fill="none">
      {TRACOS[nome].map((d, i) => (
        <Path key={i} d={d} stroke={cor} strokeWidth={espessura} strokeLinecap="round" />
      ))}
    </Svg>
  );
}

export function IconeCaixa({ tam = 32, raio = 12, fundo = 'rgba(157,169,255,0.15)', children }) {
  return (
    <View style={{ width: tam, height: tam, borderRadius: raio, backgroundColor: fundo, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  );
}

export function Check({ tam = 15 }) {
  return (
    <Svg width={tam} height={tam} viewBox="0 0 20 20">
      <Defs>
        <SvgGradient id="checkG" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#A7F0D8" />
          <Stop offset="1" stopColor="#6FE3C0" />
        </SvgGradient>
      </Defs>
      <Circle cx="10" cy="10" r="9" fill="url(#checkG)" />
      <Path d="M6 10.4l2.6 2.6L14 7.6" stroke="#0A0D14" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function Chama({ tam = 16 }) {
  return (
    <Svg width={tam} height={tam} viewBox="0 0 20 20">
      <Defs>
        <SvgGradient id="chamaG" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE0AB" />
          <Stop offset="1" stopColor="#FFC978" />
        </SvgGradient>
      </Defs>
      <Path d="M10 2c3 3.4 5 5.6 5 8.6a5 5 0 0 1-10 0c0-2 1.6-3.2 2.2-5 .6 1.4 2.4 1.6 2.8 3.4.6-2-1-4.6 0-7z" fill="url(#chamaG)" />
    </Svg>
  );
}

export function Alerta({ tam = 12 }) {
  return (
    <Svg width={tam} height={tam} viewBox="0 0 20 20">
      <Path d="M10 2.5l7.8 13.5H2.2z" fill="#FF7A59" />
      <Rect x="9.1" y="7" width="1.8" height="4.6" rx=".9" fill="#0A0D14" />
      <Circle cx="10" cy="13.6" r="1" fill="#0A0D14" />
    </Svg>
  );
}

export function Enviar({ tam = 30, icone = 14, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <LinearGradient colors={GRAD.p} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: tam, height: tam, borderRadius: tam / 2, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={icone} height={icone} viewBox="0 0 20 20">
          <Path d="M3 17l14-7L3 3l3 7z" fill="#0A0D14" />
        </Svg>
      </LinearGradient>
    </Pressable>
  );
}

export function Anel({ tam, caixa, raio, espessura, pct, cores, texto, fonte }) {
  const c = 2 * Math.PI * raio;
  return (
    <View style={{ width: tam, height: tam, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tam} height={tam} viewBox={`0 0 ${caixa} ${caixa}`} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id="anelG" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={cores[0]} />
            <Stop offset="1" stopColor={cores[1]} />
          </SvgGradient>
        </Defs>
        <Circle cx={caixa / 2} cy={caixa / 2} r={raio} fill="none" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth={espessura} />
        <Circle
          cx={caixa / 2} cy={caixa / 2} r={raio} fill="none" stroke="url(#anelG)"
          strokeWidth={espessura} strokeLinecap="round" strokeDasharray={`${c}`} strokeDashoffset={c * (1 - pct / 100)}
        />
      </Svg>
      <Text style={{ color: COR.tinta, fontFamily: F.monoB, fontSize: fonte }}>{texto}</Text>
    </View>
  );
}

export function Barra({ pct, cor = 'p', altura = 8, largura, style }) {
  return (
    <View style={[{ height: altura, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }, largura && { width: largura }, style]}>
      <LinearGradient colors={GRAD_BARRA[cor]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ width: `${pct}%`, height: '100%', borderRadius: 99 }} />
    </View>
  );
}

const CAIXAS = {
  card: { cores: ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.025)'], borda: COR.linha, raio: 20, pad: 15 },
  cardp: { cores: ['rgba(201,182,255,0.22)', 'rgba(157,169,255,0.07)'], borda: 'rgba(201,182,255,0.28)', raio: 22, pad: 16 },
  cards: { cores: ['rgba(255,122,89,0.2)', 'rgba(255,122,89,0.05)'], borda: 'rgba(255,122,89,0.3)', raio: 20, pad: 14 },
  cardk: { cores: ['rgba(111,227,192,0.18)', 'rgba(111,227,192,0.04)'], borda: 'rgba(111,227,192,0.3)', raio: 20, pad: 14 },
  cardw: { cores: ['rgba(255,201,120,0.22)', 'rgba(255,201,120,0.05)'], borda: 'rgba(255,201,120,0.32)', raio: 20, pad: 14 },
};

export function Caixa({ tipo = 'card', style, children }) {
  const c = CAIXAS[tipo];
  return (
    <LinearGradient
      colors={c.cores} start={{ x: 0.25, y: 0 }} end={{ x: 0.75, y: 1 }}
      style={[{ borderWidth: 1, borderColor: c.borda, borderRadius: c.raio, padding: c.pad, gap: 9 }, style]}
    >
      {children}
    </LinearGradient>
  );
}

export function Contorno({ style, onPress, children }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [u.out, style, pressed && { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[u.out, style]}>{children}</View>;
}

export function Botao({ titulo, seta = false, onPress, cores = GRAD.p, sombra = COR.roxo, style, estiloInterno, estiloTexto }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { borderRadius: 16, shadowColor: sombra, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.55, shadowRadius: 12, elevation: 10 },
        pressed && { opacity: 0.88 },
        style,
      ]}
    >
      <LinearGradient colors={cores} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[u.btn, { justifyContent: seta ? 'space-between' : 'center' }, estiloInterno]}>
        <Text style={[u.btnTexto, estiloTexto]}>{titulo}</Text>
        {seta && <Text style={[u.btnTexto, estiloTexto]}>→</Text>}
      </LinearGradient>
    </Pressable>
  );
}

export function BotaoContorno({ titulo, onPress, style, estiloTexto, children }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [u.btno, style, pressed && { backgroundColor: 'rgba(255,255,255,0.07)' }]}>
      {children}
      <Text style={[u.btnoTexto, estiloTexto]}>{titulo}</Text>
    </Pressable>
  );
}

export function Chip({ titulo, onPress, style, estiloTexto, children }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[u.chip, style]}>
      {children}
      <Text style={[u.chipTexto, estiloTexto]}>{titulo}</Text>
    </Pressable>
  );
}

const ABAS = [
  { id: 'inicio', rotulo: 'Início', icone: 'inicio' },
  { id: 'plano', rotulo: 'Plano', icone: 'plano', semTela: true },
  { id: 'ia', rotulo: 'IA', icone: 'estrela' },
  { id: 'progresso', rotulo: 'Progresso', icone: 'barras' },
  { id: 'perfil', rotulo: 'Perfil', icone: 'perfil', semTela: true },
];
const PILULA_L = 44;
const PILULA_A = 32;

export function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const ABA_MAE = { limite: 'ia' };
  const rotaAtual = state.routes[state.index].name;
  const ativa = ABA_MAE[rotaAtual] ?? rotaAtual;
  const indice = Math.max(0, ABAS.findIndex((a) => a.id === ativa));

  const [largura, setLargura] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const primeira = useRef(true);

  const itemL = (largura - 16) / ABAS.length;
  const alvo = 8 + indice * itemL + (itemL - PILULA_L) / 2;

  useEffect(() => {
    if (!largura) return;
    if (primeira.current) {
      x.setValue(alvo);
      primeira.current = false;
      return;
    }
    Animated.spring(x, { toValue: alvo, useNativeDriver: true, damping: 16, stiffness: 160, mass: 0.9 }).start();
  }, [alvo, largura]);

  const tocar = (aba) => {
    if (aba.semTela) return;
    const rota = state.routes.find((r) => r.name === aba.id);
    if (!rota) return;
    const evento = navigation.emit({ type: 'tabPress', target: rota.key, canPreventDefault: true });
    if (aba.id !== ativa && !evento.defaultPrevented) navigation.navigate(aba.id);
  };

  return (
    <View style={[u.tb, { paddingBottom: 14 + insets.bottom }]} onLayout={(ev) => setLargura(ev.nativeEvent.layout.width)}>
      {largura > 0 && <Animated.View style={[u.tbPilula, { transform: [{ translateX: x }] }]} />}
      {ABAS.map((aba) => {
        const on = aba.id === ativa;
        const cor = on ? COR.roxo : COR.apagado;
        return (
          <Pressable key={aba.id} style={u.tbi} onPress={() => tocar(aba)}>
            <View style={u.tbIcone}>
              <Icone nome={aba.icone} tam={22} cor={cor} />
            </View>
            <Text style={[u.tbTexto, on && { color: COR.roxo, fontFamily: F.b }]}>{aba.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const tela = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: COR.fundo },
  corpo: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 0, gap: 12, flexGrow: 1 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

const u = StyleSheet.create({
  cab: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8 },
  voltar: { width: 30, height: 30, borderRadius: 15, backgroundColor: COR.superficie, alignItems: 'center', justifyContent: 'center' },
  cabTitulo: { color: COR.tinta, fontSize: 13.5, fontFamily: F.b },
  selo: { marginLeft: 'auto', backgroundColor: COR.superficie, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
  seloTexto: { color: COR.apagado, fontSize: 10, fontFamily: F.monoB },
  out: { borderWidth: 1, borderColor: COR.linha, borderRadius: 18, padding: 13, gap: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 18 },
  btnTexto: { color: COR.fundo, fontSize: 14, fontFamily: F.b },
  btno: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    borderWidth: 1.5, borderColor: COR.linha, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  btnoTexto: { color: COR.tinta, fontSize: 12.5, fontFamily: F.sb },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: COR.linha, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 11,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  chipTexto: { color: COR.apagado, fontSize: 10.5, fontFamily: F.sb },
  tb: { flexDirection: 'row', paddingTop: 10, paddingHorizontal: 8, backgroundColor: 'rgba(10,13,20,0.96)', borderTopWidth: 1, borderTopColor: COR.linha },
  tbi: { flex: 1, alignItems: 'center', gap: 5 },
  tbIcone: { height: PILULA_A, alignItems: 'center', justifyContent: 'center' },
  tbPilula: {
    position: 'absolute', top: 10, left: 0, width: PILULA_L, height: PILULA_A, borderRadius: 99,
    backgroundColor: 'rgba(157,169,255,0.18)',
    shadowColor: COR.roxo, shadowOpacity: 0.55, shadowRadius: 10, shadowOffset: { width: 0, height: 0 },
  },
  tbTexto: { color: COR.apagado, fontSize: 10.5, fontFamily: F.sb },
});