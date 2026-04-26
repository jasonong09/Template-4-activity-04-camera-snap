import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * ActionButton Component - 100% Complete
 * Reusable styled button for actions like "Take Photo" or "Choose from Library"
 *
 * Props:
 * - title: Button text
 * - onPress: Function to call when pressed
 * - color: Background color (optional, defaults to #007AFF)
 * - disabled: Disable button (optional)
 * - loading: Show loading spinner (optional)
 */
export default function ActionButton({
  title,
  onPress,
  color = '#007AFF',
  disabled = false,
  loading = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minHeight: 48, // Proper touch target size
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
