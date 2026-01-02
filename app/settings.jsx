import React, { useContext } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import globalStyles from "./styles";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext"; // 👈 For logout
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const { changeTheme, theme, themeStyles } = useContext(ThemeContext);
  const { setUserData } = useContext(UserContext); // 👈 For clearing user data

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(
    theme === "dark"
  );

  const router = useRouter();

  const handleSave = () => {
    // Persist settings if needed
    router.back();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("@userData");
          setUserData(null); // Clear user session/context
          router.replace("/auth/signin");
        },
      },
    ]);
  };

  const change = () => {
    setDarkModeEnabled((prev) => !prev);
    changeTheme();
  };

  const styles = StyleSheet.create({
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      textAlign: "center",
      color: themeStyles.text,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
    },
    settingText: {
      fontSize: 16,
      color: themeStyles.text,
    },
    saveButton: {
      marginTop: 30,
      backgroundColor: "#4CAF50",
    },
    logoutButton: {
      marginTop: 20,
      backgroundColor: "#E53935",
    },
  });

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch value={darkModeEnabled} onValueChange={change} />
      </View>

      <Button
        title="Save Settings"
        onPress={handleSave}
        style={styles.saveButton}
      />

      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
};

export default SettingsScreen;
