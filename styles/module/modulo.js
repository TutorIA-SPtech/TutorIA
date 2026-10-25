import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },

  // --- Cabeçalho ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131620',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    color: '#8A91A6',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    color: '#8A91A6',
    fontSize: 12,
    fontWeight: '600',
  },

  // --- Lista de tópicos ---
  topicosList: { gap: 12 },
  topicoCard: {
    backgroundColor: 'rgba(19, 22, 32, 0.6)',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  topicoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicoConcluido: { opacity: 0.6 },
  topicoAtual: {
    backgroundColor: 'rgba(159, 168, 255, 0.10)',
    borderColor: 'rgba(159, 168, 255, 0.45)',
    paddingVertical: 18,
  },
  topicoAvaliacao: {
    backgroundColor: 'rgba(255, 138, 101, 0.08)',
    borderColor: 'rgba(255, 138, 101, 0.3)',
  },

  // --- Ícone à esquerda ---
  icone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeConcluido: { backgroundColor: '#57DDA9' },
  iconeAtual: { backgroundColor: '#9FA8FF' },
  iconePendente: {
    borderWidth: 1.5,
    borderColor: '#8A91A6',
  },
  iconeNumero: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- Textos ---
  topicoTextWrap: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  topicoTitulo: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 21,
  },
  topicoTituloAtual: {
    fontSize: 16,
  },
  topicoDetalhe: {
    color: '#8A91A6',
    fontSize: 13,
    marginTop: 14,
  },
  topicoDuracao: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topicoDuracaoAtual: { color: '#9FA8FF' },
  topicoDuracaoAvaliacao: { color: '#FF8A65' },

  // --- Botão fixo no rodapé ---
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
});