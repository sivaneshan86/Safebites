import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import globalStyles from "./styles";
import Button from "../components/Button";

export default function ProfileSelectionScreen() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleContinue = () => {
    if (selectedProfile === "single") {
      router.push("/single-profile");
    } else if (selectedProfile === "family") {
      router.push("/(tabs)/familyprofile");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Select Profile</Text>

      <TouchableOpacity
        style={[
          styles.profileOption,
          selectedProfile === "single" && styles.selectedOption,
        ]}
        onPress={() => setSelectedProfile("single")}
      >
        <Text style={styles.optionText}>Single Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.profileOption,
          selectedProfile === "family" && styles.selectedOption,
        ]}
        onPress={() => setSelectedProfile("family")}
      >
        <Text style={styles.optionText}>Family Profile</Text>
      </TouchableOpacity>

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileOption: {
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f2ff",
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
  },
});
