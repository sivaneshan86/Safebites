import React, { useEffect, useRef, useContext } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from "../context/UserContext"; // Adjust path as needed

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const { userData } = useContext(UserContext);

  useEffect(() => {
    // Start the animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Determine where to navigate based on user data
    const timeout = setTimeout(() => {
      if (userData && userData.name) {
        // Check if user data exists
        router.replace("/(tabs)/profile");
      } else {
        router.replace("/auth/signin");
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [userData]); // Add userData as dependency

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.title,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        SafeBytes
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Scan smart. Live safe.
      </Animated.Text>
    </View>
  );
}

// Keep your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1B26",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00E0FF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#B0BEC5",
    marginTop: 10,
  },
});
