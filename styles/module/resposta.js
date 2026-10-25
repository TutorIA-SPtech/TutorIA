import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },

  // --- Cabeçalho ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // --- Resultado ---
  resultadoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  resultadoIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultadoTextWrap: {
    flex: 1,
    marginLeft: 16,
  },
  resultadoTitulo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultadoSub: {
    color: '#5C668A',
    fontSize: 13,
    marginTop: 3,
  },
  confete: {
    position: 'absolute',
    borderRadius: 4,
  },

  // --- Cards de explicação ---
  secoesList: { gap: 14 },
  secaoCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  secaoBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secaoBadgeNumero: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secaoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
  secaoDestaque: {
    color: '#57DDA9',
    fontWeight: 'bold',
  },

  // --- O que muda no plano ---
  mapaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapaLabel: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mapaValor: {
    color: '#57DDA9',
    fontSize: 13,
    fontWeight: 'bold',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillAmbar: {
    backgroundColor: 'rgba(240, 185, 92, 0.10)',
    borderColor: 'rgba(240, 185, 92, 0.28)',
  },
  pillText: {
    color: '#8A91A6',
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextAmbar: {
    color: '#F0B95C',
    fontWeight: 'bold',
  },

  // --- Botão fixo no rodapé ---
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
});