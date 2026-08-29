/**
 * FasalDoc - Settings Screen
 * Language toggle, offline mode toggle, about section.
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const [isUrdu, setIsUrdu] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Language: {isUrdu ? "اردو" : "English"}</Text>
        <Switch value={isUrdu} onValueChange={setIsUrdu} />
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Offline Mode</Text>
          <Text style={styles.subLabel}>Use on-device model when no internet is available</Text>
        </View>
        <Switch value={offlineMode} onValueChange={setOfflineMode} />
      </View>

      <TouchableOpacity style={styles.aboutRow}>
        <Text style={styles.label}>About FasalDoc</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aboutRow}>
        <Text style={styles.label}>Send Feedback</Text>
      </TouchableOpacity>

      <Text style={styles.version}>FasalDoc v0.1.0 (MVP)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0", paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 24, color: "#1B1B1B" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: { fontSize: 15, fontWeight: "600", color: "#333" },
  subLabel: { fontSize: 12, color: "#999", marginTop: 2, maxWidth: 220 },
  aboutRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  version: { textAlign: "center", color: "#AAA", marginTop: 20, fontSize: 12 },
});

// ---------------------------------------------------------
// NEXT STEPS:
// 1. Move isUrdu/offlineMode state into a shared React Context (e.g. AppSettingsContext)
//    so other screens (Home, Capture, History) can read/react to these preferences.
// 2. Persist settings with AsyncStorage so they survive app restarts.
// 3. "Offline Mode" toggle should control whether CaptureScreen calls the API_URL
//    backend or runs inference locally via the bundled .tflite model - this is the
//    hook point for Phase 2's offline capability.
// ---------------------------------------------------------
