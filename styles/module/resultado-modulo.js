import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },

  // --- Cabeçalho ---
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // --- Card da nota ---
  notaCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },
  notaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  notaValorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  notaValor: {
    color: '#FFFFFF',
    fontSize: 56,
    lineHeight: 60,
    fontWeight: 'bold',
  },
  notaTotal: {
    color: '#5C668A',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 8,
  },
  statusBadge: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
  },
  statusBadgeTexto: {
    color: '#0A0D14',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notaDescricao: {
    color: '#8A91A6',
    fontSize: 13,
    marginTop: 14,
  },
  confete: {
    position: 'absolute',
    borderRadius: 4,
  },

  // --- Acertos por assunto ---
  secaoLabel: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  assuntosList: { gap: 18, marginBottom: 28 },
  assuntoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assuntoNome: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  assuntoPlacar: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  // --- Recado do Tuti ---
  recadoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255, 138, 101, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 101, 0.3)',
    borderRadius: 24,
    padding: 18,
  },
  recadoIcone: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 138, 101, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recadoTexto: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
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