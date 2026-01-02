// app/_layout.js
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { ThemeProvider } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <StatusBar style="auto" backgroundColor="transparent" translucent />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </UserProvider>
  );
}
