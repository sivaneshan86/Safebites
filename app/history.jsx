import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import globalStyles from "./styles";
import { ThemeContext } from "../context/ThemeContext";

const HistoryScreen = () => {
  const { themeStyles } = useContext(ThemeContext);

  const historyData = [
    { id: "1", date: "2023-05-15", action: "Profile Updated" },
    { id: "2", date: "2023-05-10", action: "Allergy Added: Peanuts" },
    { id: "3", date: "2023-05-01", action: "Family Member Added" },
  ];

  const styles = StyleSheet.create({
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: themeStyles.text,
    },
    historyItem: {
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: themeStyles.bgless,
      borderRadius: 8,
    },
    historyDate: {
      fontSize: 14,
      marginBottom: 5,
      color: themeStyles.text,
    },
    historyAction: {
      fontSize: 16,
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
      <Text style={styles.header}>History</Text>

      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyDate}>{item.date}</Text>
            <Text style={styles.historyAction}>{item.action}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;
