/**
 * FasalDoc - App Navigation Structure
 *
 * Screens:
 *   Home       - landing screen, quick actions (scan crop / scan livestock), recent scans
 *   Capture    - camera/gallery capture + diagnosis (the screen built earlier)
 *   History    - past scans, stored locally so farmers can revisit old diagnoses
 *   Settings   - language toggle (Urdu/English), offline mode toggle, about
 *
 * Setup:
 *   npx expo install @react-navigation/native @react-navigation/native-stack
 *   npx expo install @react-navigation/bottom-tabs
 *   npx expo install react-native-screens react-native-safe-area-context
 *   npm install @react-native-async-storage/async-storage
 *
 * File layout suggestion:
 *   App.js                  <- this file
 *   screens/HomeScreen.js
 *   screens/CaptureScreen.js   <- already built
 *   screens/HistoryScreen.js
 *   screens/SettingsScreen.js
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import CaptureScreen from "./screens/CaptureScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// -----------------------------------------------------
// Home stack - allows Home to push into Capture without
// losing the bottom tab bar structure elsewhere
// -----------------------------------------------------
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Capture" component={CaptureScreen} />
    </Stack.Navigator>
  );
}

// -----------------------------------------------------
// Root: bottom tab navigation
// -----------------------------------------------------
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#2E7D32",
          tabBarInactiveTintColor: "#9E9E9E",
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Home: "home",
              History: "time",
              Settings: "settings",
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ---------------------------------------------------------
// NEXT STEPS (don't skip these):
// 1. Build the 3 remaining screen files (skeletons below) - HomeScreen is the most
//    important one to get right, it's the first thing every user sees.
// 2. Wire CaptureScreen's "Scan Another" / result flow to save each scan into
//    History (AsyncStorage for MVP - a real database can come later).
// 3. Add a language context (React Context) at the App.js level so Settings'
//    language toggle can affect all screens, not just itself.
// ---------------------------------------------------------
