import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "expo-router";
import globalStyles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { userData, setUserData } = useContext(UserContext);
  const router = useRouter();
  const { themeStyles } = useContext(ThemeContext);

  const handleLogout = async () => {
    // Clear user data
    await AsyncStorage.removeItem("@userData");
    setUserData(null);
    // Redirect to sign-in page
    router.replace("/auth/signin");
  };

  const styles = StyleSheet.create({
    container: {
      padding: 0,
    },
    profileHeader: {
      alignItems: "center",
      padding: 30,
      backgroundColor: themeStyles.bgless,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 15,
      borderWidth: 3,
      borderColor: "#fff",
      backgroundColor: themeStyles.background,
    },
    name: {
      fontSize: 24,
      fontWeight: "600",
      color: themeStyles.text,
      marginBottom: 5,
    },
    age: {
      fontSize: 16,
      color: themeStyles.text,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: themeStyles.text,
      marginBottom: 10,
      paddingLeft: 10,
    },
    allergyContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 10,
    },
    allergyPill: {
      backgroundColor: "#ffe0e0",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 15,
      marginRight: 8,
      marginBottom: 8,
    },
    allergyText: {
      color: "#c62828",
      fontSize: 14,
    },
    menuContainer: {
      paddingHorizontal: 15,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: themeStyles.bgless,
    },
    menuIcon: {
      width: 40,
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      color: themeStyles.text,
    },
  });

  const menuItems = [
    {
      icon: <Ionicons name="settings" size={24} color="#555" />,
      text: "Settings",
      action: () => router.push("/settings"),
    },
    {
      icon: <MaterialIcons name="history" size={24} color="#555" />,
      text: "History",
      action: () => router.push("/history"),
    },
    {
      icon: <FontAwesome name="shopping-cart" size={24} color="#555" />,
      text: "Cart",
      action: () => router.push("/Cart"),
    },
    {
      icon: <Feather name="help-circle" size={24} color="#555" />,
      text: "Help",
      action: () => router.push("/help-support"),
    },
    {
      icon: <FontAwesome name="sign-out" size={24} color="#555" />,
      text: "Logout",
      action: handleLogout,
    },
  ];

  return (
    <View
      style={[
        globalStyles.container,
        styles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader]}>
        <Image
          source={require("../../assets/profile-placeholder.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.name || "User"}</Text>
        <Text style={styles.age}>
          {userData?.age ? `${userData.age} years` : ""}
        </Text>
      </View>

      {/* Allergies Section */}
      {userData?.allergies?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <View style={styles.allergyContainer}>
            {userData.allergies.map((allergy, index) => (
              <View key={index} style={styles.allergyPill}>
                <Text style={styles.allergyText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuIcon}>{item.icon}</View>
            <Text style={styles.menuText}>{item.text}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeStyles.bgless}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProfileScreen;
