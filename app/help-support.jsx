import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import globalStyles from "./styles";
import Button from "../components/Button";
import { ThemeContext } from "../context/ThemeContext";

const HelpSupportScreen = () => {
  const { themeStyles } = useContext(ThemeContext);

  const contactSupport = () => {
    Linking.openURL("mailto:support@example.com");
  };

  const visitHelpCenter = () => {
    Linking.openURL("https://help.example.com");
  };

  const styles = StyleSheet.create({
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      textAlign: "center",
      color: themeStyles.text,
    },
    option: {
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: themeStyles.bgless,
      borderRadius: 8,
    },
    optionText: {
      fontSize: 16,
      textAlign: "center",
      color: themeStyles.text,
    },
    faqHeader: {
      fontSize: 20,
      fontWeight: "600",
      marginTop: 30,
      marginBottom: 15,
      color: themeStyles.text,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: themeStyles.text,
    },
    faqAnswer: {
      fontSize: 16,
      marginBottom: 15,
      color: themeStyles.text,
    },
  });

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: themeStyles.background },
      ]}
    >
      <Text style={styles.header}>Help & Support</Text>

      <TouchableOpacity style={styles.option} onPress={contactSupport}>
        <Text style={styles.optionText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={visitHelpCenter}>
        <Text style={styles.optionText}>Help Center</Text>
      </TouchableOpacity>

      <Text style={styles.faqHeader}>FAQs</Text>
      <Text style={styles.faqQuestion}>Q: How do I update my profile?</Text>
      <Text style={styles.faqAnswer}>
        A: Go to Settings and select "Edit Profile"
      </Text>
    </View>
  );
};

export default HelpSupportScreen;
