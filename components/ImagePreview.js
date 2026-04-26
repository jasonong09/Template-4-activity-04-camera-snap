import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

/**
 * ImagePreview Component - 100% Complete
 * Displays selected/captured image with proper aspect ratio and clear button
 *
 * Props:
 * - uri: Image URI to display
 * - onClear: Function to call when clear button pressed
 */
export default function ImagePreview({ uri, onClear }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageHeight, setImageHeight] = useState(300);

  // Calculate proper image dimensions while maintaining aspect ratio
  const handleImageLoad = (event) => {
    const { width: imageWidth, height: imgHeight } = event.nativeEvent.source;
    const screenWidth = width - 40; // Account for padding
    const calculatedHeight = (imgHeight / imageWidth) * screenWidth;

    setImageHeight(calculatedHeight);
    setLoading(false);
  };

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  if (!uri) {
    return null;
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading image...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load image</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onClear}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!error && (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri }}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Clear button - positioned at top right */}
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    minHeight: 200,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ff3b30',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
