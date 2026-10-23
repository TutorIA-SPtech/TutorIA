import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0D14' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#B39DFF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#0A0D14', fontSize: 16, fontWeight: 'bold' },
  greeting: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subGreeting: { color: '#8A91A6', fontSize: 12 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131620', borderWidth: 1, borderColor: 'rgba(255, 209, 102, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  streakText: { color: '#FFD166', fontSize: 14, fontWeight: 'bold', marginLeft: 6 },

  trailCard: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#9aaeff', borderRadius: 24, padding: 24, marginBottom: 40 },
  trailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  trailLabel: { color: '#9FA8FF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  trailTime: { color: '#9FA8FF', fontSize: 12, fontWeight: 'bold' },
  trailContentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  trailTextContent: { flex: 1, paddingRight: 16 },
  trailTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  trailSubtitle: { color: '#E0E3EB', fontSize: 14, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: '#202538', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: '#8A91A6', fontSize: 12 },
  
  circleContainer: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center' },
  circleScoreText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  primaryButton: { backgroundColor: '#9FA8FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 20 },
  primaryButtonText: { color: '#0A0D14', fontSize: 16, fontWeight: 'bold' },

  sectionContainer: { marginBottom: 40 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionLabel: { color: '#5C668A', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  linkText: { color: '#9FA8FF', fontSize: 12, fontWeight: 'bold' },
  domainsList: { gap: 20 },
  domainItem: { width: '100%' },
  domainHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  domainName: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  domainScore: { fontSize: 15, fontWeight: 'bold' },
  barTrack: { height: 8, backgroundColor: '#202538', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  reviewCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 138, 101, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 138, 101, 0.2)', borderRadius: 20, padding: 20 },
  reviewIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 138, 101, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  reviewTextContent: { flex: 1 },
  reviewTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  reviewSubtitle: { color: '#8A91A6', fontSize: 13 },
});