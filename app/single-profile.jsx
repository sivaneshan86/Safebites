import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import globalStyles from "./styles";
import { UserContext } from "../context/UserContext";

export default function SingleProfileScreen() {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [priority, setPriority] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const allergies = ["Peanuts", "Milk", "Egg", "Fish", "Soy", "Mold"];

  useEffect(() => {
    if (isSaved) {
      // Start animations when saved
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Navigate after delay
      const timer = setTimeout(() => router.push("/profile"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  const toggleAllergy = (allergy) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(
        selectedAllergies.filter((item) => item !== allergy)
      );
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleSave = () => {
    const userProfile = {
      name,
      age,
      allergies: selectedAllergies,
      priority,
    };

    setUserData(userProfile);
    setIsSaved(true);
  };

  if (isSaved) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Single Profile</Text>

        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </Animated.View>

        <Animated.Text style={[styles.successText, { opacity: fadeAnim }]}>
          Saved Successfully
        </Animated.Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>Single Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Your Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Choose your Allergy</Text>

      <View style={styles.allergyContainer}>
        {allergies.map((allergy) => (
          <TouchableOpacity
            key={allergy}
            style={[
              styles.allergyOption,
              selectedAllergies.includes(allergy) && styles.selectedAllergy,
            ]}
            onPress={() => toggleAllergy(allergy)}
          >
            <Text style={styles.allergyText}>{allergy}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionSubtitle}>
        Choose the one that's most important to you.
      </Text>

      <TouchableOpacity
        style={[
          styles.priorityOption,
          priority === "minimize" && styles.selectedPriority,
        ]}
        onPress={() => setPriority("minimize")}
      >
        <Text style={styles.optionText}>Minimize reaction/symptoms</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.priorityOption,
          priority === "products" && styles.selectedPriority,
        ]}
        onPress={() => setPriority("products")}
      >
        <Text style={styles.optionText}>Find products I can eat</Text>
      </TouchableOpacity>

      <Button
        title="Save"
        onPress={handleSave}
        disabled={!name || !age || selectedAllergies.length === 0 || !priority}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  checkmarkContainer: {
    marginVertical: 30,
    width: "100%",
    alignItems: "center",
  },
  successText: {
    fontSize: 22,
    color: "#4CAF50",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  allergyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  allergyOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    margin: 5,
  },
  selectedAllergy: {
    backgroundColor: "#c0f0e8",
    borderColor: "#00897b",
  },
  sectionSubtitle: {
    fontSize: 14,
    marginVertical: 10,
    color: "#555",
  },
  priorityOption: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
  },
  selectedPriority: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f2ff",
  },
  optionText: {
    textAlign: "center",
  },
});
