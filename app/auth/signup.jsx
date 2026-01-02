import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Input from "../../components/Input";
import Button from "../../components/Button";
import appStyles from "../styles";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.title}>Sign Up</Text>

      <View style={styles.nameContainer}>
        <Input
          placeholder="Enter First Name"
          containerStyle={{ flex: 1, marginRight: 10 }}
        />
        <Input placeholder="Enter Last Name" containerStyle={{ flex: 1 }} />
      </View>

      <Input label="Email Address" placeholder="Enter Email Address" />
      <Input label="Phone Number" placeholder="Enter Phone Number" />
      <Input label="Password" placeholder="Password" secureTextEntry />
      <Input
        label="Confirm Password"
        placeholder="Confirm Password"
        secureTextEntry
      />

      <Button title="Sign Up" onPress={() => router.push("/auth/signin")} />

      <TouchableOpacity onPress={() => router.push("/auth/signin")}>
        <Text style={styles.switchAuth}>
          Already have an account?{" "}
          <Text style={styles.switchAuthHighlight}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  switchAuth: {
    textAlign: "center",
    color: "#666",
  },
  switchAuthHighlight: {
    color: "#000",
    fontWeight: "bold",
  },
});
