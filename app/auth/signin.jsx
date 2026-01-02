import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import globalStyles from "../styles"; // Adjust path as needed
import Input from "../../components/Input";
import Button from "../../components/Button";
import SocialButton from "../../components/SocialButton";

export default function SignInScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    // TODO: Add authentication logic here
    router.push("/profile-selection"); // Navigate after sign in
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Sign In</Text>

      <Input
        label="Email Address"
        labelStyle={{ color: "#286355" }}
        placeholder="Enter Email Address"
      />
      <Input
        label="Password"
        labelStyle={{ color: "#286355" }}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forget Password?</Text>
      </TouchableOpacity>

      <Button title="Sign In" onPress={handleSignIn} />

      <Text style={styles.orText}>Or</Text>

      <View style={styles.socialButtons}>
        <SocialButton
          iconName="logo-google"
          text="Google"
          iconColor="#449985"
        />
        <SocialButton
          iconName="logo-facebook"
          text="Facebook"
          iconColor="blue"
        />
      </View>

      <TouchableOpacity onPress={() => router.push("/auth/signup")}>
        <Text style={styles.switchAuth}>
          Don't Have an account?{" "}
          <Text style={styles.switchAuthHighlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    color: "#286355",
    textAlign: "right",
    marginBottom: 20,
  },
  orText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#286355",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  switchAuth: {
    textAlign: "center",
    color: "#286355",
  },
  switchAuthHighlight: {
    color: "#286355",
    fontWeight: "bold",
  },
});
