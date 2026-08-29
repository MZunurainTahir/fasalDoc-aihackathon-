/**
 * FasalDoc - Camera Capture Screen
 * Built with Expo (recommended for your team - much faster setup than bare React Native,
 * handles camera permissions and builds without needing native Android/iOS toolchains yet).
 *
 * Setup:
 *   npx create-expo-app fasaldoc-app
 *   cd fasaldoc-app
 *   npx expo install expo-camera expo-image-picker
 *
 * Drop this file in as screens/CaptureScreen.js and wire it into your navigation.
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

// Point this at your FastAPI backend. Use your machine's local IP (not "localhost")
// when testing on a physical phone, e.g. "http://192.168.1.5:8000"
const API_URL = "http://YOUR_BACKEND_IP:8000/predict";

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  // -----------------------------------------------------
  // Permission handling
  // -----------------------------------------------------
  if (!permission) {
    return <View style={styles.container} />; // permissions still loading
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          FasalDoc needs camera access to scan your crops.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // -----------------------------------------------------
  // Capture photo from live camera
  // -----------------------------------------------------
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedImage(photo.uri);
      setShowCamera(false);
      setResult(null);
    } catch (err) {
      Alert.alert("Camera Error", "Could not capture photo. Try again.");
    }
  };

  // -----------------------------------------------------
  // Alternative: pick from gallery (useful for testing without a real plant nearby)
  // -----------------------------------------------------
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  // -----------------------------------------------------
  // Send image to backend for prediction
  // -----------------------------------------------------
  const analyzeImage = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: capturedImage,
        name: "crop_photo.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      Alert.alert(
        "Connection Error",
        "Could not reach FasalDoc servers. Check your internet connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
  };

  // -----------------------------------------------------
  // RENDER: Live camera view
  // -----------------------------------------------------
  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // -----------------------------------------------------
  // RENDER: Main screen (before/after capture)
  // -----------------------------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FasalDoc</Text>
      <Text style={styles.subtitle}>Scan a crop leaf to check its health</Text>

      {!capturedImage ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowCamera(true)}
          >
            <Text style={styles.buttonText}>📷 Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
            <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          {!result && !isAnalyzing && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryButton} onPress={analyzeImage}>
                <Text style={styles.buttonText}>Analyze</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={resetCapture}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          )}

          {isAnalyzing && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.analyzingText}>Analyzing your crop...</Text>
            </View>
          )}

          {result && (
            <View style={styles.resultCard}>
              {result.is_confident ? (
                <>
                  <Text style={styles.resultDisease}>{result.disease}</Text>
                  <Text style={styles.resultConfidence}>
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </Text>

                  {result.remedy && (
                    <View style={styles.remedyBox}>
                      <Text style={styles.remedyTitle}>Recommended Remedy</Text>
                      {result.remedy.organic && (
                        <Text style={styles.remedyText}>
                          🌿 Organic: {result.remedy.organic}
                        </Text>
                      )}
                      {result.remedy.chemical && (
                        <Text style={styles.remedyText}>
                          🧪 Chemical: {result.remedy.chemical}
                        </Text>
                      )}
                      {result.remedy.dosage && (
                        <Text style={styles.remedyText}>
                          📏 Dosage: {result.remedy.dosage}
                        </Text>
                      )}
                    </View>
                  )}
                </>
              ) : (
                <Text style={styles.uncertainText}>
                  Not confident enough to diagnose this image. Try a clearer, closer
                  photo of the affected leaf/area in good lighting.
                </Text>
              )}

              <TouchableOpacity style={styles.primaryButton} onPress={resetCapture}>
                <Text style={styles.buttonText}>Scan Another</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// -----------------------------------------------------
// STYLES
// -----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F0",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: "#757575",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
  },
  cancelButton: {
    padding: 10,
  },
  previewContainer: {
    width: "90%",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  analyzingText: {
    marginTop: 12,
    color: "#555",
    fontSize: 15,
  },
  resultCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultDisease: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 4,
  },
  resultConfidence: {
    fontSize: 14,
    color: "#777",
    marginBottom: 16,
  },
  remedyBox: {
    width: "100%",
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  remedyTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 8,
    color: "#33691E",
  },
  remedyText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  uncertainText: {
    fontSize: 14,
    color: "#B71C1C",
    textAlign: "center",
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});

// ---------------------------------------------------------
// NEXT STEPS (don't skip these):
// 1. Replace API_URL with your actual backend address. For physical device testing,
//    use your computer's local network IP, not "localhost" - the phone can't resolve that.
// 2. Add this screen to your navigation stack (React Navigation recommended):
//       npx expo install @react-navigation/native @react-navigation/native-stack
// 3. Once online mode works end-to-end, revisit offline mode: bundle the .tflite model
//    with the app using a library like react-native-fast-tflite, and add a toggle/fallback
//    for when there's no internet connection.
// 4. Add Urdu translation for all UI strings - consider react-i18next or a simple
//    strings object swap based on a language toggle in settings.
// ---------------------------------------------------------
