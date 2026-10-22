import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },

  // --- Cabeçalho ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#0A0D14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingSub: {
    color: '#5C668A',
    fontSize: 13,
    marginTop: 3,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(240, 185, 92, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(240, 185, 92, 0.28)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakText: {
    color: '#F0B95C',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- Trilha de hoje ---
  trilhaCard: {
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  trilhaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trilhaLabel: {
    color: '#9FA8FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  trilhaTempo: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  trilhaBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  trilhaTextWrap: {
    flex: 1,
    marginRight: 16,
  },
  trilhaTitulo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  trilhaSub: {
    color: '#8A91A6',
    fontSize: 13,
    marginTop: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
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

  // --- Seu domínio ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionLink: {
    color: '#9FA8FF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  areasList: { gap: 22, marginBottom: 32 },
  areaItem: { width: '100%' },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  areaName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  areaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  areaScore: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  // --- Revisar antes de esquecer ---
  revisaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 138, 101, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 101, 0.3)',
    borderRadius: 20,
    padding: 18,
  },
  revisaoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 138, 101, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revisaoTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  revisaoTitulo: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  revisaoDetalhe: {
    color: '#8A91A6',
    fontSize: 12,
    marginTop: 3,
  },
});