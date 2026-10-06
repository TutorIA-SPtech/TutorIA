import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'flex-start',
  },
  
  // --- Progress Ring ---
  progressContainer: {
    alignSelf: 'center',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoWrapper: {
    position: 'absolute',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },

  // --- Headings ---
  textHeaderGroup: {
    marginBottom: 40,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    color: '#5C668A',
    fontSize: 16,
    fontWeight: '500',
  },

  // --- Task List ---
  taskList: {
    gap: 20,
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskText: {
    color: '#5C668A', // Cor padrão quando pendente/carregando
    fontSize: 16,
    fontWeight: '600',
  },
  taskTextDone: {
    color: '#FFFFFF', // Fica branco puro ao receber o check verde
  },

  // --- Spinners e Bolinhas ---
  loadingDashedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#5C668A',
    borderStyle: 'dashed',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'transparent', // Mantém o espaçamento, mas invisível
  },

  // --- Footer ---
  footer: {
    marginTop: 40,
  },
  footerText: {
    color: '#5C668A',
    fontSize: 14,
    lineHeight: 22,
  }
});