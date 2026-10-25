import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../components/Button';
import DotGridBackground from '../../../components/DotGridBackground';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import { styles } from '../../../styles/module/resposta-erro';

const TEMAS = {
  coral: {
    cor: '#FF8A65',
    fundo: 'rgba(255, 138, 101, 0.06)',
    borda: 'rgba(255, 138, 101, 0.3)',
    badge: 'rgba(255, 138, 101, 0.16)',
  },
  verde: {
    cor: '#57DDA9',
    fundo: 'rgba(87, 221, 169, 0.08)',
    borda: 'rgba(87, 221, 169, 0.3)',
    badge: 'rgba(87, 221, 169, 0.16)',
  },
  lavanda: {
    cor: '#9FA8FF',
    fundo: 'transparent',
    borda: '#202538',
    badge: 'rgba(159, 168, 255, 0.16)',
  },
};

const CardSecao = ({ numero, titulo, tema, children }) => {
  const cores = TEMAS[tema];

  return (
    <View style={[styles.secaoCard, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
      <View style={styles.secaoHeader}>
        <View style={[styles.secaoBadge, { backgroundColor: cores.badge }]}>
          <Text style={[styles.secaoBadgeNumero, { color: cores.cor }]}>{numero}</Text>
        </View>
        <Text style={[styles.secaoTitulo, { color: cores.cor }]}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
};

export default function RespostaErroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { payload } = useLocalSearchParams();
  const payloadString = Array.isArray(payload) ? payload[0] : payload;
  const info = JSON.parse(payloadString || '{}');

  useEffect(() => {
    const voltarAoResumo = () => {
      router.replace('/(private)/module/modulo');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', voltarAoResumo);
    return () => subscription.remove();
  }, [router]);

  return (
    <View style={styles.container}>
      <DotGridBackground />
      <LinearGradient
        colors={['rgba(28, 16, 80, 0.4)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.6 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(73, 23, 23, 0.5)', 'transparent']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.8, y: 0.4 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.replace('/(private)/module/modulo')}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Questão {info.questaoAtual} / {info.totalQuestoes}
          </Text>
        </View>

        {/* Resultado */}
        <View
          style={[
            styles.resultadoCard,
            {
              backgroundColor: 'rgba(255, 138, 101, 0.08)',
              borderColor: 'rgba(255, 138, 101, 0.3)',
            },
          ]}
        >
          <View style={[styles.resultadoIcone, { backgroundColor: '#FF8A65' }]}>
            <Ionicons name="close" size={26} color="#0A0D14" />
          </View>
          <View style={styles.resultadoTextWrap}>
            <Text style={styles.resultadoTitulo}>
              Você marcou {info.opcaoMarcada?.letra} · {info.opcaoMarcada?.texto}
            </Text>
            <Text style={styles.resultadoSub}>Incorreta</Text>
          </View>
        </View>

        {/* Explicações */}
        <View style={styles.secoesList}>
          <CardSecao numero={1} titulo="POR QUE ERROU" tema="coral">
            <Text style={styles.secaoTexto}>
              {info.explicacao}
            </Text>
          </CardSecao>

          <CardSecao numero={2} titulo="A CORRETA" tema="verde">
            <View style={styles.corretaRow}>
              <View style={styles.corretaLetra}>
                <Text style={styles.corretaLetraTexto}>{info.opcaoCorreta?.letra}</Text>
              </View>
              <Text style={styles.corretaTitulo}>{info.opcaoCorreta?.texto}</Text>
            </View>
            <Text style={styles.secaoTexto}>{info.teoriaFaltante}</Text>
          </CardSecao>

          <CardSecao numero={3} titulo="O CONTEÚDO" tema="lavanda">
            <Text style={styles.conteudoTexto}>{info.teoriaFaltante}</Text>

            <View style={styles.mapaHeader}>
              <Text style={styles.mapaLabel}>SEU MAPA</Text>
              <Text style={styles.mapaValorErro}>
                48% → 42%
              </Text>
            </View>
            <AnimatedProgressBar
              targetPercentage={42}
              color="#FF8A65"
              height={6}
            />

            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.8}
                onPress={() => console.log('Rever a teoria')}
              >
                <Text style={styles.pillText}>Rever a teoria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.8}
                onPress={() => console.log('Questões parecidas')}
              >
                <Text style={styles.pillText}>2 parecidas</Text>
              </TouchableOpacity>
            </View>
          </CardSecao>
        </View>
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          title="Próxima questão"
          onPress={() =>
            info.isUltimaQuestao
              ? router.replace('/(private)/module/resultado-modulo')
              : router.replace({
                  pathname: '/(private)/module/questao',
                  params: { index: info.proximoIndex },
                })
          }
        />
      </View>
    </View>
  );
}