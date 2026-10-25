import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },

  // --- Cabeçalho ---
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 18,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  mascote: {
    width: 56,
    height: 64,
  },
  heroTextWrap: { flex: 1 },
  heroTitulo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#5C668A',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  // --- Cards de mudança ---
  mudancasList: { gap: 12, marginBottom: 12 },
  mudancaCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
  },
  mudancaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  mudancaBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mudancaTag: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mudancaTitulo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mudancaSub: {
    color: '#8A91A6',
    fontSize: 13,
    marginTop: 6,
  },

  // --- Impacto no prazo ---
  impactoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 24,
    padding: 20,
  },
  impactoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactoLabel: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  impactoValor: {
    color: '#9FA8FF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  impactoNota: {
    color: '#5C668A',
    fontSize: 12,
    marginTop: 12,
  },

  // --- Rodapé fixo ---
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#202538',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
  },
  secondaryButtonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});