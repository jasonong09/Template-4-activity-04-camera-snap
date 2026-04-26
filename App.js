import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

// Cross-platform alert utility (works on web, iOS, and Android)
const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n\n${message}`);
    const okButton = buttons.find(b => b.text === 'OK' || b.style !== 'cancel');
    const cancelButton = buttons.find(b => b.style === 'cancel');
    if (result && okButton?.onPress) okButton.onPress();
    if (!result && cancelButton?.onPress) cancelButton.onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
};

// Pre-built components (100% complete - use as-is)
import ImagePreview from './components/ImagePreview';
import ActionButton from './components/ActionButton';
import PermissionPrompt from './components/PermissionPrompt';

// Helper utilities (100% complete)
import { optimizeImageUri, isValidImageUri } from './utils/imageHelpers';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // ==================================================================
  // TODO #1: Request Camera Permission
  // ==================================================================
  // LEARNING GOAL: Understand how to request device permissions properly
  //
  // REQUIREMENTS:
  // 1. Use ImagePicker.requestCameraPermissionsAsync()
  // 2. Check if status is 'granted'
  // 3. Return true if granted, false if denied
  // 4. Show PermissionPrompt if denied (setShowPermissionPrompt(true))
  // 5. Show Alert with helpful message if denied
  //
  // HINTS:
  // - Permission requests are async (use await)
  // - Response object has { status } property
  // - Status can be: 'granted', 'denied', 'undetermined'
  // - Always wrap in try-catch for error handling
  //
  // EXAMPLE PATTERN:
  // const { status } = await ImagePicker.requestCameraPermissionsAsync();
  // if (status === 'granted') { return true; } else { /* handle denial */ }
  //
  const requestCameraPermission = async () => {
  try {
    // 1. Request permission from user
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    // 2. Check if granted
    if (status === 'granted') {
      return true; // Permission granted!
    } else {
      // 3. Handle denial
      setShowPermissionPrompt(true);
      Alert.alert(
        'Camera Permission Needed',
        'Please enable camera access in Settings to take photos',
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (error) {
    console.error('Permission error:', error);
    Alert.alert('Error', 'Failed to request camera permission');
    return false;
   }
  };

  // ==================================================================
  // TODO #2: Launch Camera and Capture Photo
  // ==================================================================
  // LEARNING GOAL: Learn to use expo-image-picker to capture photos
  //
  // REQUIREMENTS:
  // 1. Call requestCameraPermission() first
  // 2. If permission denied, exit early (return)
  // 3. Use ImagePicker.launchCameraAsync() with proper options
  // 4. Check if user canceled (result.canceled === true)
  // 5. Extract image URI from result.assets[0].uri
  // 6. Optimize URI with optimizeImageUri() helper
  // 7. Update state: setSelectedImage(optimizedUri)
  //
  // HINTS:
  // - Camera options: { mediaTypes, allowsEditing, aspect, quality }
  // - MediaTypeOptions.Images restricts to photos only
  // - allowsEditing: true shows crop screen after capture
  // - aspect: [4, 3] sets camera aspect ratio
  // - quality: 0.8 = 80% quality (good balance)
  // - Always check !result.canceled before accessing assets
  //
  // EXAMPLE PATTERN:
  // const result = await ImagePicker.launchCameraAsync({
  //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //   allowsEditing: true,
  //   aspect: [4, 3],
  //   quality: 0.8,
  // });
  // if (!result.canceled) { /* process result */ }
  //
  const handleTakePhoto = async () => {
    try {
      // Step 1: Check permission first
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return; // Permission denied, exit early
    }

    // Step 2: Launch camera with configuration
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // Shows crop screen after capture
      aspect: [4, 3], // Camera aspect ratio
      quality: 0.8, // 0-1 scale, 0.8 = good quality + smaller file
    });

    // Step 3: Check if user took photo (didn't cancel)
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Step 4: Extract image URI and optimize
      const imageUri = result.assets[0].uri;
      const optimizedUri = optimizeImageUri(imageUri);
      setSelectedImage(optimizedUri);
    }

    } catch (error) {
      console.error('Camera error:', error);
      showAlert('Error', 'Failed to open camera. Please try again.');
    }
  };

  // ==================================================================
  // TODO #3: Choose Photo from Library (BONUS - Similar to TODO #2)
  // ==================================================================
  // LEARNING GOAL: Apply camera skills to photo library selection
  //
  // REQUIREMENTS:
  // 1. Request library permission with requestMediaLibraryPermissionsAsync()
  // 2. Use ImagePicker.launchImageLibraryAsync() instead of camera
  // 3. Same options as camera (mediaTypes, allowsEditing, aspect, quality)
  // 4. Same result handling as TODO #2
  //
  // HINTS:
  // - Almost identical to handleTakePhoto
  // - Only differences: permission method and launch method
  // - Library allows selecting existing photos
  // - No camera hardware required (works in simulator)
  //
  const handleChoosePhoto = async () => {
    try {

      // Step 1: Request library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Needed',
        'Please enable photo library access in Settings'
      );
      return;
    }

    // Step 2: Launch photo library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    // Step 3: Handle result (same as camera)
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const optimizedUri = optimizeImageUri(imageUri);
      setSelectedImage(optimizedUri);
    }


    } catch (error) {
      console.error('Library error:', error);
      showAlert('Error', 'Failed to access photo library. Please try again.');
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📷 Camera Snap</Text>
            <Text style={styles.subtitle}>
              Activity 04: Working with Images
            </Text>
          </View>

          {/* Instructions Card */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Your Tasks:</Text>
            <Text style={styles.instructionText}>
              ✏️ TODO #1: Request camera permission
            </Text>
            <Text style={styles.instructionText}>
              ✏️ TODO #2: Launch camera & capture photo
            </Text>
            <Text style={styles.instructionText}>
              ✏️ TODO #3: Choose photo from library (bonus)
            </Text>
          </View>

          {/* Image Preview Area */}
          <View style={styles.previewSection}>
            {selectedImage ? (
              <ImagePreview uri={selectedImage} onClear={handleClearImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderIcon}>📷</Text>
                <Text style={styles.placeholderText}>No image selected yet</Text>
                <Text style={styles.placeholderSubtext}>
                  Take a photo or choose from library
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <ActionButton
              title="📷 Take Photo"
              onPress={handleTakePhoto}
              color="#007AFF"
            />
            <ActionButton
              title="🖼️ Choose from Library"
              onPress={handleChoosePhoto}
              color="#34C759"
            />
          </View>

          {/* Help Text */}
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>💡 Testing Tips:</Text>
            <Text style={styles.helpText}>
              • Physical device required for camera
            </Text>
            <Text style={styles.helpText}>
              • Simulator can select from library
            </Text>
            <Text style={styles.helpText}>
              • Grant permissions when prompted
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Permission Prompt Modal */}
      <PermissionPrompt
        visible={showPermissionPrompt}
        onClose={() => setShowPermissionPrompt(false)}
        permissionType="camera"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  previewSection: {
    marginBottom: 20,
  },
  placeholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    minHeight: 300,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  helpCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#78350f',
    marginBottom: 4,
    lineHeight: 18,
  },
});
