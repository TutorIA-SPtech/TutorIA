import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },

  // --- Cabeçalho ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131620',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerPill: {
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timerText: {
    color: '#8A91A6',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // --- Progresso em segmentos ---
  segmentosRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  segmento: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  // --- Tema e prova ---
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  temaPill: {
    backgroundColor: 'rgba(159, 168, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(159, 168, 255, 0.45)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  temaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  provaText: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // --- Enunciado ---
  enunciado: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 24,
  },

  // --- Alternativas ---
  opcoesList: { gap: 12 },
  opcaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 22, 32, 0.6)',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  opcaoCardSelecionada: {
    backgroundColor: 'rgba(159, 168, 255, 0.10)',
    borderColor: 'rgba(159, 168, 255, 0.45)',
  },
  opcaoLetraWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#8A91A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  opcaoLetraWrapperSelecionada: {
    backgroundColor: '#9FA8FF',
    borderColor: '#9FA8FF',
  },
  opcaoLetra: {
    color: '#8A91A6',
    fontSize: 13,
    fontWeight: 'bold',
  },
  opcaoLetraSelecionada: {
    color: '#0A0D14',
  },
  opcaoTexto: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // --- Rodapé fixo ---
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dicaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(19, 22, 32, 0.6)',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  dicaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  responderWrapper: {
    flex: 1,
  },
  responderDesabilitado: {
    opacity: 0.5,
  },
});