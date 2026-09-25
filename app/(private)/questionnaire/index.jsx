import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';


const questionsData = [
  {
    id: 1,
    category: "Matemática • função quadrática",
    text: "O lucro de uma empresa, em milhares de reais, é L(x) = –2x² + 12x – 10. Qual quantidade gera o lucro máximo?",
    options: ["2 unidades", "3 unidades", "5 unidades", "6 unidades"]
  },
  {
    id: 2,
    category: "História • Brasil Colônia",
    text: "A principal atividade econômica do Brasil no século XVI, impulsionada pelo uso do trabalho escravo africano, foi a:",
    options: ["Mineração", "Pecuária", "Extração de pau-brasil", "Produção açucareira"]
  },
  {
    id: 3,
    category: "Física • Cinemática",
    text: "Um carro viaja a 90 km/h constantes. Qual é a distância percorrida após 2 horas de viagem?",
    options: ["180 km", "90 km", "45 km", "200 km"]
  },
  {
    id: 4,
    category: "Biologia • Citologia",
    text: "Qual organela celular é responsável pela respiração celular e produção de ATP?",
    options: ["Ribossomo", "Complexo de Golgi", "Mitocôndria", "Lisossomo"]
  },
  {
    id: 5,
    category: "Química • Ligações",
    text: "A ligação química formada pela transferência definitiva de elétrons entre átomos é chamada de:",
    options: ["Covalente polar", "Iônica", "Metálica", "Covalente apolar"]
  },
  {
    id: 6,
    category: "Geografia • Geopolítica",
    text: "O bloco econômico formado originalmente por Brasil, Argentina, Paraguai e Uruguai é o:",
    options: ["Nafta", "União Europeia", "Mercosul", "Pacto Andino"]
  },
  {
    id: 7,
    category: "Literatura • Modernismo",
    text: "A Semana de Arte Moderna de 1922 ocorreu em qual cidade brasileira?",
    options: ["Rio de Janeiro", "São Paulo", "Belo Horizonte", "Salvador"]
  },
  {
    id: 8,
    category: "Matemática • Porcentagem",
    text: "Um produto que custava R$ 200,00 sofreu um desconto de 15%. Qual o novo valor do produto?",
    options: ["R$ 185,00", "R$ 170,00", "R$ 150,00", "R$ 190,00"]
  },
  {
    id: 9,
    category: "Filosofia • Grécia Antiga",
    text: "Qual filósofo grego é famoso pela máxima 'Só sei que nada sei'?",
    options: ["Aristóteles", "Platão", "Sócrates", "Pitágoras"]
  },
  {
    id: 10,
    category: "História • Idade Média",
    text: "O sistema econômico, político e social que predominou na Europa Ocidental durante a Idade Média foi o:",
    options: ["Capitalismo", "Mercantilismo", "Feudalismo", "Socialismo"]
  },
  {
    id: 11,
    category: "Física • Termodinâmica",
    text: "A transferência de calor que ocorre através do movimento de fluidos (líquidos e gases) é chamada de:",
    options: ["Condução", "Irradiação", "Evaporação", "Convecção"]
  },
  {
    id: 12,
    category: "Biologia • Genética",
    text: "Os cromossomos sexuais que determinam o sexo biológico feminino em humanos são:",
    options: ["XY", "YY", "XX", "X0"]
  },
  {
    id: 13,
    category: "Química • Substâncias",
    text: "Qual das substâncias abaixo é considerada uma mistura homogênea?",
    options: ["Água e óleo", "Soro fisiológico", "Granito", "Sangue"]
  },
  {
    id: 14,
    category: "Sociologia • Cultura",
    text: "O conceito sociológico que descreve o choque ou aversão cultural em relação a hábitos diferentes dos próprios é o:",
    options: ["Relativismo", "Etnocentrismo", "Aculturação", "Sincretismo"]
  },
  {
    id: 15,
    category: "Geografia • Clima",
    text: "O clima predominante na região central do Brasil, caracterizado por duas estações bem definidas (seca e chuvosa), é o:",
    options: ["Tropical", "Equatorial", "Semiárido", "Subtropical"]
  },
  {
    id: 16,
    category: "Matemática • Probabilidade",
    text: "Ao lançar um dado comum de 6 faces, qual a probabilidade de cair um número primo?",
    options: ["1/6", "1/3", "1/2", "2/3"]
  },
  {
    id: 17,
    category: "História • Era Vargas",
    text: "A Constituição outorgada em 1937, que deu início ao Estado Novo no Brasil, ficou conhecida como:",
    options: ["Cidadã", "Polaca", "Mandioca", "Republicana"]
  },
  {
    id: 18,
    category: "Física • Dinâmica",
    text: "A Segunda Lei de Newton (Princípio Fundamental da Dinâmica) é expressa pela fórmula:",
    options: ["F = m/a", "F = m + a", "F = m * a", "F = a / m"]
  },
  {
    id: 19,
    category: "Biologia • Ecologia",
    text: "A relação ecológica onde duas espécies se beneficiam, mas a união não é obrigatória para a sobrevivência, chama-se:",
    options: ["Mutualismo", "Protocooperação", "Comensalismo", "Parasitismo"]
  },
  {
    id: 20,
    category: "Literatura • Romantismo",
    text: "A obra 'Iracema', considerada um romance indianista do Romantismo brasileiro, foi escrita por:",
    options: ["Machado de Assis", "José de Alencar", "Álvares de Azevedo", "Castro Alves"]
  }
];

const optionLetters = ["A", "B", "C", "D"];

export default function Questionnaire() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(720); // 12 minutos em segundos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQuestion = questionsData[currentQuestionIndex];
  const totalQuestions = questionsData.length;

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); 
    } else {
      console.log("Diagnóstico finalizado!");
      router.back();
    }
  };

  return (
    <View style={styles.container}>
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
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingTop: insets.top + 20, 
            paddingBottom: Math.max(insets.bottom, 24) 
          }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <Ionicons name="close" size={20} color="#8A91A6" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Questão {currentQuestionIndex + 1} / {totalQuestions}</Text>
            
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          </View>

          <Text style={styles.questionText}>
            {currentQuestion.text}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedOption(index)}
                >
                  <View style={[
                    styles.optionLetterCircle,
                    isSelected && styles.optionLetterCircleSelected
                  ]}>
                    <Text style={[
                      styles.optionLetterText,
                      isSelected && styles.optionLetterTextSelected
                    ]}>
                      {optionLetters[index]}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              selectedOption === null && styles.primaryButtonDisabled
            ]}
            disabled={selectedOption === null}
            activeOpacity={0.8}
            onPress={handleNextQuestion}
          >
            <Text style={[
              styles.primaryButtonText,
              selectedOption === null && styles.primaryButtonTextDisabled
            ]}>
              Confirmar resposta
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={selectedOption === null ? "#5C668A" : "#0A0D14"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            activeOpacity={0.6}
            onPress={handleNextQuestion}
          >
            <Text style={styles.secondaryButtonText}>Não sei responder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between', 
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerBadge: {
    backgroundColor: '#131620',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    color: '#8B94F7', // Tom de roxo para o tempo
    fontSize: 12,
    fontWeight: 'bold',
  },
  // --- Progresso ---
  progressTrack: {
    height: 4,
    backgroundColor: '#202538',
    borderRadius: 2,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9FA8FF', // Cor da barra de progresso preenchida
    borderRadius: 2,
  },
  // --- Categoria ---
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D274A', // Borda levemente roxa
    backgroundColor: 'rgba(45, 39, 74, 0.3)',
    marginBottom: 24,
  },
  categoryText: {
    color: '#9FA8FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // --- Pergunta ---
  questionText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600',
    marginBottom: 32,
  },
  // --- Alternativas ---
  optionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 20,
    padding: 16,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(159, 168, 255, 0.08)', // Fundo roxo muito sutil
    borderColor: '#9FA8FF',
  },
  optionLetterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#5C668A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionLetterCircleSelected: {
    backgroundColor: '#9FA8FF',
    borderColor: '#9FA8FF',
  },
  optionLetterText: {
    color: '#8A91A6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionLetterTextSelected: {
    color: '#0A0D14', // Letra preta no fundo roxo quando ativo
  },
  optionText: {
    color: '#E0E3EB',
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // --- Rodapé (Botões) ---
  footer: {
    marginTop: 'auto', // Ajuda o flexGrow a empurrar pro final da tela
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#9FA8FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: '#131620',
  },
  primaryButtonText: {
    color: '#0A0D14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButtonTextDisabled: {
    color: '#5C668A',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#202538',
  },
  secondaryButtonText: {
    color: '#E0E3EB',
    fontSize: 16,
    fontWeight: 'bold',
  }
});