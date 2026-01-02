import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styles from "../styles";
import Button from "../../components/Button";
import { ThemeContext } from "../../context/ThemeContext";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "expo-router";

const FamilyProfileScreen = () => {
  const { themeStyles } = useContext(ThemeContext);
  const { userData, setUserData, familyMembers, setFamilyMembers } =
    useContext(UserContext);

  const router = useRouter();

  const [currentMember, setCurrentMember] = useState({
    name: "",
    age: "",
    allergies: [],
  });
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);

  const allergies = [
    "Peanuts",
    "Milk",
    "Eggs",
    "Tree Nuts",
    "Soy",
    "Wheat",
    "Fish",
    "Shellfish",
  ];

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  const toggleAllergy = (allergy) => {
    setCurrentMember((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((item) => item !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const addMember = () => {
    if (currentMember.name && currentMember.age) {
      setFamilyMembers((prev) => [...prev, currentMember]);
      setCurrentMember({ name: "", age: "", allergies: [] });
      setIsAddingMember(false);
    }
  };

  const removeMember = (index) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user data with combined allergies
      const allAllergies = [
        ...new Set([
          ...(userData?.allergies || []),
          ...familyMembers.flatMap((member) => member.allergies),
        ]),
      ];

      await setUserData((prev) => ({
        ...prev,
        allergies: allAllergies,
      }));

      setIsSaving(false);
      timeoutRef.current = setTimeout(() => {
        router.replace("/(tabs)/profile");
      }, 2000);
    } catch (error) {
      console.error("Failed to save family profile:", error);
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeStyles.background }]}
      >
        <ActivityIndicator size="large" color={themeStyles.primary} />
        <Text style={[styles.title, { color: themeStyles.text }]}>
          Saving Family Data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      <Text style={[styles.title, { color: themeStyles.text }]}>
        Family Profile
      </Text>

      {!isAddingMember ? (
        <>
          {familyMembers.map((member, index) => (
            <View
              key={index}
              style={[
                styles.memberCard,
                { backgroundColor: themeStyles.cardBackground },
              ]}
            >
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: themeStyles.text }]}>
                  {member.name}
                </Text>
                <Text
                  style={[
                    styles.memberDetails,
                    { color: themeStyles.textSecondary },
                  ]}
                >
                  Age: {member.age}
                </Text>
                {member.allergies.length > 0 && (
                  <Text style={[styles.memberDetails, { color: "#e74c3c" }]}>
                    Allergies: {member.allergies.join(", ")}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => removeMember(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Button
            title="Add Family Member"
            onPress={() => setIsAddingMember(true)}
            style={styles.addButton}
          />

          {familyMembers.length > 0 && (
            <Button
              title="Save Family Profile"
              onPress={handleSave}
              disabled={familyMembers.length === 0}
            />
          )}
        </>
      ) : (
        <>
          <TextInput
            style={[
              styles.input,
              { color: themeStyles.text, borderColor: themeStyles.border },
            ]}
            placeholder="Enter Name"
            placeholderTextColor={themeStyles.textSecondary}
            value={currentMember.name}
            onChangeText={(text) =>
              setCurrentMember((prev) => ({ ...prev, name: text }))
            }
          />

          <TextInput
            style={[
              styles.input,
              { color: themeStyles.text, borderColor: themeStyles.border },
            ]}
            placeholder="Enter Age"
            placeholderTextColor={themeStyles.textSecondary}
            value={currentMember.age}
            onChangeText={(text) =>
              setCurrentMember((prev) => ({ ...prev, age: text }))
            }
            keyboardType="numeric"
          />

          <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>
            Select Allergies
          </Text>

          <View style={styles.allergyContainer}>
            {allergies.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                style={[
                  styles.allergyOption,
                  { borderColor: themeStyles.border },
                  currentMember.allergies.includes(allergy) && {
                    backgroundColor: "#e3f2fd",
                    borderColor: "#2196f3",
                  },
                ]}
                onPress={() => toggleAllergy(allergy)}
              >
                <Text
                  style={[
                    styles.allergyText,
                    { color: themeStyles.text },
                    currentMember.allergies.includes(allergy) && {
                      color: "#2196f3",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => setIsAddingMember(false)}
              style={styles.secondaryButton}
            />
            <Button
              title="Add Member"
              onPress={addMember}
              disabled={!currentMember.name || !currentMember.age}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default FamilyProfileScreen;
