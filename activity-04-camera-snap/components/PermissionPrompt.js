import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';

/**
 * PermissionPrompt Component - 100% Complete
 * Shows user-friendly message when permissions are denied
 *
 * Props:
 * - visible: Boolean to show/hide the modal
 * - onClose: Function to call when modal dismissed
 * - permissionType: 'camera' or 'library' (optional, defaults to 'camera')
 */
export default function PermissionPrompt({
  visible,
  onClose,
  permissionType = 'camera',
}) {
  const permissionName = permissionType === 'camera' ? 'Camera' : 'Photo Library';

  const openSettings = () => {
    Linking.openSettings();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              {permissionType === 'camera' ? '📷' : '🖼️'}
            </Text>
          </View>

          <Text style={styles.title}>{permissionName} Access Needed</Text>

          <Text style={styles.description}>
            This app needs access to your {permissionName.toLowerCase()} to let you{' '}
            {permissionType === 'camera' ? 'take photos' : 'select images'}.
          </Text>

          <Text style={styles.instructions}>
            To enable {permissionName.toLowerCase()} access:
          </Text>

          <View style={styles.stepsList}>
            <Text style={styles.step}>1. Tap "Go to Settings" below</Text>
            <Text style={styles.step}>2. Tap "Permissions"</Text>
            <Text style={styles.step}>
              3. Enable "{permissionName}" access
            </Text>
            <Text style={styles.step}>4. Return to this app</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={openSettings}
            >
              <Text style={styles.primaryButtonText}>Go to Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>

          {Platform.OS === 'ios' && (
            <Text style={styles.hint}>
              💡 Tip: You can also enable this in Settings → Privacy → {permissionName}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  instructions: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  stepsList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  step: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
