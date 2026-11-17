import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Estado de tela cheia (carregando / erro) no mesmo visual do questionário.
export default function StateMessage({
  loading = false,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color="#9FA8FF" style={styles.spinner} /> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {primaryLabel ? (
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={onPrimary}>
          <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
        </TouchableOpacity>
      ) : null}
      {secondaryLabel ? (
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.6} onPress={onSecondary}>
          <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  spinner: { marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  message: { color: '#8A91A6', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  primaryButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#9FA8FF',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  primaryButtonText: { color: '#0A0D14', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#202538',
  },
  secondaryButtonText: { color: '#E0E3EB', fontSize: 16, fontWeight: 'bold' },
});
