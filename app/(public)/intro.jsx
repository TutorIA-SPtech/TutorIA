import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/Button"; // Importando o componente que criamos
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Componente local apenas para organizar os itens da lista
const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={20} color="#A1A8BE" />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["rgba(28, 16, 80, 0.4)", "transparent"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.6 }}
        style={[StyleSheet.absoluteFill, styles.topRightGradient]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["rgba(73, 23, 23, 0.5)", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.8, y: 0.4 }}
        style={[StyleSheet.absoluteFill, styles.bottomLeftGradient]}
        pointerEvents="none"
      />

      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/tuti.png")}
            style={styles.robotIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Você diz a prova.{"\n"}Eu digo o próximo{"\n"}passo.
          </Text>
          <Text style={styles.subtitle}>
            Um diagnóstico curto estima seu domínio por assunto. Depois disso a
            trilha se corrige a cada resposta sua.
          </Text>
        </View>

        {/* Lista de Features */}
        <View style={styles.featuresList}>
          <FeatureItem icon="time-outline" text="Diagnóstico de 12 minutos" />
          <FeatureItem
            icon="bar-chart-outline"
            text="Domínio por assunto, não média"
          />
          <FeatureItem icon="camera-outline" text="Foto, áudio ou anexo" />
          <FeatureItem icon="sparkles-outline" text="Peça o que quiser à IA" />
        </View>

        {/* Rodapé dinâmico */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <PrimaryButton
            title="Criar minha conta"
            onPress={() => router.push("/sign-up")}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tenho conta · </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0D14",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 20,
    zIndex: 1,
  },
  header: {
    marginBottom: 32,
  },
  robotIcon: {
    width: 60,
    height: 60,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "bold",
    lineHeight: 44,
    marginBottom: 16,
  },
  subtitle: {
    color: "#8A91A6",
    fontSize: 16,
    lineHeight: 24,
  },
  featuresList: {
    flex: 1,
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    width: "100%",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#8A91A6",
    fontSize: 14,
  },
  loginLink: {
    color: "#9FA8FF", // Cor roxa do link
    fontSize: 14,
    fontWeight: "bold",
  },
});
