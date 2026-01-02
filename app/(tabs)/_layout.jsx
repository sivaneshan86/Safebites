import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  const { themeStyles, theme } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Extract the base name (removes any nested paths)
          const baseRouteName = route.name.split("/")[0];

          if (baseRouteName === "profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (baseRouteName === "chatbot") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (baseRouteName === "familyprofile") {
            iconName = focused ? "people" : "people-outline";
          } else if (baseRouteName === "scanner") {
            iconName = focused ? "barcode" : "barcode-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeStyles.text,
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: themeStyles.bgless,
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: themeStyles.text,
        },
        tabBarStyle: {
          backgroundColor: themeStyles.bgless,
          paddingTop: 4,
          height: 60,
          borderTopColor: "transparent",
          elevation: 0,
          borderColor: "transparent",
        },
      })}
    >
      <StatusBar
        style={theme == "dark" ? "dark" : "light"}
        backgroundColor="transparent"
        translucent
      />

      {/* Scanner tab and related screens */}
      <Tabs.Screen name="scanner/index" options={{ title: "Scanner" }} />
      <Tabs.Screen
        name="scanner/product"
        options={{
          href: null, // This hides it from the tab bar
          title: "Product Details",
        }}
      />

      {/* Other tabs */}
      <Tabs.Screen name="familyprofile" />
      <Tabs.Screen name="chatbot" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
