/**
 * Image Helper Utilities - 100% Complete
 * Functions for optimizing and processing images
 */

/**
 * Optimize image URI for display
 * Converts local file URIs to proper format
 *
 * @param {string} uri - Raw image URI from ImagePicker
 * @returns {string} Optimized URI ready for display
 */
export const optimizeImageUri = (uri) => {
  if (!uri) return null;

  // Ensure proper URI format for React Native Image component
  if (uri.startsWith('file://')) {
    return uri;
  }

  // Add file:// prefix if missing (Android compatibility)
  if (!uri.startsWith('http') && !uri.startsWith('file://')) {
    return `file://${uri}`;
  }

  return uri;
};

/**
 * Calculate optimized dimensions for image display
 * Maintains aspect ratio while fitting within max dimensions
 *
 * @param {number} width - Original image width
 * @param {number} height - Original image height
 * @param {number} maxWidth - Maximum width constraint
 * @param {number} maxHeight - Maximum height constraint
 * @returns {object} Optimized dimensions { width, height }
 */
export const calculateOptimizedDimensions = (
  width,
  height,
  maxWidth = 400,
  maxHeight = 400
) => {
  let newWidth = width;
  let newHeight = height;

  // Scale down if too wide
  if (newWidth > maxWidth) {
    const ratio = maxWidth / newWidth;
    newWidth = maxWidth;
    newHeight = newHeight * ratio;
  }

  // Scale down if too tall
  if (newHeight > maxHeight) {
    const ratio = maxHeight / newHeight;
    newHeight = maxHeight;
    newWidth = newWidth * ratio;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
};

/**
 * Get file size category for optimization hints
 *
 * @param {number} fileSize - File size in bytes
 * @returns {string} Size category: 'small', 'medium', 'large', 'huge'
 */
export const getFileSizeCategory = (fileSize) => {
  const MB = 1024 * 1024;

  if (fileSize < 0.5 * MB) return 'small';
  if (fileSize < 2 * MB) return 'medium';
  if (fileSize < 5 * MB) return 'large';
  return 'huge';
};

/**
 * Format file size for display
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';

  const KB = 1024;
  const MB = KB * 1024;

  if (bytes < KB) {
    return `${bytes} B`;
  } else if (bytes < MB) {
    return `${(bytes / KB).toFixed(1)} KB`;
  } else {
    return `${(bytes / MB).toFixed(1)} MB`;
  }
};

/**
 * Validate image URI
 *
 * @param {string} uri - Image URI to validate
 * @returns {boolean} True if URI is valid
 */
export const isValidImageUri = (uri) => {
  if (!uri || typeof uri !== 'string') return false;

  // Check for valid URI patterns
  const validPatterns = [
    /^file:\/\//,
    /^https?:\/\//,
    /^content:\/\//,
    /^ph:\/\//,
  ];

  return validPatterns.some((pattern) => pattern.test(uri));
};
