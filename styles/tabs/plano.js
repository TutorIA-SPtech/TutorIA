import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },

  // --- Cabeçalho ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#8A91A6',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // --- Progresso geral ---
  progressCard: {
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressLabel: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  progressValue: {
    color: '#9FA8FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressText: {
    color: '#8A91A6',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },

  // --- Linha do tempo dos módulos ---
  moduloRow: {
    flexDirection: 'row',
  },
  nodeColumn: {
    width: 32,
    alignItems: 'center',
  },
  nodeColumnActive: {
    paddingTop: 12,
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeConcluido: {
    backgroundColor: '#57DDA9',
  },
  nodeAndamento: {
    backgroundColor: '#9FA8FF',
  },
  nodeProximo: {
    borderWidth: 1.5,
    borderColor: '#8A91A6',
  },
  nodeBloqueado: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5C668A',
  },
  nodeNumeroDark: {
    color: '#0A0D14',
    fontSize: 13,
    fontWeight: 'bold',
  },
  nodeNumeroLight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  linha: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    borderRadius: 1,
  },
  moduloContent: {
    flex: 1,
    marginLeft: 14,
    paddingBottom: 24,
  },
  moduloContentUltimo: {
    paddingBottom: 0,
  },
  moduloConcluido: { opacity: 0.6 },
  moduloBloqueado: { opacity: 0.4 },
  moduloTitulo: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  moduloDetalhe: {
    color: '#8A91A6',
    fontSize: 13,
    marginTop: 4,
  },

  // --- Módulo em andamento ---
  moduloAtivoCard: {
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: 'rgba(159, 168, 255, 0.45)',
    borderRadius: 20,
    padding: 18,
  },
  moduloAtivoBarra: {
    marginTop: 14,
  },
});