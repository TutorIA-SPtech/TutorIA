import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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