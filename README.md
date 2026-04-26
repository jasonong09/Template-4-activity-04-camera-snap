# Activity 04: Camera Snap - Discovery Challenge

**65% Pre-Built Template for Learning Image Handling in React Native**

## 🎯 What You'll Learn

By completing this activity, you will:
- Request and handle device permissions (camera & photo library)
- Use expo-image-picker to capture photos with the camera
- Select images from the device photo library
- Display images with proper sizing and optimization
- Handle permission denials gracefully with user-friendly UI

**Total Time**: 60 minutes
**Difficulty**: Intermediate
**Concept**: Concept 04 - Working with Images

---

## 🚀 Quick Start (30 Seconds)

```bash
# 1. Navigate to template folder
cd activity-04-camera-snap

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start Expo development server
npx expo start

# 4. Open on your device with Expo Go app
# Scan the QR code that appears in your terminal
```

**⚠️ Important**: Camera features require a **physical device**. The iOS Simulator and Android Emulator can only access the photo library, not the camera.

---

## ✨ What's Already Working (65%)

This template comes **partially complete** with working components you can use immediately:

### ✅ Pre-Built Components (100% Complete)

1. **ImagePreview Component** (`components/ImagePreview.js`)
   - Displays selected images with proper aspect ratio
   - Maintains image quality while fitting screen
   - Shows loading spinner while image loads
   - Clear button (✕) to remove image
   - Error handling with retry option

2. **PermissionPrompt Component** (`components/PermissionPrompt.js`)
   - Beautiful modal for permission requests
   - Step-by-step instructions for enabling permissions
   - "Go to Settings" button that opens device settings
   - Platform-specific hints (iOS/Android)

3. **ActionButton Component** (`components/ActionButton.js`)
   - Reusable styled buttons
   - Loading state support
   - Proper 48px touch targets (mobile best practice)
   - Color customization

4. **Image Helper Utilities** (`utils/imageHelpers.js`)
   - URI optimization for React Native
   - File size formatting
   - Image dimension calculations
   - URI validation

### ⚠️ What You'll Build (35% - 3 TODOs)

- **TODO #1**: Request camera permission from user
- **TODO #2**: Launch camera and capture photo
- **TODO #3**: Choose photo from library (bonus)

---

## 📋 Complete the TODOs

### TODO #1: Request Camera Permission (15 min)

**Learning Goal**: Understand how to request device permissions properly

**File to Edit**: `App.js` (line ~50)

**What to Implement**:
```javascript
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
```

**Key Concepts**:
- Permission requests are async (take time, use `await`)
- Response has `{ status }` property
- Status values: `'granted'`, `'denied'`, `'undetermined'`
- Always wrap in try-catch for safety

**Success Criteria**:
- [ ] Function compiles without errors
- [ ] Returns `true` when permission granted
- [ ] Returns `false` when permission denied
- [ ] Shows Alert when denied

---

### TODO #2: Launch Camera and Capture Photo (20 min)

**Learning Goal**: Learn to use expo-image-picker to capture photos

**File to Edit**: `App.js` (line ~85)

**What to Implement**:
```javascript
const handleTakePhoto = async () => {
  try {
    // Step 1: Check permission first
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return; // Permission denied, exit early
    }

    // Step 2: Launch camera with configuration
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    Alert.alert('Error', 'Failed to take photo. Please try again.');
  }
};
```

**Key Concepts**:
- Always check permission BEFORE launching camera
- `launchCameraAsync()` returns `{ canceled, assets }` object
- `result.canceled === false` means user took photo
- Image URI is in `result.assets[0].uri` (not `result.uri`)
- `allowsEditing: true` shows crop/edit screen (better UX)
- `quality: 0.8` balances quality and file size

**Success Criteria**:
- [ ] Camera opens when button pressed
- [ ] Can capture photo successfully
- [ ] Photo appears in ImagePreview component
- [ ] Can cancel camera without error
- [ ] Clear button removes image

---

### TODO #3: Choose Photo from Library (15 min - BONUS)

**Learning Goal**: Apply camera skills to photo library selection

**File to Edit**: `App.js` (line ~120)

**What to Implement**:
```javascript
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    Alert.alert('Error', 'Failed to select photo');
  }
};
```

**Key Concepts**:
- Almost identical to `handleTakePhoto`
- Only differences: permission method and launch method
- Library selection works in simulator (camera doesn't)
- Same result structure as camera

**Success Criteria**:
- [ ] Photo library opens when button pressed
- [ ] Can select existing photo
- [ ] Photo displays correctly
- [ ] Works on both device and simulator

---

## 🧪 Testing Your Work

### Manual Testing Checklist

**Core Functionality**:
- [ ] App loads without errors
- [ ] Placeholder shows "No image selected yet"
- [ ] Camera button requests permission (first time)
- [ ] Camera opens after permission granted
- [ ] Can capture photo successfully
- [ ] Photo displays in large preview
- [ ] Clear button (✕) removes image
- [ ] Library button works (selects existing photos)
- [ ] Can switch between camera and library
- [ ] No red error screens

**Permission Handling**:
- [ ] Permission dialog shows with clear message
- [ ] Denying permission shows helpful Alert
- [ ] PermissionPrompt modal has "Go to Settings" button
- [ ] Can grant permission later and camera works

**Edge Cases**:
- [ ] Cancel camera without photo - no error
- [ ] Cancel library selection - no error
- [ ] Select very large image - loads without crash
- [ ] Take multiple photos - each replaces previous

**Platform-Specific**:
- [ ] iOS: Permission dialog uses native UI
- [ ] Android: Permission handling works correctly
- [ ] Physical device: Camera actually opens
- [ ] Simulator: Library selection works

---

## 🎨 Features Included

### User Interface
- Clean, modern design with proper spacing
- Instructions card showing TODOs
- Large image preview area with placeholder
- Two action buttons (camera & library)
- Help card with testing tips
- Loading states and error handling

### Code Structure
- **Pre-built components**: ImagePreview, PermissionPrompt, ActionButton
- **Utility functions**: Image optimization helpers
- **Error handling**: Try-catch blocks, user-friendly alerts
- **State management**: React hooks (useState)
- **Comments**: Detailed TODO markers with learning context

---

## 🚀 Extension Challenges

After completing all TODOs, try these challenges:

### Beginner Extensions
- [ ] Add image dimensions display (width × height)
- [ ] Show file size below image
- [ ] Add timestamp when photo was taken
- [ ] Create gallery to store multiple photos

### Intermediate Extensions
- [ ] Implement basic filters (grayscale, sepia) using expo-image-manipulator
- [ ] Add custom crop after selection
- [ ] Save photos to device gallery using expo-media-library
- [ ] Show photo metadata (EXIF data)

### Advanced Extensions
- [ ] Multi-select: Choose multiple photos from library at once
- [ ] Camera effects: Add face detection overlay
- [ ] Cloud upload: Upload images to Firebase Storage
- [ ] Image editing: Add text/stickers to photos

**Hints for Extensions**:
- For filters: Install `expo-image-manipulator` package
- For saving: Use `expo-media-library` API
- For multi-select: Set `allowsMultipleSelection: true`
- For cloud: Activity 07 (Fetch Weather) covers API integration

---

## 📚 Learning Resources

**Official Documentation**:
- [Expo Image Picker Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo Permissions Guide](https://docs.expo.dev/guides/permissions/)
- [React Native Image Component](https://reactnative.dev/docs/image)

**Permission Best Practices**:
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/requesting-permission)
- [Android Permissions Guide](https://developer.android.com/training/permissions/requesting)

**Troubleshooting**:
- [Common Image Picker Errors](https://docs.expo.dev/versions/latest/sdk/imagepicker/#common-issues)
- [Permission Issues on Android](https://docs.expo.dev/guides/permissions/)

---

## ❌ Common Mistakes & Solutions

### Mistake #1: Not Checking Permission Status
```javascript
// ❌ WRONG - Crashes if permission denied
const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync();
  // Camera won't open without permission!
};

// ✅ CORRECT - Check permission first
const handleTakePhoto = async () => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return; // Exit if denied

  const result = await ImagePicker.launchCameraAsync();
};
```

### Mistake #2: Wrong Result Structure
```javascript
// ❌ WRONG - result.uri doesn't exist!
const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync();
  setSelectedImage(result.uri); // undefined!
};

// ✅ CORRECT - Use assets array
const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync();
  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri); // Correct path
  }
};
```

### Mistake #3: No Cancel Handling
```javascript
// ❌ WRONG - Crashes if user cancels
const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync();
  setSelectedImage(result.assets[0].uri); // Error if canceled!
};

// ✅ CORRECT - Check if user canceled
const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync();
  if (!result.canceled && result.assets) {
    setSelectedImage(result.assets[0].uri);
  }
};
```

---

## 🏆 Success Criteria

Your activity is complete when:

✅ **Permission Handling**: Properly requests and checks camera/library permissions with user-friendly messages

✅ **Image Capture**: Successfully opens camera, captures photo, and retrieves image URI

✅ **UI Integration**: Displays selected images with proper sizing, aspect ratio, and clear functionality

**Final Check**:
```bash
# Run this to ensure everything works:
npx expo start --clear

# Test on physical device (camera requires real hardware)
# If camera opens, photo displays, and clear works - you're done! 🎉
```

---

## 🔗 How This Connects to Projects

This activity teaches skills you'll use in your final projects:

**Project 1 (Creative Studio)**: Profile photos using camera/library selection

**Project 2 (Learn & Play)**: Upload lesson images, user avatars

**Project 3 (Community Connector)**: Post images in social feeds

**Project 4 (Portfolio App)**: Project screenshots, profile pictures

**Related Activities**:
- **Activity 05 (Screen Navigator)**: Navigate to full-screen image viewer
- **Activity 06 (Save My Data)**: Persist image URIs with AsyncStorage
- **Activity 07 (Fetch Weather)**: Upload images to APIs
- **Activity 10 (Optimized List)**: Display image galleries efficiently

---

## 📝 File Structure Reference

```
activity-04-camera-snap/
├── App.js                      # Main app with 3 TODOs (65% complete)
├── package.json                # Dependencies (includes expo-image-picker)
├── app.json                    # Expo config with camera permissions
├── babel.config.js             # Babel configuration
├── .gitignore                  # Git ignore patterns
├── README.md                   # This file
├── components/
│   ├── ImagePreview.js         # ✅ 100% complete - displays images
│   ├── PermissionPrompt.js     # ✅ 100% complete - permission UI
│   └── ActionButton.js         # ✅ 100% complete - styled buttons
└── utils/
    └── imageHelpers.js         # ✅ 100% complete - optimization utilities
```

---

## 💡 Tips for Success

1. **Test on Physical Device**: Camera features don't work in simulator
2. **Grant Permissions**: Always allow when prompted (you can change later)
3. **Read TODO Comments**: They contain hints and example patterns
4. **Console Logs**: Check terminal for errors if something doesn't work
5. **Start Simple**: Complete TODO #1, test it, then move to TODO #2
6. **Use Pre-Built Components**: Don't modify ImagePreview or ActionButton
7. **Ask for Help**: If stuck, review the Activity 04 lesson content

---

**Ready to Build?** Start with TODO #1 in `App.js` and follow the instructions! 🚀

---

*Activity 04 | M1: Mobile Apps I Love | React Native & Expo SDK 54*
