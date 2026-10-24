import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'flex-start' },
  
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  mainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131620',
    borderWidth: 1,
    borderColor: '#202538',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  circleScoreText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainCardTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  mainCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    marginBottom: 8,
  },
  mainCardSubtitle: {
    color: '#8A91A6',
    fontSize: 12,
    lineHeight: 18,
  },

  sectionContainer: { marginBottom: 32 },
  sectionLabel: {
    color: '#5C668A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
  },
  areasList: { gap: 24 },
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
  areaScore: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#202538',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },

  priorityCard: {
    backgroundColor: 'rgba(255, 138, 101, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 101, 0.3)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityLabel: {
    color: '#FF8A65',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 8,
  },
  priorityText: {
    color: '#E0E3EB',
    fontSize: 14,
    lineHeight: 22,
  },

  // --- Footer ---
  footer: { marginTop: 'auto' },
  primaryButton: {
    backgroundColor: '#9FA8FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#0A0D14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});