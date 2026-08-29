/**
 * FasalDoc - History Screen
 * Shows all past scans stored locally on the device (AsyncStorage for MVP).
 * Later: sync to backend so history persists across devices/reinstalls.
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("scan_history");
      setHistory(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.log("Could not load history:", err);
    }
  }, []);

  // Reload every time this screen is focused, not just on mount
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const clearHistory = async () => {
    await AsyncStorage.removeItem("scan_history");
    setHistory([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <Text style={styles.emptyText}>
          You haven't scanned anything yet. Go to Home to scan your first crop.
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
              <View style={styles.cardInfo}>
                <Text style={styles.disease}>{item.disease}</Text>
                <Text style={styles.confidence}>
                  {(item.confidence * 100).toFixed(0)}% confidence
                </Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0", paddingTop: 60, paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#1B1B1B" },
  clearText: { color: "#B71C1C", fontWeight: "600" },
  emptyText: { color: "#999", fontSize: 14, marginTop: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 14 },
  cardInfo: { flex: 1 },
  disease: { fontSize: 15, fontWeight: "700", color: "#333" },
  confidence: { fontSize: 13, color: "#2E7D32", marginTop: 2 },
  date: { fontSize: 12, color: "#999", marginTop: 2 },
});

// ---------------------------------------------------------
// NOTE: for this to actually populate, CaptureScreen needs to save each
// successful result into AsyncStorage under the "scan_history" key, e.g.:
//
//   const entry = {
//     id: Date.now().toString(),
//     imageUri: capturedImage,
//     disease: result.disease,
//     confidence: result.confidence,
//     date: new Date().toLocaleDateString(),
//   };
//   const existing = JSON.parse((await AsyncStorage.getItem("scan_history")) || "[]");
//   await AsyncStorage.setItem("scan_history", JSON.stringify([entry, ...existing]));
//
// Add this inside CaptureScreen's analyzeImage() function, right after setResult(data).
// ---------------------------------------------------------
