import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const COR = {
  fundo: '#0A0D14',
  tinta: '#F1F5FD',
  apagado: '#7E8BA3',
  linha: 'rgba(255,255,255,0.09)',
  roxo: '#9DA9FF',
  lilas: '#C9B6FF',
  superficie: '#151C2B',
};

const GRADIENTE = ['#D6C6FF', '#7C8CFF'];
const GRADIENTE_CHIP = ['#D3C2FF', '#8E9BFF'];

const OPCOES_TEMPO = ['30 min', '1 h', '2 h', '3 h+'];

const DIAS_DA_SEMANA = [
  { id: 'seg', letra: 'S' },
  { id: 'ter', letra: 'T' },
  { id: 'qua', letra: 'Q' },
  { id: 'qui', letra: 'Q' },
  { id: 'sex', letra: 'S' },
  { id: 'sab', letra: 'S' },
  { id: 'dom', letra: 'D' },
];

function formatarData(texto) {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return digitos.slice(0, 2) + ' / ' + digitos.slice(2);
  return digitos.slice(0, 2) + ' / ' + digitos.slice(2, 4) + ' / ' + digitos.slice(4);
}

function calcularDiasRestantes(texto) {
  const partes = texto.replace(/\s/g, '').split('/');
  if (partes.length !== 3) return null;

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);
  if (!dia || !mes || partes[2].length !== 4) return null;

  const prova = new Date(ano, mes - 1, dia);
  if (prova.getDate() !== dia || prova.getMonth() !== mes - 1) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dias = Math.round((prova - hoje) / 86400000);
  return dias > 0 ? dias : null;
}

export default function RotinaScreen() {
  const [dataDaProva, setDataDaProva] = useState('08 / 11 / 2026');
  const [tempoPorDia, setTempoPorDia] = useState('1 h');
  const [diasEscolhidos, setDiasEscolhidos] = useState(['seg', 'ter', 'qua', 'qui', 'sex']);
  const [lembreteAtivo, setLembreteAtivo] = useState(true);
  const [horario, setHorario] = useState('19:00');

  const diasRestantes = calcularDiasRestantes(dataDaProva);

  const alternarDia = (id) => {
    if (diasEscolhidos.includes(id)) {
      setDiasEscolhidos(diasEscolhidos.filter((dia) => dia !== id));
    } else {
      setDiasEscolhidos([...diasEscolhidos, id]);
    }
  };

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />

      {/* Cabecalho */}
      <View style={styles.cabecalho}>
        <Pressable onPress={() => router.back()} style={styles.voltar} hitSlop={10}>
          <Ionicons name="arrow-back" size={15} color={COR.apagado} />
        </Pressable>
        <Text style={styles.cabecalhoTitulo}>Sua rotina</Text>
        <View style={styles.passo}>
          <Text style={styles.passoTexto}>2 / 3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        {/* Barra de progresso do cadastro */}
        <View style={styles.barra}>
          <LinearGradient
            colors={GRADIENTE}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.barraPreenchida}
          />
        </View>

        <Text style={styles.titulo}>Quanto tempo você tem?</Text>

        {/* Data da prova */}
        <View style={styles.grupo}>
          <Text style={styles.rotulo}>DATA DA PROVA</Text>
          <View style={styles.campo}>
            <TextInput
              style={styles.campoTexto}
              value={dataDaProva}
              onChangeText={(texto) => setDataDaProva(formatarData(texto))}
              placeholder="dd / mm / aaaa"
              placeholderTextColor={COR.apagado}
              keyboardType="numeric"
              maxLength={14}
            />
            {diasRestantes !== null && (
              <LinearGradient
                colors={GRADIENTE}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.selo}
              >
                <Text style={styles.seloTexto}>{diasRestantes} dias</Text>
              </LinearGradient>
            )}
          </View>
        </View>

        {/* Tempo por dia */}
        <View style={styles.grupo}>
          <Text style={styles.rotulo}>TEMPO POR DIA</Text>
          <View style={styles.linha}>
            {OPCOES_TEMPO.map((opcao) => {
              const selecionado = tempoPorDia === opcao;

              if (selecionado) {
                return (
                  <Pressable key={opcao} onPress={() => setTempoPorDia(opcao)}>
                    <LinearGradient
                      colors={GRADIENTE_CHIP}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.chipCheio}
                    >
                      <Text style={styles.chipCheioTexto}>{opcao}</Text>
                    </LinearGradient>
                  </Pressable>
                );
              }

              return (
                <Pressable key={opcao} onPress={() => setTempoPorDia(opcao)} style={styles.chip}>
                  <Text style={styles.chipTexto}>{opcao}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dias da semana */}
        <View style={styles.grupo}>
          <Text style={styles.rotulo}>DIAS DA SEMANA</Text>
          <View style={styles.linha}>
            {DIAS_DA_SEMANA.map((dia) => {
              const selecionado = diasEscolhidos.includes(dia.id);

              if (selecionado) {
                return (
                  <Pressable key={dia.id} onPress={() => alternarDia(dia.id)}>
                    <LinearGradient
                      colors={GRADIENTE_CHIP}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.diaCheio}
                    >
                      <Text style={styles.diaCheioTexto}>{dia.letra}</Text>
                    </LinearGradient>
                  </Pressable>
                );
              }

              return (
                <Pressable key={dia.id} onPress={() => alternarDia(dia.id)} style={styles.dia}>
                  <Text style={styles.diaTexto}>{dia.letra}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Lembrete diario */}
        <LinearGradient
          colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.025)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardLinha}>
            <View style={styles.icone}>
              <Ionicons name="notifications-outline" size={15} color={COR.lilas} />
            </View>
            <Text style={styles.cardTitulo}>Lembrete diário</Text>
            {/* Toggle proprio: o Switch nativo nao aceita gradiente nem bolinha escura */}
            <Pressable onPress={() => setLembreteAtivo(!lembreteAtivo)} hitSlop={8}>
              {lembreteAtivo ? (
                <LinearGradient
                  colors={GRADIENTE_CHIP}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.toggleLigado}
                >
                  <View style={styles.toggleBolinha} />
                </LinearGradient>
              ) : (
                <View style={styles.toggleDesligado}>
                  <View style={styles.toggleBolinhaApagada} />
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.linha}>
            <LinearGradient
              colors={GRADIENTE_CHIP}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chipCheio}
            >
              <Text style={styles.chipCheioTexto}>{horario}</Text>
            </LinearGradient>
            <Pressable onPress={() => setHorario('20:00')} style={styles.chip}>
              <Text style={styles.chipTexto}>alterar</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Botao continuar */}
        <Pressable
          onPress={() => router.push('/convite')}
          style={({ pressed }) => [styles.botaoArea, pressed && styles.botaoPressionado]}
        >
          <LinearGradient
            colors={GRADIENTE}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.botao}
          >
            <Text style={styles.botaoTexto}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color={COR.fundo} />
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: COR.fundo,
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
    width: '66%',
    height: '100%',
    borderRadius: 99,
  },
  titulo: {
    color: COR.tinta,
    fontSize: 24,
    lineHeight: 29,
    fontFamily: 'Archivo_700Bold',
    letterSpacing: -0.3,
  },
  grupo: {
    gap: 8,
  },
  rotulo: {
    color: COR.apagado,
    fontSize: 10,
    fontFamily: 'Archivo_700Bold',
    letterSpacing: 1.2,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COR.linha,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingLeft: 15,
    paddingRight: 10,
    height: 50,
  },
  campoTexto: {
    flex: 1,
    color: COR.tinta,
    fontSize: 14,
    fontFamily: 'Archivo_400Regular',
  },
  selo: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  seloTexto: {
    color: COR.fundo,
    fontSize: 11,
    fontFamily: 'Archivo_700Bold',
  },
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: COR.linha,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipTexto: {
    color: COR.apagado,
    fontSize: 12.5,
    fontFamily: 'Archivo_600SemiBold',
  },
  chipCheio: {
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipCheioTexto: {
    color: COR.fundo,
    fontSize: 12.5,
    fontFamily: 'Archivo_700Bold',
  },
  dia: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COR.linha,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaTexto: {
    color: COR.apagado,
    fontSize: 12.5,
    fontFamily: 'Archivo_600SemiBold',
  },
  diaCheio: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaCheioTexto: {
    color: COR.fundo,
    fontSize: 12.5,
    fontFamily: 'Archivo_700Bold',
  },
  card: {
    borderWidth: 1,
    borderColor: COR.linha,
    borderRadius: 20,
    padding: 15,
    gap: 10,
  },
  cardLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icone: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(201,182,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitulo: {
    flex: 1,
    color: COR.tinta,
    fontSize: 13,
    fontFamily: 'Archivo_700Bold',
  },
  toggleLigado: {
    width: 42,
    height: 24,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 3,
  },
  toggleBolinha: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COR.fundo,
  },
  toggleDesligado: {
    width: 42,
    height: 24,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 3,
  },
  toggleBolinhaApagada: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COR.apagado,
  },
  botaoArea: {
    marginTop: 'auto',
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
});