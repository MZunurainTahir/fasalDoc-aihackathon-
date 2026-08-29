/**
 * FasalDoc - Home Screen
 * Landing screen: quick scan actions + recent scan preview.
 */

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    // Refresh recent scans every time Home comes into focus
    const unsubscribe = navigation.addListener("focus", loadRecentScans);
    return unsubscribe;
  }, [navigation]);

  const loadRecentScans = async () => {
    try {
      const stored = await AsyncStorage.getItem("scan_history");
      const history = stored ? JSON.parse(stored) : [];
      setRecentScans(history.slice(0, 3)); // show only the 3 most recent on Home
    } catch (err) {
      console.log("Could not load scan history:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Assalam-o-Alaikum 👋</Text>
      <Text style={styles.title}>What would you like to check today?</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: "#2E7D32" }]}
          onPress={() => navigation.navigate("Capture", { mode: "crop" })}
        >
          <Text style={styles.actionEmoji}>🌾</Text>
          <Text style={styles.actionLabel}>Scan Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: "#795548" }]}
          onPress={() => navigation.navigate("Capture", { mode: "livestock" })}
        >
          <Text style={styles.actionEmoji}>🐄</Text>
          <Text style={styles.actionLabel}>Scan Livestock</Text>
          <Text style={styles.comingSoon}>(coming soon)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Scans</Text>
      {recentScans.length === 0 ? (
        <Text style={styles.emptyText}>No scans yet. Try scanning a crop above.</Text>
      ) : (
        <FlatList
          data={recentScans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyRow}>
              <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
              <View>
                <Text style={styles.historyDisease}>{item.disease}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
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
  greeting: { fontSize: 18, color: "#555" },
  title: { fontSize: 22, fontWeight: "700", marginTop: 4, marginBottom: 24, color: "#1B1B1B" },
  actionGrid: { flexDirection: "row", gap: 12, marginBottom: 30 },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionEmoji: { fontSize: 32, marginBottom: 8 },
  actionLabel: { color: "#fff", fontWeight: "700", fontSize: 15 },
  comingSoon: { color: "#E0E0E0", fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#333" },
  emptyText: { color: "#999", fontSize: 14 },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  thumbnail: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  historyDisease: { fontWeight: "600", fontSize: 14, color: "#333" },
  historyDate: { fontSize: 12, color: "#999" },
});
