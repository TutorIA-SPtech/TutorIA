import { ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function PrimaryButton({ title, onPress, loading = false, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={loading ? `${title} em andamento` : title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color="#0A0D14" />
      ) : (
        <>
          <Text style={styles.text}>{title}</Text>
          <Ionicons name="arrow-forward" size={20} color="#0A0D14" />
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#9FA8FF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',

    shadowColor: '#9FA8FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8, 
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  text: {
    color: '#0A0D14',
    fontSize: 16,
    fontWeight: 'bold',
  }
});